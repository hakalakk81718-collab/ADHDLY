'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, CheckCircle2, RefreshCw, Volume2, 
  VolumeX, Maximize2, Minimize2, X, Coffee, Sparkles
} from 'lucide-react';
import { Task, MicroStep } from '@/types';
import { soundEngine } from '@/lib/soundEngine';
import { storage } from '@/lib/storage';
import confetti from 'canvas-confetti';

interface FocusViewProps {
  activeTask?: Task | null;
  activeStep?: MicroStep | null;
  initialMinutes?: number;
  onExit: () => void;
  onOpenRecovery: () => void;
  onTaskCompleted?: (taskId: string) => void;
}

export const FocusView: React.FC<FocusViewProps> = ({
  activeTask,
  activeStep,
  initialMinutes = 25,
  onExit,
  onOpenRecovery,
  onTaskCompleted
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [distractionShield, setDistractionShield] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [hyperfocusPrompt, setHyperfocusPrompt] = useState(false);
  const [totalSecondsFocused, setTotalSecondsFocused] = useState(0);

  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
    setMinutes(initialMinutes);
  }, [initialMinutes]);

  const handleTimerComplete = (plannedMins = minutes, actualSecs = minutes * 60) => {
    setIsRunning(false);
    if (soundEngine) soundEngine.playBellTone(528, 0.7);
    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } catch {}

    storage.saveFocusSession({
      id: 'sess-' + Date.now(),
      taskId: activeTask?.id,
      taskTitle: activeTask?.title || 'Focused session',
      stepTitle: activeStep?.title,
      plannedMinutes: plannedMins,
      actualSeconds: actualSecs,
      completedSuccessfully: true,
      interrupted: false,
      createdAt: new Date().toISOString()
    });
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimerComplete(minutes, minutes * 60);
          return 0;
        }
        return prev - 1;
      });
      setTotalSecondsFocused(prev => {
        const next = prev + 1;
        if (next === 5400) setHyperfocusPrompt(true);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, minutes]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if (!isRunning && !audioActive && soundEngine) {
      soundEngine.startChannel('brown', 0.6);
      setAudioActive(true);
    }
  };

  const resetTimer = (newMins: number) => {
    setIsRunning(false);
    setMinutes(newMins);
    setSecondsLeft(newMins * 60);
  };

  const toggleSound = () => {
    if (!soundEngine) return;
    if (audioActive) {
      soundEngine.stopAll();
      setAudioActive(false);
    } else {
      soundEngine.startChannel('brown', 0.6);
      setAudioActive(true);
    }
  };

  const handleStepDone = () => {
    if (soundEngine) soundEngine.playBellTone(528, 0.5);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {}

    if (activeTask && onTaskCompleted) {
      onTaskCompleted(activeTask.id);
    }

    // Immediately return to Today dashboard as requested
    setTimeout(() => {
      onExit();
    }, 350);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.max(0, ((minutes * 60 - secondsLeft) / (minutes * 60)) * 100));

  return (
    <div className={`relative min-h-[82vh] flex flex-col justify-between p-6 sm:p-10 rounded-3xl transition-all duration-300 ${
      distractionShield 
        ? 'fixed inset-0 z-50 rounded-none bg-[#05080e] text-slate-100 flex flex-col justify-between' 
        : 'glass-panel-elevated text-slate-100 max-w-3xl mx-auto'
    }`}>

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
            Focus Chamber
          </span>
          {isRunning && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>In Flow</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-2xl border text-xs font-bold transition hover:scale-105 active:scale-95 ${
              audioActive 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' 
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Brown Noise"
          >
            {audioActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setDistractionShield(!distractionShield)}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition hover:scale-105"
            title="Toggle Distraction Shield"
          >
            {distractionShield ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onExit}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-rose-400 transition hover:scale-105"
            title="Exit Focus"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Target */}
      <div className="text-center my-auto space-y-6 max-w-xl mx-auto py-6">
        
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
            {activeTask ? activeTask.title : 'Focus Target'}
          </span>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {activeStep ? activeStep.title : (activeTask?.title || 'Single Intentional Step')}
          </h1>
        </div>

        {/* Big Glowing Timer Digits */}
        <div className="space-y-4">
          <div className="font-mono text-7xl sm:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_35px_rgba(99,102,241,0.25)] select-none">
            {formatTime(secondsLeft)}
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="w-full max-w-md mx-auto h-2.5 rounded-full bg-slate-800/80 overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Start / Pause & Step Done Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={toggleTimer}
            className={`px-8 py-4 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2.5 transition shadow-2xl hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/40'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepDone}
            className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base flex items-center gap-2 transition shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Step Done</span>
          </button>
        </div>

        {/* Quick Duration Pills */}
        <div className="flex justify-center gap-1.5 flex-wrap pt-2">
          {[5, 10, 15, 25, 30, 45, 60].map((t) => (
            <button
              key={t}
              onClick={() => resetTimer(t)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition hover:scale-105 ${
                minutes === t
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 ring-1 ring-indigo-400/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}m
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Lifeline: Zero-Guilt Recovery */}
      <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onOpenRecovery}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700/80 transition hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>I got off track / I&apos;m distracted</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono font-medium">
          Zero guilt • Pause anytime • Every minute counts
        </span>
      </div>

      {/* Hyperfocus Modal */}
      {hyperfocusPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="glass-panel-elevated rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 mx-auto flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Deep Focus Check-in</h3>
              <p className="text-xs text-slate-300 mt-1">
                You&apos;ve been focused for &gt;90 minutes! How&apos;s your posture and water?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setHyperfocusPrompt(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                Keep Going
              </button>
              <button
                onClick={() => {
                  setHyperfocusPrompt(false);
                  setIsRunning(false);
                  onOpenRecovery();
                }}
                className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-cyan-600/30"
              >
                Drink Water & Stretch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
