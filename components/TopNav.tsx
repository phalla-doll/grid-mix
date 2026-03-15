'use client';

import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useMixer } from '@/lib/mixer-context';
import { useGAEvent } from '@/hooks/useGAEvent';
import {
    Play,
    Square,
    Volume2,
    Timer as TimerIcon,
    Bookmark,
    Trash2,
    Share2,
    Check,
} from 'lucide-react';
import {
    Dialog,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogBody,
} from '@/components/Dialog';

export const TopNav = memo(function TopNav() {
    const {
        isPlaying,
        toggleMasterPlay,
        masterVolume,
        setMasterVolume,
        pause,
        savedMixes,
        loadMix,
        deleteMix,
    } = useMixer();
    const { trackClick, trackChange } = useGAEvent();
    const prevMasterVolumeRef = useRef(masterVolume);

    const [isTimerOpen, setIsTimerOpen] = useState(false);
    const [isPresetsOpen, setIsPresetsOpen] = useState(false);
    const [isMobileVolumeOpen, setIsMobileVolumeOpen] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [customMinutes, setCustomMinutes] = useState<string>('30');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const mobileVolumeRef = useRef<HTMLDivElement>(null);
    const prevVolumeRef = useRef(masterVolume);
    const pauseFnRef = useRef(pause);
    const masterVolumeRafRef = useRef<number | null>(null);
    const pendingMasterVolumeRef = useRef(masterVolume);
    const mobileVolumePanelId = 'mobile-master-volume-panel';

    useEffect(() => {
        pauseFnRef.current = pause;
    }, [pause]);

    useEffect(() => {
        pendingMasterVolumeRef.current = masterVolume;
    }, [masterVolume]);

    useEffect(
        () => () => {
            if (masterVolumeRafRef.current !== null) {
                cancelAnimationFrame(masterVolumeRafRef.current);
                masterVolumeRafRef.current = null;
            }
        },
        []
    );

    useEffect(() => {
        if (!isMobileVolumeOpen) return;

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            if (!mobileVolumeRef.current) return;
            if (!mobileVolumeRef.current.contains(event.target as Node)) {
                setIsMobileVolumeOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('touchstart', handlePointerDown, {
            passive: true,
        });
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('touchstart', handlePointerDown);
        };
    }, [isMobileVolumeOpen]);

    const queueMasterVolumeUpdate = useCallback(
        (nextVolume: number) => {
            if (Number.isNaN(nextVolume)) return;

            pendingMasterVolumeRef.current = nextVolume;
            if (masterVolumeRafRef.current !== null) return;

            masterVolumeRafRef.current = requestAnimationFrame(() => {
                masterVolumeRafRef.current = null;
                setMasterVolume(pendingMasterVolumeRef.current);
            });
        },
        [setMasterVolume]
    );

    const handleMasterVolumeInput = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            queueMasterVolumeUpdate(parseFloat(e.currentTarget.value));
        },
        [queueMasterVolumeUpdate]
    );

    const handleMasterVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            queueMasterVolumeUpdate(parseFloat(e.target.value));
        },
        [queueMasterVolumeUpdate]
    );

    const handleShare = useCallback((mixStr: string, id: string) => {
        const url = `${window.location.origin}/?mix=${mixStr}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }, []);

    useEffect(() => {
        if (prevVolumeRef.current !== masterVolume && volumeRef.current) {
            volumeRef.current.classList.add('scale-120', 'text-white');
            volumeRef.current.classList.remove('text-grid-text-secondary');

            const timer = setTimeout(() => {
                if (volumeRef.current) {
                    volumeRef.current.classList.remove(
                        'scale-120',
                        'text-white'
                    );
                    volumeRef.current.classList.add('text-grid-text-secondary');
                }
            }, 150);

            prevVolumeRef.current = masterVolume;
            return () => clearTimeout(timer);
        }
    }, [masterVolume]);

    useEffect(() => {
        if (prevMasterVolumeRef.current !== masterVolume) {
            const volumePercent = Math.round(masterVolume * 100);
            trackChange('volume', 'master_volume', volumePercent);
            prevMasterVolumeRef.current = masterVolume;
        }
    }, [masterVolume, trackChange]);

    useEffect(() => {
        if (timeRemaining === null) return;

        if (timeRemaining <= 0) {
            pauseFnRef.current();
            return;
        }

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev === null) return null;
                const next = prev - 1;
                if (next <= 0) {
                    pauseFnRef.current();
                    return null;
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRemaining]);

    const startTimer = useCallback((minutes: number) => {
        setTimeRemaining(minutes * 60);
        setIsTimerOpen(false);
    }, []);

    const cancelTimer = useCallback(() => {
        setTimeRemaining(null);
        setIsTimerOpen(false);
    }, []);

    const formatTime = useCallback((seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, []);

    const handleCustomMinutesChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCustomMinutes(e.target.value);
        },
        []
    );

    return (
        <>
            <header className="h-14 border-b border-[#222] bg-grid-bg sticky top-0 z-50 flex items-center">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-8">
                        <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                            Soro
                        </h1>
                    </div>

                    <div className="relative flex items-center gap-4 sm:gap-6">
                        <button
                            type="button"
                            onClick={() => {
                                trackClick('timer', 'open_timer_dialog');
                                setIsTimerOpen(true);
                            }}
                            aria-label={
                                timeRemaining !== null
                                    ? `Edit timer, ${formatTime(timeRemaining)} remaining`
                                    : 'Set sleep timer'
                            }
                            className={`flex items-center justify-center border border-[#444] bg-black hover:bg-[#111] transition-colors text-grid-text-secondary hover:text-white ${
                                timeRemaining !== null ? 'h-8 px-3' : 'w-8 h-8'
                            }`}
                        >
                            {timeRemaining !== null ? (
                                <span className="text-xs font-mono tracking-wider">
                                    {formatTime(timeRemaining)}
                                </span>
                            ) : (
                                <TimerIcon className="w-4 h-4" />
                            )}
                        </button>

                        <div
                            ref={mobileVolumeRef}
                            className="relative sm:hidden"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    const nextOpen = !isMobileVolumeOpen;
                                    trackClick(
                                        'volume',
                                        nextOpen
                                            ? 'open_mobile_volume'
                                            : 'close_mobile_volume'
                                    );
                                    setIsMobileVolumeOpen(nextOpen);
                                }}
                                aria-label="Adjust master volume"
                                aria-expanded={isMobileVolumeOpen}
                                aria-controls={mobileVolumePanelId}
                                className={`flex items-center justify-center w-8 h-8 border border-[#444] bg-black hover:bg-[#111] transition-colors ${
                                    isMobileVolumeOpen
                                        ? 'text-white'
                                        : 'text-grid-text-secondary hover:text-white'
                                }`}
                            >
                                <Volume2 className="w-4 h-4" />
                            </button>

                            {isMobileVolumeOpen ? (
                                <div
                                    id={mobileVolumePanelId}
                                    role="group"
                                    aria-label="Master volume"
                                    className="absolute right-0 top-10 z-50 w-44 border border-[#333] bg-grid-bg p-2 flex items-center gap-2"
                                >
                                    <Volume2 className="w-4 h-4 text-grid-text-secondary" />
                                    <label
                                        htmlFor="mobileMasterVolume"
                                        className="sr-only"
                                    >
                                        Master volume
                                    </label>
                                    <input
                                        id="mobileMasterVolume"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={masterVolume}
                                        onInput={handleMasterVolumeInput}
                                        onChange={handleMasterVolumeChange}
                                        aria-label="Master volume"
                                        className="w-full touch-pan-y"
                                    />
                                </div>
                            ) : null}
                        </div>

                        <div
                            className="hidden items-center gap-3 w-32 sm:flex"
                            role="group"
                            aria-label="Master volume"
                        >
                            <div
                                ref={volumeRef}
                                className="text-grid-text-secondary transition-all duration-150"
                            >
                                <Volume2 className="w-4 h-4" />
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={masterVolume}
                                onInput={handleMasterVolumeInput}
                                onChange={handleMasterVolumeChange}
                                aria-label="Master volume"
                                className="w-full touch-pan-y"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                trackClick(
                                    'playback',
                                    isPlaying ? 'master_pause' : 'master_play'
                                );
                                toggleMasterPlay();
                            }}
                            aria-label={
                                isPlaying
                                    ? 'Pause all sounds'
                                    : 'Play all sounds'
                            }
                            className="flex items-center justify-center w-8 h-8 border border-[#444] bg-black hover:bg-[#111] transition-colors"
                        >
                            {isPlaying ? (
                                <Square className="w-3 h-3 text-white fill-white" />
                            ) : (
                                <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                trackClick('presets', 'open_presets');
                                setIsPresetsOpen(true);
                            }}
                            aria-label="Open saved presets"
                            className="flex items-center justify-center w-8 h-8 border border-[#444] bg-black hover:bg-[#111] transition-colors text-grid-text-secondary hover:text-white"
                        >
                            <Bookmark className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <Dialog open={isTimerOpen} onOpenChange={setIsTimerOpen}>
                <DialogOverlay>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>[TIMER] / SET</DialogTitle>
                            <DialogClose />
                        </DialogHeader>

                        <DialogBody>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {[15, 30, 45, 60, 90, 120].map((mins) => (
                                    <button
                                        key={mins}
                                        type="button"
                                        onClick={() => {
                                            trackClick(
                                                'timer',
                                                `timer_${mins}m`
                                            );
                                            startTimer(mins);
                                        }}
                                        className="h-12 border border-[#333] bg-[#111] hover:bg-[#1a1a1a] hover:border-[#555] transition-colors flex items-center justify-center text-sm font-mono text-[#e0e0e0]"
                                    >
                                        {mins}m
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="customTimerMinutes"
                                    className="sr-only"
                                >
                                    Custom minutes
                                </label>
                                <input
                                    id="customTimerMinutes"
                                    type="number"
                                    value={customMinutes}
                                    onChange={handleCustomMinutesChange}
                                    className="h-10 w-20 bg-[#111] border border-[#333] text-center font-mono text-sm text-white focus:outline-none focus:border-[#555]"
                                    placeholder="Min"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        trackClick('timer', 'timer_custom');
                                        startTimer(
                                            parseInt(customMinutes) || 30
                                        );
                                    }}
                                    className="h-10 flex-1 border border-[#444] bg-white text-black hover:bg-[#e0e0e0] transition-colors text-xs font-bold uppercase tracking-widest"
                                >
                                    Start Custom
                                </button>
                            </div>

                            {timeRemaining !== null && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        trackClick('timer', 'timer_cancel');
                                        cancelTimer();
                                    }}
                                    className="h-10 w-full border border-[#444] bg-black text-grid-text-secondary hover:text-white hover:bg-[#111] transition-colors text-xs font-bold uppercase tracking-widest"
                                >
                                    Cancel Active Timer
                                </button>
                            )}
                        </DialogBody>
                    </DialogContent>
                </DialogOverlay>
            </Dialog>

            <Dialog open={isPresetsOpen} onOpenChange={setIsPresetsOpen}>
                <DialogOverlay>
                    <DialogContent className="max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>[PRESETS] / LOAD</DialogTitle>
                            <DialogClose />
                        </DialogHeader>

                        <DialogBody className="overflow-y-auto no-scrollbar">
                            {savedMixes.length === 0 ? (
                                <div className="text-center py-8 text-[#555] font-mono text-sm">
                                    No saved presets yet.
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {savedMixes.map((mix) => (
                                        <div
                                            key={mix.id}
                                            className="flex items-center justify-between p-3 border border-[#333] bg-[#111] hover:border-[#555] transition-colors group"
                                        >
                                            <span className="text-sm font-medium text-[#e0e0e0] truncate pr-4">
                                                {mix.name}
                                            </span>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        trackClick(
                                                            'presets',
                                                            `load_preset_${mix.name}`
                                                        );
                                                        loadMix(mix.mixStr);
                                                        setIsPresetsOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 px-3 h-8 border border-[#444] bg-white text-black hover:bg-[#e0e0e0] transition-colors text-xs font-bold uppercase tracking-widest"
                                                >
                                                    <Play className="w-3 h-3 fill-current" />
                                                    Play
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        trackClick(
                                                            'presets',
                                                            `share_preset_${mix.id}`
                                                        );
                                                        handleShare(
                                                            mix.mixStr,
                                                            mix.id
                                                        );
                                                    }}
                                                    aria-label={
                                                        copiedId === mix.id
                                                            ? 'Link copied'
                                                            : `Share ${mix.name}`
                                                    }
                                                    className="flex items-center justify-center w-8 h-8 border border-[#444] bg-black text-[#888] hover:text-white hover:border-[#888] transition-colors"
                                                >
                                                    {copiedId === mix.id ? (
                                                        <Check className="w-3.5 h-3.5 text-green-500" />
                                                    ) : (
                                                        <Share2 className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        trackClick(
                                                            'presets',
                                                            `delete_preset_${mix.id}`
                                                        );
                                                        deleteMix(mix.id);
                                                    }}
                                                    aria-label={`Delete ${mix.name}`}
                                                    className="flex items-center justify-center w-8 h-8 border border-[#444] bg-black text-[#888] hover:text-red-500 hover:border-red-500/50 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DialogBody>
                    </DialogContent>
                </DialogOverlay>
            </Dialog>
        </>
    );
});
