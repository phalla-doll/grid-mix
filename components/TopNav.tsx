'use client';

import React, { useState, useEffect } from 'react';
import { useMixer } from '@/lib/mixer-context';
import { Play, Square, Volume2, Timer as TimerIcon, X } from 'lucide-react';

export function TopNav() {
  const { isPlaying, toggleMasterPlay, masterVolume, setMasterVolume, pause } = useMixer();
  
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState<string>('30');

  useEffect(() => {
    if (timeRemaining === null) return;
    
    if (timeRemaining <= 0) {
      pause();
      setTimeRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, pause]);

  const startTimer = (minutes: number) => {
    setTimeRemaining(minutes * 60);
    setIsTimerOpen(false);
  };

  const cancelTimer = () => {
    setTimeRemaining(null);
    setIsTimerOpen(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <header className="h-14 border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-50 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-bold tracking-tight text-white uppercase">GridMix</h1>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsTimerOpen(true)}
              className={`flex items-center justify-center border border-[#444] bg-black hover:bg-[#111] transition-colors text-[#a1a1a1] hover:text-white ${
                timeRemaining !== null ? 'h-8 px-3' : 'w-8 h-8'
              }`}
              title={timeRemaining !== null ? "Edit Timer" : "Set Timer"}
            >
              {timeRemaining !== null ? (
                <span className="text-xs font-mono tracking-wider">{formatTime(timeRemaining)}</span>
              ) : (
                <TimerIcon className="w-4 h-4" />
              )}
            </button>

            <div className="flex items-center gap-3 w-32 hidden sm:flex">
              <Volume2 className="w-4 h-4 text-[#a1a1a1]" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <button
              onClick={toggleMasterPlay}
              className="flex items-center justify-center w-8 h-8 border border-[#444] bg-black hover:bg-[#111] transition-colors"
              title={isPlaying ? "Pause All" : "Play All"}
            >
              {isPlaying ? (
                <Square className="w-3 h-3 text-white fill-white" />
              ) : (
                <Play className="w-3 h-3 text-white fill-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Timer Dialog */}
      {isTimerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#222] shadow-2xl flex flex-col">
            <div className="h-12 border-b border-[#222] flex items-center justify-between px-6">
              <span className="text-[11px] font-mono text-[#888] tracking-widest uppercase">
                [TIMER] / SET
              </span>
              <button onClick={() => setIsTimerOpen(false)} className="text-[#888] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-3">
                {[15, 30, 45, 60, 90, 120].map(mins => (
                  <button
                    key={mins}
                    onClick={() => startTimer(mins)}
                    className="h-12 border border-[#333] bg-[#111] hover:bg-[#1a1a1a] hover:border-[#555] transition-colors flex items-center justify-center text-sm font-mono text-[#e0e0e0]"
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="h-10 w-20 bg-[#111] border border-[#333] text-center font-mono text-sm text-white focus:outline-none focus:border-[#555]"
                  placeholder="Min"
                />
                <button 
                  onClick={() => startTimer(parseInt(customMinutes) || 30)}
                  className="h-10 flex-1 border border-[#444] bg-white text-black hover:bg-[#e0e0e0] transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Start Custom
                </button>
              </div>

              {timeRemaining !== null && (
                <button 
                  onClick={cancelTimer}
                  className="h-10 w-full border border-[#444] bg-black text-[#a1a1a1] hover:text-white hover:bg-[#111] transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Cancel Active Timer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
