'use client';

import React from 'react';
import { SOUNDS, SoundCategory } from '@/lib/sounds';
import { SoundTile } from './SoundTile';
import { useMixer } from '@/lib/mixer-context';
import { X } from 'lucide-react';

const CATEGORIES: SoundCategory[] = ['Nature', 'Urban', 'Noise', 'Synth'];

export function SoundGrid() {
  const { activeSounds, clearCategory } = useMixer();

  return (
    <main className="flex-1 pb-12">
      <div className="w-full flex justify-center border-b border-[#222]">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4 sm:mb-6 tracking-tight max-w-3xl">
            Focus starts with the right sound.
          </h1>
          <p className="text-[#888] text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
            Mix nature, noise, and ambient environments to create your perfect space for work, rest, or sleep.
          </p>
        </div>
      </div>

      {CATEGORIES.map((category, index) => {
        const categorySounds = SOUNDS.filter(s => s.category === category);
        if (categorySounds.length === 0) return null;

        const hasActiveSounds = categorySounds.some(s => activeSounds[s.id] !== undefined);
        const sectionNumber = String(index + 1).padStart(2, '0');

        return (
          <div key={category} className="flex flex-col border-b border-[#222]">
            <div className="h-12 border-b border-[#222] flex items-center justify-center">
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex justify-between items-center">
                <span className="text-[10px] sm:text-[11px] font-mono text-[#888] tracking-widest uppercase">
                  [{sectionNumber}] {category}
                </span>
                {hasActiveSounds ? (
                  <button 
                    onClick={() => clearCategory(category)}
                    className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-[#888] hover:text-white transition-colors tracking-widest uppercase"
                  >
                    <X className="w-3 h-3" />
                    CLEAR
                  </button>
                ) : (
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#555] tracking-widest uppercase">
                    / SOUNDS
                  </span>
                )}
              </div>
            </div>

            <div className="w-full flex justify-center">
              <div className="max-w-7xl w-full mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {categorySounds.map(sound => (
                    <SoundTile key={sound.id} sound={sound} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Empty Row */}
      <div className="w-full flex justify-center border-b border-[#222] h-[160px]">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 h-full">
            <div className="border-r border-[#222] h-full"></div>
            <div className="border-r border-[#222] h-full"></div>
            <div className="border-r border-[#222] h-full hidden md:block"></div>
            <div className="border-r border-[#222] h-full hidden lg:block"></div>
            <div className="border-r border-[#222] h-full hidden xl:block"></div>
            <div className="border-r border-[#222] h-full hidden xl:block"></div>
          </div>
        </div>
      </div>

      {/* Footer Row */}
      <div className="w-full flex justify-center border-b border-[#222] h-12 bg-[#0a0a0a]">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex justify-between items-center">
          <span className="text-[10px] sm:text-[11px] font-mono text-[#555] tracking-widest uppercase">
            Crafted by Mantha
          </span>
          <a 
            href="https://github.com/phalla-doll/grid-mix" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] sm:text-[11px] font-mono text-[#555] hover:text-white transition-colors tracking-widest uppercase"
          >
            / GITHUB
          </a>
        </div>
      </div>
    </main>
  );
}
