'use client';

import React from 'react';
import { SOUNDS, SoundCategory } from '@/lib/sounds';
import { SoundTile } from './SoundTile';

interface SoundGridProps {
  activeCategory: SoundCategory | 'All';
}

export function SoundGrid({ activeCategory }: SoundGridProps) {
  const filteredSounds = activeCategory === 'All' 
    ? SOUNDS 
    : SOUNDS.filter(s => s.category === activeCategory);

  return (
    <main className="flex-1 p-8 lg:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            {activeCategory === 'All' ? 'Library' : activeCategory}
          </h2>
          <p className="text-sm text-[#888] font-mono">
            {filteredSounds.length} sounds available
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {filteredSounds.map(sound => (
            <SoundTile key={sound.id} sound={sound} />
          ))}
        </div>
      </div>
    </main>
  );
}
