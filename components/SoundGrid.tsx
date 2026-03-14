'use client';

import React from 'react';
import { SOUNDS, SoundCategory } from '@/lib/sounds';
import { SoundTile } from './SoundTile';

const CATEGORIES: SoundCategory[] = ['Nature', 'Urban', 'Noise', 'Synth'];

export function SoundGrid() {
  return (
    <main className="flex-1 pb-32">
      {CATEGORIES.map((category, index) => {
        const categorySounds = SOUNDS.filter(s => s.category === category);
        if (categorySounds.length === 0) return null;

        const sectionNumber = String(index + 1).padStart(2, '0');

        return (
          <div key={category} className="flex flex-col border-b border-[#222]">
            <div className="h-12 border-b border-[#222] flex items-center justify-center">
              <div className="max-w-7xl w-full mx-auto px-6 flex justify-between items-center">
                <span className="text-[11px] font-mono text-[#888] tracking-widest uppercase">
                  [{sectionNumber}] {category}
                </span>
                <span className="text-[11px] font-mono text-[#555] tracking-widest uppercase">
                  / SOUNDS
                </span>
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
    </main>
  );
}
