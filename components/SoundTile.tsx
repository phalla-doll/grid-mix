'use client';

import React from 'react';
import { SoundDef } from '@/lib/sounds';
import { useMixer } from '@/lib/mixer-context';
import { Play, Square } from 'lucide-react';

interface SoundTileProps {
  sound: SoundDef;
}

export function SoundTile({ sound }: SoundTileProps) {
  const { activeSounds, toggleSound, setVolume, isPlaying } = useMixer();
  
  const isActive = activeSounds[sound.id] !== undefined;
  const volume = isActive ? activeSounds[sound.id] : 0.5;

  const handleToggle = () => {
    toggleSound(sound.id);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(sound.id, parseFloat(e.target.value));
  };

  return (
    <div 
      className={`
        flex flex-col justify-between p-6 h-[160px] transition-all duration-[120ms] ease-out
        border-b border-r border-[#222] group
        ${isActive 
          ? 'bg-[#1a1a1a]' 
          : 'bg-transparent hover:bg-[#111]'}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h3 className={`text-sm font-medium ${isActive ? 'text-white' : 'text-[#e0e0e0]'}`}>
              {sound.name}
            </h3>
            {isActive && isPlaying && (
              <div className="flex gap-[2px] h-3 items-end opacity-50">
                <div className="w-[1px] bg-white animate-[pulse_1s_ease-in-out_infinite]" style={{ height: '40%' }}></div>
                <div className="w-[1px] bg-white animate-[pulse_1.2s_ease-in-out_infinite_0.2s]" style={{ height: '100%' }}></div>
                <div className="w-[1px] bg-white animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" style={{ height: '60%' }}></div>
                <div className="w-[1px] bg-white animate-[pulse_1.1s_ease-in-out_infinite_0.1s]" style={{ height: '80%' }}></div>
              </div>
            )}
          </div>
          <p className="text-[11px] text-[#888] uppercase tracking-wider mt-1 font-mono">
            {sound.category}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <button
          onClick={handleToggle}
          className={`
            flex-shrink-0 flex items-center justify-center w-9 h-9 border transition-colors
            ${isActive 
              ? 'border-white bg-white text-black hover:bg-[#e0e0e0]' 
              : 'border-[#444] bg-black text-white hover:bg-[#222]'}
          `}
        >
          {isActive ? (
            <Square className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        <div className={`flex-grow transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full"
            disabled={!isActive}
          />
        </div>
      </div>
    </div>
  );
}
