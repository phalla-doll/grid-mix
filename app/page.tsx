'use client';

import React from 'react';
import { MixerProvider } from '@/lib/mixer-context';
import { TopNav } from '@/components/TopNav';
import { SoundGrid } from '@/components/SoundGrid';
import { MixerPanel } from '@/components/MixerPanel';

export default function Home() {
  return (
    <MixerProvider>
      <div className="min-h-screen flex flex-col relative">
        <TopNav />
        <div className="flex flex-1 flex-col">
          <SoundGrid />
        </div>
        <MixerPanel />
      </div>
    </MixerProvider>
  );
}
