'use client';

import React, { useState } from 'react';
import { Sparkles, Play, Clock, Flame, Smile, Meh, Moon, AlertTriangle, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { Task, EnergyLevel, MicroStep } from '@/types';
import { aiEngine, RecommendationResult } from '@/lib/aiEngine';
import confetti from 'canvas-confetti';

interface WhatNowViewProps {
  tasks: Task[];
  energy: EnergyLevel;
  setEnergy: (e: EnergyLevel) => void;
  onStartFocus: (task: Task, step?: MicroStep, minutes?: number) => void;
  onDecomposeTask: (taskId: string) => void;
}

export const WhatNowView: React.FC<WhatNowViewProps> = ({
  tasks,
  energy,
  setEnergy,
  onStartFocus,
  onDecomposeTask
}) => {
  const [availableMinutes, setAvailableMinutes] = useState<number>(20);
  const [momentumStep, setMomentumStep] = useState<number>(1);

  const recommendation: RecommendationResult | null = aiEngine.getWhatShouldIDoNow(tasks, energy, availableMinutes);

  const triggerSparkles = () => {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  const handleCompleteMomentum = () => {
    triggerSparkles();
    setMomentumStep(prev => prev + 1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          What Should I Do Right Now?
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Zero decisions. We match your battery to 1 tiny action.
        </p>
      </div>

      {/* Control Strip */}
      <div className="glass-panel p-5 rounded-3xl space-y-4">
        {/* Time Selector */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> Available Minutes
            </span>
            <span className="font-mono text-indigo-400 font-extrabold">{availableMinutes} min</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[5, 10, 15, 25, 45].map((m) => (
              <button
                key={m}
                onClick={() => setAvailableMinutes(m)}
                className={`py-2 rounded-2xl text-xs font-bold border transition hover:scale-105 active:scale-95 ${
                  availableMinutes === m
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Energy Selector */}
        <div>
          <span className="text-xs font-bold text-slate-300 block mb-2">Current Energy</span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'high', label: 'High 🔥' },
              { id: 'good', label: 'Good 🙂' },
              { id: 'low', label: 'Low 😐' },
              { id: 'tired', label: 'Tired 🥱' },
              { id: 'overwhelmed', label: 'Overwhelmed 😵' },
              { id: 'hyperfocused', label: 'Hyperfocus ⚡' }
            ].map((e) => (
              <button
                key={e.id}
                onClick={() => setEnergy(e.id as EnergyLevel)}
                className={`py-2 px-1 rounded-2xl text-xs font-bold border transition hover:scale-105 active:scale-95 ${
                  energy === e.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Recommendation Card */}
      {recommendation ? (
        <div className="glass-panel-elevated glow-indigo p-6 sm:p-8 rounded-3xl space-y-5 transition-all">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
              Selected For You
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              ~{recommendation.durationMinutes} min
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Task: {recommendation.task.title}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {recommendation.recommendedStep.title}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onStartFocus(recommendation.task, recommendation.recommendedStep, recommendation.durationMinutes)}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START THIS STEP RIGHT NOW</span>
            </button>

            <button
              onClick={() => onDecomposeTask(recommendation.task.id)}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Make Smaller
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 sm:p-10 rounded-3xl glass-panel space-y-2 border border-slate-800">
          <p className="text-slate-200 text-sm font-bold">No tasks in your queue right now!</p>
          <p className="text-slate-400 text-xs">
            You have a fresh, clean runway. You can add a task or use the Task Start Engine below to break inertia right away.
          </p>
        </div>
      )}

      {/* Signature: Task Start Engine */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Task Start Engine</h3>
            <p className="text-xs text-slate-400 font-medium">Bypass inertia with effortless micro-wins</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          {momentumStep === 1 && (
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block mb-1">Step 1</span>
              <p className="text-sm font-bold text-slate-100">
                Pick up just ONE single item, or open the relevant file and look at line 1.
              </p>
              <button
                onClick={handleCompleteMomentum}
                className="mt-3 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl flex items-center gap-2 transition hover:scale-105 active:scale-95 shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" /> Done! Claim Win
              </button>
            </div>
          )}

          {momentumStep === 2 && (
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block mb-1">Step 2</span>
              <p className="text-sm font-bold text-slate-100">
                Inertia broken! Now pick up 2 more items or write 1 rough bullet point.
              </p>
              <button
                onClick={handleCompleteMomentum}
                className="mt-3 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl flex items-center gap-2 transition hover:scale-105 active:scale-95 shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" /> Done! Keep Going
              </button>
            </div>
          )}

          {momentumStep >= 3 && (
            <div className="space-y-2">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block mb-1">Flow Active</span>
              <p className="text-sm font-bold text-slate-100">
                You are officially moving! The hardest part is behind you.
              </p>
              <button
                onClick={() => setMomentumStep(1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Starter
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
