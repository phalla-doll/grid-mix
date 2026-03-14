'use client';

import React from 'react';
import { useMixer } from '@/lib/mixer-context';
import { Play, Square, Volume2 } from 'lucide-react';

export function TopNav() {
  const { isPlaying, toggleMasterPlay, masterVolume, setMasterVolume } = useMixer();

  return (
    <header className="h-14 border-b border-[#222] bg-[#0a0a0a] flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-lg font-bold tracking-tight text-white uppercase">GridMix</h1>
        <nav className="hidden md:flex items-center gap-6">
          <span className="text-xs font-medium text-[#a1a1a1] uppercase tracking-wider cursor-pointer hover:text-white transition-colors">Library</span>
          <span className="text-xs font-medium text-[#a1a1a1] uppercase tracking-wider cursor-pointer hover:text-white transition-colors">Presets</span>
          <span className="text-xs font-medium text-[#a1a1a1] uppercase tracking-wider cursor-pointer hover:text-white transition-colors">Timer</span>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 w-32">
          <Volume2 className="w-4 h-4 text-[#a1a1a1]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={toggleMasterPlay}
          className="flex items-center justify-center w-8 h-8 border border-[#444] bg-black hover:bg-[#111] transition-colors"
          title={isPlaying ? "Pause All" : "Play All"}
        >
          {isPlaying ? (
            <Square className="w-3 h-3 text-white fill-white" />
          ) : (
            <Play className="w-3 h-3 text-white fill-white ml-0.5" />
          )}
        </button>
      </div>
    </header>
  );
}
