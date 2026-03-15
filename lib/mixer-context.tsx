'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    useTransition,
} from 'react';
import {
    SoundCategory,
    SoundDef,
    SOUNDS_BY_ID,
    getSoundsByCategory,
} from './sounds';
import { engine } from './audio-engine';

export const serializeMix = (sounds: Record<string, number>) => {
    return Object.entries(sounds)
        .map(
            ([id, vol]) => `${encodeURIComponent(id)}:${Math.round(vol * 100)}`
        )
        .join(',');
};

export const deserializeMix = (mixStr: string): Record<string, number> => {
    const sounds: Record<string, number> = {};
    if (!mixStr) return sounds;

    // New format: "<encodedId>:<vol>,<encodedId>:<vol>"
    if (mixStr.includes(':')) {
        mixStr.split(',').forEach((part) => {
            const [encodedId, volStr] = part.split(':');
            const vol = parseInt(volStr, 10);
            if (encodedId && !Number.isNaN(vol)) {
                try {
                    sounds[decodeURIComponent(encodedId)] = vol / 100;
                } catch {
                    // Ignore malformed IDs.
                }
            }
        });
        return sounds;
    }

    // Legacy format: "<id>_<vol>-<id>_<vol>" (IDs may contain '-').
    const segments = mixStr.split('-');
    let chunk: string[] = [];
    segments.forEach((segment) => {
        chunk.push(segment);
        const joined = chunk.join('-');
        const match = joined.match(/^(.*)_([0-9]{1,3})$/);
        if (match) {
            const id = match[1];
            const vol = parseInt(match[2], 10);
            if (id && !Number.isNaN(vol)) {
                sounds[id] = vol / 100;
            }
            chunk = [];
        }
    });

    return sounds;
};

export interface SavedMix {
    id: string;
    name: string;
    mixStr: string;
}

interface MixerState {
    activeSounds: Record<string, number>;
    masterVolume: number;
    isPlaying: boolean;
    savedMixes: SavedMix[];
}

interface MixerContextType extends MixerState {
    toggleSound: (id: string) => void;
    setVolume: (id: string, volume: number) => void;
    setMasterVolume: (volume: number) => void;
    stopAll: () => void;
    pause: () => void;
    clearCategory: (category: SoundCategory) => void;
    toggleMasterPlay: () => void;
    saveMix: (name: string) => void;
    loadMix: (mixStr: string) => void;
    deleteMix: (id: string) => void;
}

const MixerContext = createContext<MixerContextType | undefined>(undefined);

