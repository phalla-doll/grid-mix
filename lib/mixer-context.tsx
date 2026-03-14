'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SoundDef, SOUNDS } from './sounds';
import { engine } from './audio-engine';

export const serializeMix = (sounds: Record<string, number>) => {
  return Object.entries(sounds)
    .map(([id, vol]) => `${id}_${Math.round(vol * 100)}`)
    .join('-');
};

export const deserializeMix = (mixStr: string): Record<string, number> => {
  const sounds: Record<string, number> = {};
  if (!mixStr) return sounds;
  mixStr.split('-').forEach(part => {
    const [id, volStr] = part.split('_');
    const vol = parseInt(volStr, 10);
    if (id && !isNaN(vol)) {
      sounds[id] = vol / 100;
    }
  });
  return sounds;
};

interface MixerState {
  activeSounds: Record<string, number>; // id -> volume (0-1)
  masterVolume: number;
  isPlaying: boolean;
}

interface MixerContextType extends MixerState {
  toggleSound: (id: string) => void;
  setVolume: (id: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  stopAll: () => void;
  pause: () => void;
  clearCategory: (category: string) => void;
  toggleMasterPlay: () => void;
  saveMix: () => void;
}

const MixerContext = createContext<MixerContextType | undefined>(undefined);

export function MixerProvider({ children }: { children: React.ReactNode }) {
  const [activeSounds, setActiveSounds] = useState<Record<string, number>>({});
  const [masterVolume, setMasterVolumeState] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from URL or LocalStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mixParam = params.get('mix');
    
    if (mixParam) {
      setActiveSounds(deserializeMix(mixParam));
    } else {
      const savedSession = localStorage.getItem('gridmix_current_session');
      if (savedSession) {
        setActiveSounds(deserializeMix(savedSession));
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to URL and LocalStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    
    const mixStr = serializeMix(activeSounds);
    localStorage.setItem('gridmix_current_session', mixStr);
    
    const url = new URL(window.location.href);
    if (mixStr) {
      url.searchParams.set('mix', mixStr);
    } else {
      url.searchParams.delete('mix');
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeSounds, isInitialized]);

  // Initialize audio engine on first interaction
  useEffect(() => {
    const initAudio = () => {
      engine.init();
      window.removeEventListener('click', initAudio);
    };
    window.addEventListener('click', initAudio);
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const toggleSound = useCallback((id: string) => {
    setActiveSounds(prev => {
      const next = { ...prev };
      const isCurrentlyEmpty = Object.keys(prev).length === 0;

      if (next[id] !== undefined) {
        delete next[id];
        engine.stopSound(id);
        
        if (Object.keys(next).length === 0) {
          setIsPlaying(false);
        }
      } else {
        next[id] = 0.5; // Default volume
        const soundDef = SOUNDS.find(s => s.id === id);
        
        if (isCurrentlyEmpty) {
          setIsPlaying(true);
          if (soundDef) {
            engine.playSound(soundDef, 0.5);
          }
        } else if (soundDef && isPlaying) {
          engine.playSound(soundDef, 0.5);
        }
      }
      return next;
    });
  }, [isPlaying]);

  const setVolume = useCallback((id: string, volume: number) => {
    setActiveSounds(prev => {
      if (prev[id] === undefined) return prev;
      const next = { ...prev, [id]: volume };
      if (isPlaying) {
        engine.setVolume(id, volume);
      }
      return next;
    });
  }, [isPlaying]);

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
    Object.keys(activeSounds).forEach(id => {
      engine.stopSound(id);
    });
  }, [activeSounds]);

  const clearCategory = useCallback((category: string) => {
    setActiveSounds(prev => {
      const next = { ...prev };
      const categorySoundIds = SOUNDS.filter(s => s.category === category).map(s => s.id);
      
      categorySoundIds.forEach(id => {
        if (next[id] !== undefined) {
          delete next[id];
          engine.stopSound(id);
        }
      });
      
      if (Object.keys(next).length === 0) {
        setIsPlaying(false);
      }
      
      return next;
    });
  }, []);

  const toggleMasterPlay = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        // Start all active sounds
        Object.entries(activeSounds).forEach(([id, vol]) => {
          const soundDef = SOUNDS.find(s => s.id === id);
          if (soundDef) {
            engine.playSound(soundDef, vol);
          }
        });
      } else {
        // Stop all sounds but keep them in activeSounds state
        Object.keys(activeSounds).forEach(id => {
          engine.stopSound(id);
        });
      }
      return next;
    });
  }, [activeSounds]);

  const saveMix = useCallback(() => {
    const mixStr = serializeMix(activeSounds);
    localStorage.setItem('gridmix_saved_mix', mixStr);
  }, [activeSounds]);

  return (
    <MixerContext.Provider value={{
      activeSounds,
      masterVolume,
      isPlaying,
      toggleSound,
      setVolume,
      setMasterVolume,
      stopAll,
      pause,
      clearCategory,
      toggleMasterPlay,
      saveMix
    }}>
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
