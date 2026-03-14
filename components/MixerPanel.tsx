'use client';

import React, { useState } from 'react';
import { useMixer } from '@/lib/mixer-context';
import { SOUNDS } from '@/lib/sounds';
import { Play, Square, X, Save, Check } from 'lucide-react';

export function MixerPanel() {
  const { activeSounds, isPlaying, toggleMasterPlay, stopAll, saveMix } = useMixer();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  
  const activeSoundIds = Object.keys(activeSounds);
  const activeCount = activeSoundIds.length;

  if (activeCount === 0) return null;

  const displayIds = activeSoundIds.slice(0, 4);
  const remainingCount = activeCount - 4;

  const handleOpenSave = () => {
    const names = activeSoundIds.map(id => SOUNDS.find(s => s.id === id)?.name).filter(Boolean);
    const defaultName = names.slice(0, 3).join(' + ') + (names.length > 3 ? '...' : '');
    setPresetName(defaultName);
    setIsSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (!presetName.trim()) return;
    saveMix(presetName.trim());
    setIsSaveDialogOpen(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-16 sm:h-20 bg-[#0a0a0a] border-t border-[#222] z-50 flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar mask-edges">
          <div className="hidden sm:block text-xs font-bold text-[#555] uppercase tracking-widest whitespace-nowrap">
            Active Mix
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {displayIds.map(id => {
              const sound = SOUNDS.find(s => s.id === id);
              return (
                <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#333] text-xs font-medium text-[#e0e0e0] max-w-[140px]">
                  <span className="truncate">{sound?.name}</span>
                  <span className="text-[#888] font-mono flex-shrink-0">{(activeSounds[id] * 100).toFixed(0)}%</span>
                </div>
              );
            })}
            {remainingCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#333] text-xs font-medium text-[#888] flex-shrink-0">
                <span>+{remainingCount} more</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-4 sm:ml-6 flex-shrink-0">
          <button
            onClick={toggleMasterPlay}
            className="flex items-center justify-center sm:justify-start gap-2 w-10 sm:w-auto sm:px-4 h-9 border border-[#444] bg-[#111] hover:bg-[#222] transition-colors text-sm font-medium text-white"
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleOpenSave}
            className="flex items-center justify-center sm:justify-start gap-2 w-10 sm:w-auto sm:px-4 h-9 border border-[#444] bg-[#111] hover:bg-[#222] transition-colors text-sm font-medium text-[#a1a1a1] hover:text-white"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Save className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSaved ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={stopAll}
            className="flex items-center justify-center sm:justify-start gap-2 w-10 sm:w-auto sm:px-4 h-9 border border-[#444] bg-black hover:bg-[#111] transition-colors text-sm font-medium text-[#a1a1a1] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>

      {isSaveDialogOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#222] shadow-2xl flex flex-col">
            <div className="h-12 border-b border-[#222] flex items-center justify-between px-4 sm:px-6">
              <span className="text-[11px] font-mono text-[#888] tracking-widest uppercase">
                [PRESET] / SAVE
              </span>
              <button onClick={() => setIsSaveDialogOpen(false)} className="text-[#888] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-[#888] uppercase tracking-widest">Preset Name</label>
                <input 
                  type="text" 
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirmSave()}
                  className="h-10 w-full bg-[#111] border border-[#333] px-3 font-mono text-sm text-white focus:outline-none focus:border-[#555]"
                  placeholder="e.g. Deep Focus"
                  autoFocus
                />
              </div>
              <button 
                onClick={handleConfirmSave}
                disabled={!presetName.trim()}
                className="h-10 w-full border border-[#444] bg-white text-black hover:bg-[#e0e0e0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-bold uppercase tracking-widest"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