export function MixerProvider({ children }: { children: React.ReactNode }) {
    const [activeSounds, setActiveSounds] = useState<Record<string, number>>(
        {}
    );
    const [masterVolume, setMasterVolumeState] = useState(0.9);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [savedMixes, setSavedMixes] = useState<SavedMix[]>([]);
    const [isPending, startTransition] = useTransition();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const normalizeActiveSounds = useCallback(
        (sounds: Record<string, number>) => {
            const normalized: Record<string, number> = {};
            Object.entries(sounds).forEach(([id, volume]) => {
                if (!SOUNDS_BY_ID[id]) return;
                const safeVolume = Math.min(1, Math.max(0, volume));
                normalized[id] = safeVolume;
            });
            return normalized;
        },
        []
    );

    const playSoundById = useCallback((id: string, volume: number) => {
        const soundDef = SOUNDS_BY_ID[id];
        if (soundDef) {
            engine.playSound(soundDef, volume);
        }
    }, []);

    const stopSoundById = useCallback((id: string) => {
        engine.stopSound(id);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const mixParam = params.get('mix');

        if (mixParam) {
            setActiveSounds(normalizeActiveSounds(deserializeMix(mixParam)));
        }

        const savedPresets = localStorage.getItem('gridmix_saved_mixes');
        if (savedPresets) {
            try {
                setSavedMixes(JSON.parse(savedPresets));
            } catch (e) {}
        }

        setIsInitialized(true);
    }, [normalizeActiveSounds]);

    useEffect(() => {
        if (!isInitialized) return;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            startTransition(() => {
                const mixStr = serializeMix(activeSounds);

                const url = new URL(window.location.href);
                if (mixStr) {
                    url.searchParams.set('mix', mixStr);
                } else {
                    url.searchParams.delete('mix');
                }
                window.history.replaceState({}, '', url.toString());
            });
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [activeSounds, isInitialized]);

    useEffect(() => {
        const initAudio = () => {
            engine.init();
            window.removeEventListener('click', initAudio);
        };
        window.addEventListener('click', initAudio);
        return () => window.removeEventListener('click', initAudio);
    }, []);

    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'Soro',
                artist: 'Ambient Sound Generator',
                artwork: [
                    {
                        src: '/icon/icon-512',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            });

            navigator.mediaSession.setActionHandler('play', () => {
                setIsPlaying(true);
                Object.entries(activeSounds).forEach(([id, vol]) => {
                    playSoundById(id, vol);
                });
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                setIsPlaying(false);
                Object.keys(activeSounds).forEach((id) => {
                    stopSoundById(id);
                });
            });

            navigator.mediaSession.setActionHandler('stop', () => {
                setActiveSounds({});
                engine.stopAll();
                setIsPlaying(false);
            });
        }
    }, [activeSounds, playSoundById, stopSoundById]);

    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = isPlaying
                ? 'playing'
                : 'paused';
        }
    }, [isPlaying]);

    const toggleSound = useCallback(
        (id: string) => {
            setActiveSounds((prev) => {
                const next = { ...prev };
                const isCurrentlyEmpty = Object.keys(prev).length === 0;
                const wasActive = next[id] !== undefined;

                if (next[id] !== undefined) {
                    delete next[id];
                    stopSoundById(id);

                    if (Object.keys(next).length === 0) {
                        setIsPlaying(false);
                    }
                } else {
                    next[id] = 0.5;
                    if (isCurrentlyEmpty) {
                        setIsPlaying(true);
                        playSoundById(id, 0.5);
                    } else if (isPlaying) {
                        playSoundById(id, 0.5);
                    }
                }
                return next;
            });
        },
        [isPlaying, playSoundById, stopSoundById]
    );

    const setVolume = useCallback(
        (id: string, volume: number) => {
            setActiveSounds((prev) => {
                const soundExists = prev[id] !== undefined;
                if (!soundExists) return prev;
                const next = { ...prev, [id]: volume };
                if (isPlaying) {
                    engine.setVolume(id, volume);
                }
                return next;
            });
        },
        [isPlaying]
    );

    const setMasterVolume = useCallback((volume: number) => {
        setMasterVolumeState(volume);
        engine.setMasterVolume(volume);
    }, []);

    const stopAll = useCallback(() => {
        setActiveSounds({});
        engine.stopAll();
        setIsPlaying(false);
    }, []);

    const pause = useCallback(() => {
        setIsPlaying(false);
        Object.keys(activeSounds).forEach((id) => {
            stopSoundById(id);
        });
    }, [activeSounds, stopSoundById]);

    const clearCategory = useCallback(
        (category: SoundCategory) => {
            setActiveSounds((prev) => {
                const next = { ...prev };
                const categorySounds = getSoundsByCategory(category);
                const categorySoundIds = categorySounds.map(
                    (s: SoundDef) => s.id
                );

                categorySoundIds.forEach((id) => {
                    if (next[id] !== undefined) {
                        delete next[id];
                        stopSoundById(id);
                    }
                });

                if (Object.keys(next).length === 0) {
                    setIsPlaying(false);
                }

                return next;
            });
        },
        [stopSoundById]
    );

    const toggleMasterPlay = useCallback(() => {
        setIsPlaying((prev) => {
            const next = !prev;
            if (next) {
                Object.entries(activeSounds).forEach(([id, vol]) => {
                    playSoundById(id, vol);
                });
            } else {
                Object.keys(activeSounds).forEach((id) => {
                    stopSoundById(id);
                });
            }
            return next;
        });
    }, [activeSounds, playSoundById, stopSoundById]);

    const saveMix = useCallback(
        (name: string) => {
            const mixStr = serializeMix(activeSounds);
            const newMix: SavedMix = {
                id: Date.now().toString(),
                name,
                mixStr,
            };
            setSavedMixes((prev) => {
                const next = [...prev, newMix];
                localStorage.setItem(
                    'gridmix_saved_mixes',
                    JSON.stringify(next)
                );
                return next;
            });
        },
        [activeSounds]
    );

    const loadMix = useCallback(
        (mixStr: string) => {
            const sounds = normalizeActiveSounds(deserializeMix(mixStr));
            Object.keys(activeSounds).forEach(function (id) {
                stopSoundById(id);
            });
            setActiveSounds(sounds);
            setIsPlaying(true);
            Object.entries(sounds).forEach(function ([id, vol]) {
                playSoundById(id, vol);
            });
        },
        [activeSounds, normalizeActiveSounds, playSoundById, stopSoundById]
    );

    const deleteMix = useCallback((id: string) => {
        setSavedMixes((prev) => {
            const next = prev.filter((m) => m.id !== id);
            localStorage.setItem('gridmix_saved_mixes', JSON.stringify(next));
            return next;
        });
    }, []);

    return (
        <MixerContext.Provider
            value={{
                activeSounds,
                masterVolume,
                isPlaying,
                savedMixes,
                toggleSound,
                setVolume,
                setMasterVolume,
                stopAll,
                pause,
                clearCategory,
                toggleMasterPlay,
                saveMix,
                loadMix,
                deleteMix,
            }}
        >
            {children}
        </MixerContext.Provider>
    );
}

export function useMixer() {
    const context = useContext(MixerContext);
    if (context === undefined) {
        throw new Error('useMixer must be used within a MixerProvider');
    }
    return context;
}
