'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SoundDef, SOUNDS } from './sounds';
import { engine } from './audio-engine';

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
}

const MixerContext = createContext<MixerContextType | undefined>(undefined);

export function MixerProvider({ children }: { children: React.ReactNode }) {
  const [activeSounds, setActiveSounds] = useState<Record<string, number>>({});
  const [masterVolume, setMasterVolumeState] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);

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
      if (next[id] !== undefined) {
        delete next[id];
        engine.stopSound(id);
      } else {
        next[id] = 0.5; // Default volume
        const soundDef = SOUNDS.find(s => s.id === id);
        if (soundDef && isPlaying) {
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
      toggleMasterPlay
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
