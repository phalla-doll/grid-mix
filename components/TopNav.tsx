'use client';

import React, { useState, useEffect } from 'react';
import { useMixer } from '@/lib/mixer-context';
import { Play, Square, Volume2, Timer as TimerIcon, X, Bookmark, Trash2, Share2, Check } from 'lucide-react';
import { motion } from 'motion/react';

export function TopNav() {
  const { isPlaying, toggleMasterPlay, masterVolume, setMasterVolume, pause, savedMixes, loadMix, deleteMix } = useMixer();
  
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState<string>('30');
  const [isVolumeChanging, setIsVolumeChanging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = (mixStr: string, id: string) => {
    const url = `${window.location.origin}/?mix=${mixStr}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    setIsVolumeChanging(true);
    const timer = setTimeout(() => setIsVolumeChanging(false), 200);
    return () => clearTimeout(timer);
  }, [masterVolume]);

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
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">Soro</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
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
              <motion.div
                animate={{
                  scale: isVolumeChanging ? 1.2 : 1,
                  color: isVolumeChanging ? '#ffffff' : '#a1a1a1'
                }}
                transition={{ duration: 0.15 }}
              >
                <Volume2 className="w-4 h-4" />
              </motion.div>
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

            <button
              onClick={() => setIsPresetsOpen(true)}
              className="flex items-center justify-center w-8 h-8 border border-[#444] bg-black hover:bg-[#111] transition-colors text-[#a1a1a1] hover:text-white"
              title="Load Preset"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Timer Dialog */}
      {isTimerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#222] shadow-2xl flex flex-col">
            <div className="h-12 border-b border-[#222] flex items-center justify-between px-4 sm:px-6">
              <span className="text-[11px] font-mono text-[#888] tracking-widest uppercase">
                [TIMER] / SET
              </span>
              <button onClick={() => setIsTimerOpen(false)} className="text-[#888] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
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

      {/* Presets Dialog */}
      {isPresetsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222] shadow-2xl flex flex-col max-h-[80vh]">
            <div className="h-12 border-b border-[#222] flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
              <span className="text-[11px] font-mono text-[#888] tracking-widest uppercase">
                [PRESETS] / LOAD
              </span>
              <button onClick={() => setIsPresetsOpen(false)} className="text-[#888] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto no-scrollbar">
              {savedMixes.length === 0 ? (
                <div className="text-center py-8 text-[#555] font-mono text-sm">
                  No saved presets yet.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {savedMixes.map(mix => (
                    <div key={mix.id} className="flex items-center justify-between p-3 border border-[#333] bg-[#111] hover:border-[#555] transition-colors group">
                      <span className="text-sm font-medium text-[#e0e0e0] truncate pr-4">{mix.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            loadMix(mix.mixStr);
                            setIsPresetsOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 h-8 border border-[#444] bg-white text-black hover:bg-[#e0e0e0] transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Play
                        </button>
                        <button
                          onClick={() => handleShare(mix.mixStr, mix.id)}
                          className="flex items-center justify-center w-8 h-8 border border-[#444] bg-black text-[#888] hover:text-white hover:border-[#888] transition-colors"
                          title="Share Preset"
                        >
                          {copiedId === mix.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => deleteMix(mix.id)}
                          className="flex items-center justify-center w-8 h-8 border border-[#444] bg-black text-[#888] hover:text-red-500 hover:border-red-500/50 transition-colors"
                          title="Delete Preset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
