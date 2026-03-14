'use client';

import React, { useState } from 'react';
import { MixerProvider } from '@/lib/mixer-context';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';
import { SoundGrid } from '@/components/SoundGrid';
import { MixerPanel } from '@/components/MixerPanel';
import { SoundCategory } from '@/lib/sounds';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<SoundCategory | 'All'>('All');

  return (
    <MixerProvider>
      <div className="min-h-screen flex flex-col relative">
        <TopNav />
        <div className="flex flex-1">
          <Sidebar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
          <SoundGrid activeCategory={activeCategory} />
        </div>
        <MixerPanel />
      </div>
    </MixerProvider>
  );
}
