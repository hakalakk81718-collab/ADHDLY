'use client';

import React, { useState } from 'react';
import { Layers, CheckCircle2, RefreshCw, Plus, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Routine, RoutineStep } from '@/types';
import { storage } from '@/lib/storage';
import confetti from 'canvas-confetti';

interface RoutinesViewProps {
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  routines,
  setRoutines
}) => {
  const [activeRoutineId, setActiveRoutineId] = useState<string>(routines[0]?.id || 'routine-morning');
  const [checklist, setChecklist] = useState(() => storage.getPreferences().leavingChecklist);

  const activeRoutine = routines.find(r => r.id === activeRoutineId) || routines[0];

  const triggerSparkles = () => {
    try {
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
    } catch {}
  };

  const handleNextStep = () => {
    triggerSparkles();
    if (!activeRoutine) return;
    const currentIdx = activeRoutine.currentStepIndex;
    const nextIdx = Math.min(activeRoutine.steps.length - 1, currentIdx + 1);

    const updatedRoutines = routines.map(r => {
      if (r.id !== activeRoutine.id) return r;
      const updatedSteps = r.steps.map((s, idx) => (idx === currentIdx ? { ...s, completed: true } : s));
      return {
        ...r,
        steps: updatedSteps,
        currentStepIndex: nextIdx,
        lastCompletedAt: nextIdx === r.steps.length - 1 && currentIdx === nextIdx ? new Date().toISOString() : r.lastCompletedAt
      };
    });

    setRoutines(updatedRoutines);
    storage.saveRoutines(updatedRoutines);
  };

  const handleResetRoutine = () => {
    if (!activeRoutine) return;
    const updatedRoutines = routines.map(r => {
      if (r.id !== activeRoutine.id) return r;
      return {
        ...r,
        currentStepIndex: 0,
        steps: r.steps.map(s => ({ ...s, completed: false }))
      };
    });
    setRoutines(updatedRoutines);
    storage.saveRoutines(updatedRoutines);
  };

  const [newChecklistText, setNewChecklistText] = useState('');

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: 'item-' + Date.now(),
      label: newChecklistText.trim(),
      checked: true
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    const prefs = storage.getPreferences();
    storage.savePreferences({ ...prefs, leavingChecklist: updated });
    setNewChecklistText('');
    triggerSparkles();
  };

  const handleUncheckAll = () => {
    const updated = checklist.map(i => ({ ...i, checked: false }));
    setChecklist(updated);
    const prefs = storage.getPreferences();
    storage.savePreferences({ ...prefs, leavingChecklist: updated });
  };

  const handleRemoveChecklistItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = checklist.filter(i => i.id !== id);
    setChecklist(updated);
    const prefs = storage.getPreferences();
    storage.savePreferences({ ...prefs, leavingChecklist: updated });
  };

  const currentStep = activeRoutine?.steps[activeRoutine.currentStepIndex];
  const isRoutineFinished = activeRoutine?.steps.every(s => s.completed);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Routines & Doorway Launchpad</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Low-friction routines. ADHDLY only shows <strong>ONE single step at a time</strong> so your brain never gets overwhelmed.
        </p>
      </div>

      {/* Routine Selector Tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {routines.map(r => (
          <button
            key={r.id}
            onClick={() => setActiveRoutineId(r.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition ${
              activeRoutineId === r.id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {r.title}
          </button>
        ))}
      </div>

      {/* Hero Single Step Display (Section 21) */}
      {activeRoutine && (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#131d2e] to-[#0c1320] border border-indigo-500/40 shadow-2xl text-center space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-indigo-400 uppercase tracking-wider">
              {activeRoutine.title}
            </span>
            <span className="font-mono">
              Step {activeRoutine.currentStepIndex + 1} of {activeRoutine.steps.length}
            </span>
          </div>

          {!isRoutineFinished && currentStep ? (
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-widest inline-block">
                NEXT STEP ONLY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {currentStep.title}
              </h2>
              <p className="text-xs text-slate-400">
                Takes ~{currentStep.durationMinutes} min. Focus exclusively on this.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 mx-auto transition shadow-lg shadow-emerald-600/25 hover:scale-105"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Done! Next Step</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-3">
              <span className="text-4xl">🎉</span>
              <h2 className="text-2xl font-bold text-slate-100">Routine Completed!</h2>
              <p className="text-xs text-slate-400">You moved through each step with calm focus.</p>
              <button
                onClick={handleResetRoutine}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl flex items-center gap-1.5 mx-auto transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Start Routine Again
              </button>
            </div>
          )}

          {/* Micro Progress Track */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {activeRoutine.steps.map((st, idx) => (
              <div
                key={st.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeRoutine.currentStepIndex
                    ? 'w-8 bg-amber-400'
                    : st.completed
                    ? 'w-4 bg-emerald-500'
                    : 'w-4 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Doorway Launchpad: LEAVING-HOME CHECKLIST (Section 23) */}
      <div className="p-6 rounded-3xl bg-[#0e1624] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Doorway Launchpad (Leaving-Home Checklist)
            </h2>
            <p className="text-xs text-slate-400">Tap items as you touch them in your bag/pockets.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUncheckAll}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition"
            >
              Reset for Next Departure
            </button>
          </div>
        </div>

        {/* Quick Add Custom Item */}
        <form onSubmit={handleAddChecklistItem} className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom item (e.g. 'Gym bag', 'Passport', 'Snack')..."
            value={newChecklistText}
            onChange={(e) => setNewChecklistText(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!newChecklistText.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => {
                const updated = checklist.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i);
                setChecklist(updated);
                const prefs = storage.getPreferences();
                storage.savePreferences({ ...prefs, leavingChecklist: updated });
                triggerSparkles();
              }}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer select-none group ${
                item.checked
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                  item.checked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'
                }`}>
                  {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate">{item.label}</span>
              </div>
              <button
                onClick={(e) => handleRemoveChecklistItem(item.id, e)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 text-xs px-1 transition"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
