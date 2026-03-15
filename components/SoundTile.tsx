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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={`
        flex flex-col justify-between p-4 sm:p-6 h-[160px] transition-all duration-[120ms] ease-out
        border-b border-r border-[#222] group cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white
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
                <div className="w-[2px] h-full bg-white origin-bottom animate-[waveform_1s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }}></div>
                <div className="w-[2px] h-full bg-white origin-bottom animate-[waveform_1.2s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }}></div>
                <div className="w-[2px] h-full bg-white origin-bottom animate-[waveform_0.8s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }}></div>
                <div className="w-[2px] h-full bg-white origin-bottom animate-[waveform_1.1s_ease-in-out_infinite]" style={{ animationDelay: '100ms' }}></div>
              </div>
            )}
          </div>
          <p className="text-[11px] text-[#888] uppercase tracking-wider mt-1 font-mono">
            {sound.category}
          </p>
        </div>
      </div>

      {isActive && (
        <div 
          className="flex items-center gap-2 sm:gap-4 mt-auto"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            tabIndex={-1}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 border transition-colors border-white bg-white text-black hover:bg-[#e0e0e0]"
          >
            <Square className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          </button>

          <div className="flex-grow transition-opacity duration-200 opacity-100">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              tabIndex={isActive ? 0 : -1}
              className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
