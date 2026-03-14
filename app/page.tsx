'use client';

import React from 'react';
import { MixerProvider } from '@/lib/mixer-context';
import { TopNav } from '@/components/TopNav';
import { SoundGrid } from '@/components/SoundGrid';
import { MixerPanel } from '@/components/MixerPanel';

export default function Home() {
  return (
    <MixerProvider>
      <div className="min-h-screen flex flex-col relative bg-[#0a0a0a]">
        {/* Structural Vertical Lines */}
        <div className="fixed inset-0 pointer-events-none flex justify-center z-[100]">
          <div className="max-w-7xl w-full h-full border-x border-[#222]"></div>
        </div>

        <TopNav />
        <div className="flex flex-1 flex-col">
          <SoundGrid />
        </div>
        <MixerPanel />
      </div>
    </MixerProvider>
  );
}
