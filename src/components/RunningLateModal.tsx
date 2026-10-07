'use client';

import React, { useState } from 'react';
import { Timer, ArrowRight, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { aiEngine, RunningLatePlanItem } from '@/lib/aiEngine';

import confetti from 'canvas-confetti';

interface RunningLateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunningLateModal: React.FC<RunningLateModalProps> = ({ isOpen, onClose }) => {
  const [minutes, setMinutes] = useState<number>(25);
  const [plan, setPlan] = useState<RunningLatePlanItem[]>(() => aiEngine.generateRunningLatePlan(25));
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const handleRecalculate = (mins: number) => {
    setMinutes(mins);
    const newPlan = aiEngine.generateRunningLatePlan(mins);
    setPlan(newPlan);
    setActiveStepIndex(0);
  };

  const isLastStep = activeStepIndex >= plan.length - 1;

  const handleStepComplete = (idx: number) => {
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch {}

    if (idx + 1 < plan.length) {
      setActiveStepIndex(idx + 1);
    } else {
      // User finished all steps - close gracefully!
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1522] border border-amber-900/40 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-100">&quot;I&apos;m Running Late&quot; Mode</h3>
            <p className="text-xs text-amber-400/90 font-medium">Anti-panic departure countdown</p>
          </div>
        </div>

        {/* Minutes Selector */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">When do you have to leave?</span>
            <span className="text-amber-400 font-bold font-mono text-sm">{minutes} minutes</span>
          </div>

          <div className="flex gap-2">
            {[10, 15, 20, 30, 45].map((m) => (
              <button
                key={m}
                onClick={() => handleRecalculate(m)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                  minutes === m
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Action */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase text-[10px]">
              DO THIS RIGHT NOW
            </span>
            <span className="text-slate-400 font-mono text-xs">{plan[activeStepIndex]?.minuteWindow}</span>
          </div>
          <div className="text-base font-bold text-slate-100">
            {plan[activeStepIndex]?.action}
          </div>
          <button
            onClick={() => handleStepComplete(activeStepIndex)}
            className="w-full mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 className="w-4 h-4" /> {isLastStep ? 'All Set! Ready to Depart 🚪' : 'Done, Next Step'}
          </button>
        </div>

        {/* Timeline breakdown */}
        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Exit Sequence</p>
          {plan.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                idx === activeStepIndex
                  ? 'bg-amber-500/10 border-amber-500/50 text-slate-100 font-medium'
                  : idx < activeStepIndex
                  ? 'bg-slate-900/30 border-slate-800/50 text-slate-500 line-through'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                  {idx + 1}
                </span>
                <span>{item.action}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 shrink-0 ml-2">{item.minuteWindow}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            I&apos;m ready to go (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
