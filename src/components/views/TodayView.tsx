'use client';

import React from 'react';
import { 
  Sparkles, Play, Brain, Flame, Smile, Meh, Moon, 
  AlertTriangle, Zap, ChevronRight, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Task, EnergyLevel, MicroStep } from '@/types';
import { aiEngine, RecommendationResult } from '@/lib/aiEngine';
import { RecommendationCard } from '@/components/RecommendationCard';

interface TodayViewProps {
  tasks: Task[];
  energy: EnergyLevel;
  setEnergy: (energy: EnergyLevel) => void;
  onStartFocus: (task: Task, step?: MicroStep, minutes?: number) => void;
  onOpenOverwhelm: () => void;
  onOpenBrainDump: () => void;
  onOpenTasks: () => void;
  onDecomposeTask: (taskId: string) => void;
  onAddTask?: (task: Task) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  energy,
  setEnergy,
  onStartFocus,
  onOpenOverwhelm,
  onOpenBrainDump,
  onOpenTasks,
  onDecomposeTask,
  onAddTask
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

      {/* 2. Hero: WHAT SHOULD I DO NOW? (Always visible, editable, supports keyboard & mic) */}
      <RecommendationCard
        recommendation={recommendation}
        onStartFocus={onStartFocus}
        onDecomposeTask={onDecomposeTask}
        onAddTask={onAddTask}
        badgeLabel="DO THIS RIGHT NOW"
        actionButtonText="START THIS STEP RIGHT NOW"
      />

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

        {todayTasks.length > 0 ? (
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
        ) : (
          <div className="p-6 rounded-2xl glass-hud-card text-center space-y-2 border border-slate-800/80">
            <p className="text-xs font-bold text-slate-300">No active tasks in your queue.</p>
            <p className="text-[11px] text-slate-500">Break daunting goals into 2-minute micro-actions with zero shame.</p>
          </div>
        )}
      </div>

    </div>
  );
};
