'use client';

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Edit3, Check, Wand2, Clock } from 'lucide-react';
import { Task, MicroStep } from '@/types';
import { RecommendationResult } from '@/lib/aiEngine';
import { VoiceTypingButton } from '@/components/VoiceTypingButton';
import confetti from 'canvas-confetti';

export interface RecommendationCardProps {
  recommendation: RecommendationResult | null;
  onStartFocus: (task: Task, step?: MicroStep, minutes?: number) => void;
  onDecomposeTask?: (taskId: string) => void;
  onAddTask?: (task: Task) => void;
  badgeLabel?: string;
  actionButtonText?: string;
}

const STARTER_PRESETS = [
  { task: 'Clean Desk Clutter', step: 'Pick up 1 dirty mug and take to sink', mins: 2 },
  { task: 'Study / Project', step: 'Open document and write just 1 sentence', mins: 2 },
  { task: 'Reply to Messages', step: 'Open inbox and archive 1 junk email', mins: 2 },
  { task: 'Health Reset', step: 'Drink 1 fresh glass of water', mins: 2 },
];

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onStartFocus,
  onDecomposeTask,
  onAddTask,
  badgeLabel = 'SELECTED FOR YOU',
  actionButtonText = 'START THIS STEP RIGHT NOW'
}) => {
  // Local state for editable task & step
  const [taskTitle, setTaskTitle] = useState('');
  const [stepTitle, setStepTitle] = useState('');
  const [duration, setDuration] = useState<number>(2);
  const [isEditingTask, setIsEditingTask] = useState(false);

  // Sync state whenever recommendation changes
  useEffect(() => {
    if (recommendation) {
      setTaskTitle(recommendation.task.title);
      setStepTitle(recommendation.recommendedStep.title);
      setDuration(recommendation.durationMinutes || 2);
      setIsEditingTask(false);
    } else {
      // Empty state defaults
      if (!taskTitle) setTaskTitle('Clean Desk Clutter');
      if (!stepTitle) setStepTitle('Pick up 1 dirty mug and take to sink');
      setDuration(2);
    }
  }, [recommendation]);

  const triggerSparkles = () => {
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const handleStart = () => {
    triggerSparkles();

    const finalStepTitle = stepTitle.trim() || 'Pick up 1 dirty mug and take to sink';
    const finalTaskTitle = taskTitle.trim() || 'Quick Micro-Win';

    if (recommendation) {
      const updatedStep: MicroStep = {
        ...recommendation.recommendedStep,
        title: finalStepTitle,
        durationMinutes: duration
      };
      const updatedTask: Task = {
        ...recommendation.task,
        title: finalTaskTitle
      };
      onStartFocus(updatedTask, updatedStep, duration);
    } else {
      // Create new task and step for the empty state
      const newTask: Task = {
        id: 'task-quick-' + Date.now(),
        title: finalTaskTitle,
        category: 'work',
        priority: 'urgent-important',
        energyRequired: 'low',
        estimatedMinutes: duration,
        steps: [
          {
            id: 'step-1',
            title: finalStepTitle,
            durationMinutes: duration,
            completed: false,
            order: 0
          }
        ],
        currentStepIndex: 0,
        completed: false,
        createdAt: new Date().toISOString()
      };

      if (onAddTask) {
        onAddTask(newTask);
      }
      onStartFocus(newTask, newTask.steps[0], duration);
    }
  };

  const handleMakeSmaller = () => {
    triggerSparkles();

    if (recommendation && onDecomposeTask) {
      onDecomposeTask(recommendation.task.id);
      return;
    }

    // Shrink custom or empty step to a 30-60 second micro step
    setDuration(1);
    if (!stepTitle.toLowerCase().includes('just')) {
      setStepTitle(prev => `Just touch or look at it for 30s: ${prev || 'desk'}`);
    } else {
      setStepTitle('Take 3 slow deep breaths right now');
    }
  };

  const handleSelectPreset = (preset: typeof STARTER_PRESETS[0]) => {
    setTaskTitle(preset.task);
    setStepTitle(preset.step);
    setDuration(preset.mins);
    triggerSparkles();
  };

  return (
    <div className="glass-panel-elevated glow-indigo p-6 sm:p-8 rounded-3xl space-y-5 transition-all border border-indigo-500/40 relative overflow-hidden">
      
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Badge & Duration */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest shadow-sm">
            {badgeLabel}
          </span>
          {!recommendation && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Editable Micro-Step
            </span>
          )}
        </div>

        {/* Duration Selector Chip */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-700/80">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <button
            type="button"
            onClick={() => setDuration(prev => (prev === 2 ? 5 : prev === 5 ? 10 : prev === 10 ? 1 : 2))}
            className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition"
            title="Click to toggle duration (1m, 2m, 5m, 10m)"
          >
            ~{duration} min
          </button>
        </div>
      </div>

      {/* Parent Task Header (Editable) */}
      <div className="relative z-10 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>TASK:</span>
            {isEditingTask || !recommendation ? (
              <span className="text-slate-500 font-normal normal-case text-[10px]">(click mic or type to edit)</span>
            ) : null}
          </span>

          {recommendation && (
            <button
              type="button"
              onClick={() => setIsEditingTask(prev => !prev)}
              className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition"
            >
              <Edit3 className="w-3 h-3" />
              {isEditingTask ? 'Done' : 'Edit task title'}
            </button>
          )}
        </div>

        {isEditingTask || !recommendation ? (
          <div className="relative flex items-center">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Clean Desk Clutter"
              className="w-full pl-3 pr-10 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-bold text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition"
            />
            <div className="absolute right-1">
              <VoiceTypingButton
                size="sm"
                onTranscript={(text) => setTaskTitle(prev => (prev ? `${prev} ${text}` : text))}
                title="Voice type task title"
              />
            </div>
          </div>
        ) : (
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {taskTitle || 'Clean Desk Clutter'}
          </div>
        )}
      </div>

      {/* Small Task / Micro-Step Title (Directly Editable with Keyboard & Mic) */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
            <Wand2 className="w-3 h-3 text-indigo-400" />
            <span>Small Task (Editable):</span>
          </label>
          <span className="text-[10px] text-slate-400 font-medium">Type with keyboard or speak with mic</span>
        </div>

        <div className="relative flex items-center group">
          <input
            type="text"
            value={stepTitle}
            onChange={(e) => setStepTitle(e.target.value)}
            placeholder="Pick up 1 dirty mug and take to sink"
            className="w-full pl-4 pr-14 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500/50 focus:border-indigo-500 text-lg sm:text-2xl font-black text-white placeholder-slate-500 outline-none transition shadow-inner leading-snug"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            <VoiceTypingButton
              size="md"
              onTranscript={(text) => setStepTitle(prev => (prev ? `${prev} ${text}` : text))}
              title="Speak small task with microphone"
            />
          </div>
        </div>

        {/* Quick starter presets when in empty mode or for fast inspiration */}
        {!recommendation && (
          <div className="pt-1 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Or pick an instant micro-win starter:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STARTER_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900/60 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-[11px] font-semibold text-slate-300 hover:text-indigo-200 transition text-left"
                >
                  ⚡ {preset.step}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: START and MAKE SMALLER */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 relative z-10">
        <button
          type="button"
          onClick={handleStart}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-[0.98] ring-1 ring-white/20"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{actionButtonText}</span>
        </button>

        <button
          type="button"
          onClick={handleMakeSmaller}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
          title="Shrink into an even smaller 1-minute step"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Make Smaller</span>
        </button>
      </div>

    </div>
  );
};
