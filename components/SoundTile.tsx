'use client';

import React, { memo, useCallback, useRef, useEffect } from 'react';
import { formatCategoryLabel, SoundDef } from '@/lib/sounds';
import { useMixer } from '@/lib/mixer-context';
import { useGAEvent } from '@/hooks/useGAEvent';
import { HugeiconsIcon } from '@hugeicons/react';
import { StopIcon } from '@hugeicons/core-free-icons';
import { Waveform } from '@/components/Waveform';

interface SoundTileProps {
    sound: SoundDef;
}

export const SoundTile = memo(function SoundTile({ sound }: SoundTileProps) {
    const { activeSounds, toggleSound, setVolume, isPlaying } = useMixer();
    const { trackClick, trackChange } = useGAEvent();
    const prevVolumeRef = useRef<number | null>(null);

    const isActive = activeSounds[sound.id] !== undefined;
    const volume = isActive ? activeSounds[sound.id] : 0.5;

    useEffect(() => {
        if (
            prevVolumeRef.current !== null &&
            prevVolumeRef.current !== volume &&
            isActive
        ) {
            const volumePercent = Math.round(volume * 100);
            trackChange('volume', `${sound.id}_volume`, volumePercent);
        }
        prevVolumeRef.current = volume;
    }, [volume, isActive, sound.id, trackChange]);

    const handleToggle = useCallback(
        (source: 'tile' | 'stop_button' | 'keyboard') => {
            const action = isActive ? 'sound_off' : 'sound_on';
            trackClick('sound', action);
            toggleSound(sound.id);
        },
        [isActive, toggleSound, sound.id, trackClick]
    );

    const handleVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const nextVolume = parseFloat(e.target.value);
            setVolume(sound.id, nextVolume);
        },
        [setVolume, sound.id]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleToggle('keyboard');
            }
        },
        [handleToggle]
    );

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => handleToggle('tile')}
            onKeyDown={handleKeyDown}
            className={`
        flex flex-col justify-between p-4 sm:p-6 h-[160px] transition-all duration-120 ease-out
        border-b border-r border-[#222] group cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white
        ${isActive ? 'bg-[#1a1a1a]' : 'bg-transparent hover:bg-[#111]'}
      `}
            aria-pressed={isActive}
            aria-label={`${sound.name}, ${formatCategoryLabel(sound.category)} sound${isActive ? ', active' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <p
                            className={`text-sm font-medium ${isActive ? 'text-white' : 'text-[#e0e0e0]'}`}
                        >
                            {sound.name}
                        </p>
                        {isActive && isPlaying && (
                            <Waveform isPlaying={isPlaying} />
                        )}
                    </div>
                    <p className="text-[11px] text-[#888] uppercase tracking-wider mt-1 font-mono">
                        {formatCategoryLabel(sound.category)}
                    </p>
                </div>
            </div>

            {isActive && (
                <div
                    className="flex items-center gap-2 sm:gap-4 mt-auto"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            trackClick('sound', `${sound.id}_stop`);
                            handleToggle('stop_button');
                        }}
                        tabIndex={-1}
                        aria-label={`Stop ${sound.name}`}
                        className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 border transition-colors border-white bg-white text-black hover:bg-[#e0e0e0]"
                    >
                        <HugeiconsIcon
                            icon={StopIcon}
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current"
                        />
                    </button>

                    <div className="grow transition-opacity duration-200 opacity-100">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            tabIndex={isActive ? 0 : -1}
                            aria-label={`${sound.name} volume`}
                            aria-valuenow={Math.round(volume * 100)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        />
                    </div>
                </div>
            )}
        </div>
    );
});
