'use client';

import React from 'react';
import { RefreshCw, Coffee, Compass, Sparkles, Brain, X, Check } from 'lucide-react';
import { storage } from '@/lib/storage';

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelected: (action: '2min-reset' | '5min-reset' | 'change-task' | 'brain-dump' | 'water-stretch') => void;
}

export const RecoveryModal: React.FC<RecoveryModalProps> = ({ isOpen, onClose, onActionSelected }) => {
  if (!isOpen) return null;

  const handleSelect = (action: '2min-reset' | '5min-reset' | 'change-task' | 'brain-dump' | 'water-stretch') => {
    storage.logRecovery({
      id: 'rec-' + Date.now(),
      timestamp: new Date().toISOString(),
      trigger: 'distracted',
      actionTaken: action,
      success: true
    });
    onActionSelected(action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0f1523] border border-indigo-900/50 rounded-3xl p-6 shadow-2xl text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-100">That&apos;s 100% okay.</h3>
            <p className="text-xs text-indigo-300 font-medium mt-0.5">Zero guilt. You can restart from right here.</p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed px-2">
            Every brain detours. What matters is that you noticed and showed up. How would you like to gently resume?
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => handleSelect('2min-reset')}
            className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-950/20 transition flex items-center gap-3 text-left group"
          >
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">2-Minute Gentle Reset</div>
              <div className="text-xs text-slate-400">Put phone away, sit upright, take 3 deep breaths</div>
            </div>
          </button>

          <button
            onClick={() => handleSelect('water-stretch')}
            className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-950/20 transition flex items-center gap-3 text-left group"
          >
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Drink Water & Roll Shoulders</div>
              <div className="text-xs text-slate-400">A quick somatic reset to wake up your body</div>
            </div>
          </button>

          <button
            onClick={() => handleSelect('change-task')}
            className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-950/20 transition flex items-center gap-3 text-left group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Switch to an Easier Task</div>
              <div className="text-xs text-slate-400">If the current task has too much resistance, pivot without guilt</div>
            </div>
          </button>

          <button
            onClick={() => handleSelect('brain-dump')}
            className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-950/20 transition flex items-center gap-3 text-left group"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Dump the Distracting Thought</div>
              <div className="text-xs text-slate-400">Park the rabbit hole in Brain Dump so you don&apos;t lose it</div>
            </div>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800/80 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Never mind, I&apos;m ready to dive right back into my timer
          </button>
        </div>
      </div>
    </div>
  );
};
