'use client';

import React, { useState } from 'react';
import { Brain, ArrowRight, Sparkles, CheckCircle2, Trash2 } from 'lucide-react';
import { BrainDumpItem, Task } from '@/types';
import { aiEngine } from '@/lib/aiEngine';
import { storage } from '@/lib/storage';
import confetti from 'canvas-confetti';
import { VoiceTypingButton } from '@/components/VoiceTypingButton';

interface BrainDumpViewProps {
  items: BrainDumpItem[];
  setItems: React.Dispatch<React.SetStateAction<BrainDumpItem[]>>;
  onConvertToTask: (task: Task) => void;
}

export const BrainDumpView: React.FC<BrainDumpViewProps> = ({
  items,
  setItems,
  onConvertToTask
}) => {
  const [rawText, setRawText] = useState('');
  const [topActionSuggestion, setTopActionSuggestion] = useState<string | null>(null);

  const handleProcessDump = () => {
    if (!rawText.trim()) return;
    const result = aiEngine.processBrainDumpText(rawText);

    const newItems: BrainDumpItem[] = result.items.map(it => ({
      id: 'bd-' + Math.random().toString(36).substring(2, 9),
      rawText: it.text,
      category: it.category,
      createdAt: new Date().toISOString()
    }));

    const updated = [...newItems, ...items];
    setItems(updated);
    storage.saveBrainDump(updated);
    setTopActionSuggestion(result.topAction);
    setRawText('');

    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const handleConvertSingle = (item: BrainDumpItem) => {
    const steps = aiEngine.decomposeTask(item.rawText);
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: item.rawText,
      category: (item.category === 'college' ? 'college' : item.category === 'home' ? 'home' : 'work') as any,
      priority: item.category === 'urgent' ? 'urgent-important' : 'important',
      energyRequired: 'low',
      estimatedMinutes: 10,
      steps,
      currentStepIndex: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    onConvertToTask(newTask);

    const updated = items.filter(i => i.id !== item.id);
    setItems(updated);
    storage.saveBrainDump(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    storage.saveBrainDump(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Brain Dump</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Pour messy thoughts out. We sort them instantly.
        </p>
      </div>

      {/* Input Box */}
      <div className="glass-panel p-5 rounded-3xl space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            placeholder="Type or speak anything in your head: 'Need to finish report, reply to professor, buy groceries, fix sink'..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 resize-none leading-relaxed transition"
          />

          <div className="absolute bottom-3 right-3">
            <VoiceTypingButton
              size="md"
              onTranscript={(text) => setRawText((prev) => (prev ? `${prev} ${text}` : text))}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-slate-400 font-medium">
            Voice typing supported. Dictate, type comma lists, or paste.
          </span>
          <button
            onClick={handleProcessDump}
            disabled={!rawText.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" /> Untangle
          </button>
        </div>
      </div>

      {/* Immediate Priority Banner */}
      {topActionSuggestion && (
        <div className="glass-panel-elevated border-amber-500/40 p-5 rounded-3xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 uppercase tracking-widest">
              Top Action
            </span>
            <span className="text-xs text-slate-400">Everything else is safely saved</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white">
            {topActionSuggestion}
          </h3>

          <button
            onClick={() => {
              const matched = items.find(i => i.rawText.includes(topActionSuggestion));
              if (matched) handleConvertSingle(matched);
              else {
                const steps = aiEngine.decomposeTask(topActionSuggestion);
                onConvertToTask({
                  id: 'task-' + Date.now(),
                  title: topActionSuggestion,
                  category: 'work',
                  priority: 'urgent-important',
                  energyRequired: 'low',
                  estimatedMinutes: 10,
                  steps,
                  currentStepIndex: 0,
                  completed: false,
                  createdAt: new Date().toISOString()
                });
              }
              setTopActionSuggestion(null);
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Start This As Micro-Task Now
          </button>
        </div>
      )}

      {/* Parked Items Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Parked Thoughts ({items.length})
          </h2>
          {items.length > 0 && (
            <button
              onClick={() => { setItems([]); storage.saveBrainDump([]); }}
              className="text-xs text-slate-500 hover:text-rose-400 transition"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl glass-panel hover:border-slate-700 transition flex items-center justify-between gap-3 group"
            >
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{item.rawText}</p>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono capitalize">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleConvertSingle(item)}
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 text-xs font-bold flex items-center gap-1 transition hover:scale-105 active:scale-95"
                  title="Make this an active task"
                >
                  <span>To Task</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-10 rounded-3xl glass-panel text-slate-500 text-xs font-medium">
            No parked items. Whenever thoughts crowd your head, dump them here.
          </div>
        )}
      </div>

    </div>
  );
};
