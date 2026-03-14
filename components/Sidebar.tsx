'use client';

import React from 'react';
import { SoundCategory } from '@/lib/sounds';

interface SidebarProps {
  activeCategory: SoundCategory | 'All';
  onSelectCategory: (category: SoundCategory | 'All') => void;
}

const CATEGORIES: (SoundCategory | 'All')[] = ['All', 'Nature', 'Urban', 'Noise', 'Synth'];

export function Sidebar({ activeCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="w-56 hidden lg:block border-r border-[#222] h-[calc(100vh-56px)] sticky top-14 bg-[#0a0a0a] py-6">
      <div className="px-6 mb-4">
        <h2 className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Categories</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              w-full text-left px-6 py-2.5 text-sm font-medium transition-colors
              ${activeCategory === category 
                ? 'bg-[#111] border-l-2 border-white text-white' 
                : 'text-[#a1a1a1] border-l-2 border-transparent hover:bg-[#111] hover:text-white'}
            `}
          >
            {category}
          </button>
        ))}
      </nav>
    </aside>
  );
}
