'use client';

import React, { useState } from 'react';
import { 
  BarChart2, Award, Clock, RefreshCw, Zap, ShieldCheck, 
  Sparkles, CheckCircle2, Moon, Sun, Sliders
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { ProductivityInsights } from '@/types';

export const InsightsView: React.FC = () => {
  const [insights] = useState<ProductivityInsights>(() => storage.getInsights());
  const [preferences, setPreferences] = useState(() => storage.getPreferences());

  const toggleSensoryFriendly = () => {
    const next = !preferences.sensoryFriendly;
    const updated = { ...preferences, sensoryFriendly: next };
    setPreferences(updated);
    storage.savePreferences(updated);

    if (typeof document !== 'undefined') {
      if (next) document.body.classList.add('sensory-friendly');
      else document.body.classList.remove('sensory-friendly');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Positive Progress & Time Insights</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Zero guilt. No punitive streaks. ADHDLY rewards starting, recovering, and returning.
        </p>
      </div>

      {/* Hero Milestones: Positive Progress System (Section 32) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#131e2f] to-[#0d1421] border border-indigo-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Kind Executive Milestones</h2>
            <p className="text-xs text-slate-400">Celebrating resilience over artificial streaks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {insights.positiveMilestones.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3 text-xs text-slate-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-[#0e1522] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Focus Time
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {insights.totalFocusMinutes}m
          </div>
          <div className="text-[10px] text-slate-400">Pure single-tasking</div>
        </div>

        <div className="p-4 rounded-3xl bg-[#0e1522] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-xs flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Tasks Initiated
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {insights.tasksStarted}
          </div>
          <div className="text-[10px] text-slate-400">Broke starting friction</div>
        </div>

        <div className="p-4 rounded-3xl bg-[#0e1522] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-xs flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Restarts & Returns
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {insights.recoverySessions}
          </div>
          <div className="text-[10px] text-slate-400">Came back without guilt</div>
        </div>

        <div className="p-4 rounded-3xl bg-[#0e1522] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Completed
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {insights.tasksCompleted}
          </div>
          <div className="text-[10px] text-slate-400">Finished completely</div>
        </div>
      </div>

      {/* Time Blindness Assistant (Section 9) */}
      <div className="p-6 rounded-3xl bg-[#0e1624] border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-slate-100">Time Blindness Pattern Analysis</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tracking the difference between estimated time and actual elapsed time without judgment:
        </p>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Writing & Research Tasks:</span>
            <span className="text-amber-400 font-mono">Tend to take ~1.3x longer than initial guess</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Short Admin Tasks:</span>
            <span className="text-emerald-400 font-mono">Usually finish faster than feared (0.8x)</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            💡 ADHDLY automatically adds a gentle 25% safety buffer when generating recommendations.
          </p>
        </div>
      </div>

      {/* Sensory Friendly & Accessibility Mode (Section 49) */}
      <div className="p-6 rounded-3xl bg-[#0e1624] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100">Sensory-Friendly Mode</h2>
            <p className="text-xs text-slate-400">
              Disables all animations, softens high contrasts, and removes stimulus glare.
            </p>
          </div>
          <button
            onClick={toggleSensoryFriendly}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              preferences.sensoryFriendly
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {preferences.sensoryFriendly ? 'Enabled' : 'Enable Mode'}
          </button>
        </div>
      </div>

    </div>
  );
};
