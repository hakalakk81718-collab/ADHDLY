'use client';

import React from 'react';
import { 
  Sparkles, Play, Brain, Flame, Smile, Meh, Moon, 
  AlertTriangle, Zap, ChevronRight, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Task, EnergyLevel, MicroStep } from '@/types';
import { aiEngine, RecommendationResult } from '@/lib/aiEngine';

interface TodayViewProps {
  tasks: Task[];
  energy: EnergyLevel;
  setEnergy: (energy: EnergyLevel) => void;
  onStartFocus: (task: Task, step?: MicroStep, minutes?: number) => void;
  onOpenOverwhelm: () => void;
  onOpenBrainDump: () => void;
  onOpenTasks: () => void;
  onDecomposeTask: (taskId: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  energy,
  setEnergy,
  onStartFocus,
  onOpenOverwhelm,
  onOpenBrainDump,
  onOpenTasks,
  onDecomposeTask
}) => {
  const recommendation: RecommendationResult | null = aiEngine.getWhatShouldIDoNow(tasks, energy, 20);

  const energyOptions: { id: EnergyLevel; label: string; icon: React.ReactNode; glow: string }[] = [
    { id: 'high', label: 'High', icon: <Flame className="w-4 h-4 text-orange-400" />, glow: 'bg-orange-500/15 border-orange-500/40 text-orange-200' },
    { id: 'good', label: 'Good', icon: <Smile className="w-4 h-4 text-emerald-400" />, glow: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200' },
    { id: 'low', label: 'Low', icon: <Meh className="w-4 h-4 text-amber-400" />, glow: 'bg-amber-500/15 border-amber-500/40 text-amber-200' },
    { id: 'tired', label: 'Tired', icon: <Moon className="w-4 h-4 text-indigo-400" />, glow: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200' },
    { id: 'overwhelmed', label: 'Overwhelmed', icon: <AlertTriangle className="w-4 h-4 text-rose-400" />, glow: 'bg-rose-500/15 border-rose-500/40 text-rose-200' },
    { id: 'hyperfocused', label: 'Hyperfocus', icon: <Zap className="w-4 h-4 text-cyan-400" />, glow: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200' },
  ];

  const [greeting, setGreeting] = React.useState('Welcome back');

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const todayTasks = tasks.filter(t => !t.completed).slice(0, 3);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in">
      
      {/* 1. Header: Greeting & Quick Battery Strip */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-5 border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 suppressHydrationWarning className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>{greeting}</span> 
              <span className="inline-block animate-bounce" style={{ animationDuration: '3s' }}>👋</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Select your current brain energy battery level:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBrainDump}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold transition hover:scale-105 active:scale-95 border border-slate-700/80 shadow-sm"
            >
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>Brain Dump</span>
            </button>
          </div>
        </div>

        {/* Battery Pills */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
          {energyOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setEnergy(opt.id)}
              className={`p-2.5 sm:p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                energy === opt.id
                  ? `${opt.glow} shadow-lg ring-1 ring-white/30 scale-[1.02]`
                  : 'bg-slate-900/70 border-slate-800/90 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {opt.icon}
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Hero: WHAT SHOULD I DO NOW? (High-Contrast, Punchy, Animated Glow) */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl glass-panel-elevated glow-indigo border border-indigo-500/40 space-y-5 transition-all">
        
        {/* Glow accent in corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <span className="px-3.5 py-1.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-300 border border-amber-500/40 flex items-center gap-2 uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} /> 
            Do This Right Now
          </span>
          <span className="text-xs text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-xl bg-indigo-950/60 border border-indigo-500/30">
            1 Action Only
          </span>
        </div>

        {recommendation ? (
          <div className="space-y-4 relative z-10">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Parent Task: {recommendation.task.title}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                {recommendation.recommendedStep.title}
              </h2>
            </div>

            {/* Quick High-Signal Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-xl text-xs font-black font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <span>⏱️</span>
                <span>~{recommendation.durationMinutes} min step</span>
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 capitalize">
                {recommendation.task.category}
              </span>
              {recommendation.reason[0] && (
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900/80 text-slate-300 border border-slate-700/80">
                  {recommendation.reason[0]}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onStartFocus(recommendation.task, recommendation.recommendedStep, recommendation.durationMinutes)}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-2xl shadow-indigo-600/50 transition hover:scale-[1.02] active:scale-[0.98] ring-1 ring-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START THIS {recommendation.durationMinutes}-MINUTE STEP</span>
              </button>

              <button
                onClick={() => onDecomposeTask(recommendation.task.id)}
                className="py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700/80 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Make It Smaller
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3 relative z-10">
            <p className="text-base font-bold text-slate-200">All clear! No tasks pending.</p>
            <button
              onClick={onOpenBrainDump}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition hover:scale-105"
            >
              Start Brain Dump
            </button>
          </div>
        )}
      </div>

      {/* 3. Today's Essential Tasks (Visual & Minimal) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white tracking-tight">Today&apos;s Focus (Top 3)</h3>
          <button
            onClick={onOpenTasks}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition group"
          >
            <span>All Tasks</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {todayTasks.map((task) => {
            const nextStep = task.steps.find(s => !s.completed);

            return (
              <div
                key={task.id}
                className="p-4 sm:p-5 rounded-2xl glass-hud-card flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-100 group-hover:text-indigo-300 transition truncate">
                      {task.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800/90 text-slate-300 uppercase font-bold shrink-0 border border-slate-700/60">
                      {task.category}
                    </span>
                  </div>
                  {nextStep && (
                    <div className="text-xs text-amber-300/95 font-semibold truncate flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>{nextStep.title}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onStartFocus(task, nextStep, nextStep?.durationMinutes || 15)}
                  className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 hover:scale-105 active:scale-95 shadow-sm border border-slate-700/60 hover:border-transparent"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
