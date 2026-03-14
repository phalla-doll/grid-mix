'use client';

import React from 'react';
import { useMixer } from '@/lib/mixer-context';
import { SOUNDS } from '@/lib/sounds';
import { Play, Square, X } from 'lucide-react';

export function MixerPanel() {
  const { activeSounds, isPlaying, toggleMasterPlay, stopAll } = useMixer();
  
  const activeSoundIds = Object.keys(activeSounds);
  const activeCount = activeSoundIds.length;

  if (activeCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a] border-t border-[#222] z-50 flex items-center justify-between px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-6 overflow-x-auto">
        <div className="text-xs font-bold text-[#555] uppercase tracking-widest whitespace-nowrap">
          Active Mix
        </div>
        <div className="flex items-center gap-3">
          {activeSoundIds.map(id => {
            const sound = SOUNDS.find(s => s.id === id);
            return (
              <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#333] text-xs font-medium text-[#e0e0e0]">
                <span>{sound?.name}</span>
                <span className="text-[#888] font-mono">{(activeSounds[id] * 100).toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6 flex-shrink-0">
        <button
          onClick={toggleMasterPlay}
          className="flex items-center gap-2 px-4 h-9 border border-[#444] bg-[#111] hover:bg-[#222] transition-colors text-sm font-medium text-white"
        >
          {isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              <span>Play</span>
            </>
          )}
        </button>
        
        <button
          onClick={stopAll}
          className="flex items-center gap-2 px-4 h-9 border border-[#444] bg-black hover:bg-[#111] transition-colors text-sm font-medium text-[#a1a1a1] hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
