'use client';

import React, { memo } from 'react';

interface WaveformProps {
    isPlaying: boolean;
}

export const Waveform = memo(function Waveform({ isPlaying }: WaveformProps) {
    return (
        <div className="flex gap-[2px] h-3 items-end opacity-50">
            <div
                className={`w-[2px] h-full bg-white origin-bottom ${isPlaying ? 'animate-[waveform_1s_ease-in-out_infinite]' : 'scale-y-20 transition-transform duration-300'}`}
                style={{ animationDelay: '0ms' }}
            />
            <div
                className={`w-[2px] h-full bg-white origin-bottom ${isPlaying ? 'animate-[waveform_1.2s_ease-in-out_infinite]' : 'scale-y-20 transition-transform duration-300'}`}
                style={{ animationDelay: '200ms' }}
            />
            <div
                className={`w-[2px] h-full bg-white origin-bottom ${isPlaying ? 'animate-[waveform_0.8s_ease-in-out_infinite]' : 'scale-y-20 transition-transform duration-300'}`}
                style={{ animationDelay: '400ms' }}
            />
            <div
                className={`w-[2px] h-full bg-white origin-bottom ${isPlaying ? 'animate-[waveform_1.1s_ease-in-out_infinite]' : 'scale-y-20 transition-transform duration-300'}`}
                style={{ animationDelay: '100ms' }}
            />
        </div>
    );
});
