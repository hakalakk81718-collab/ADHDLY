'use client';

import React, { useState } from 'react';
import { Plus, Check, Play, Split, Trash2 } from 'lucide-react';
import { Task, MicroStep, TaskCategory } from '@/types';
import { aiEngine } from '@/lib/aiEngine';
import { storage } from '@/lib/storage';
import confetti from 'canvas-confetti';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onStartFocus: (task: Task, step?: MicroStep, minutes?: number) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  setTasks,
  onStartFocus
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('work');
  const [newEnergy, setNewEnergy] = useState<'low' | 'medium' | 'high'>('low');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const triggerSparkles = () => {
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const steps = aiEngine.decomposeTask(newTitle.trim(), newCategory);

    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      priority: 'urgent-important',
      energyRequired: newEnergy,
      estimatedMinutes: steps.reduce((acc, s) => acc + s.durationMinutes, 0) || 15,
      steps,
      currentStepIndex: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    storage.saveTasks(updated);
    setNewTitle('');
    triggerSparkles();
  };

  const handleToggleStep = (taskId: string, stepId: string) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const newSteps = t.steps.map(s => {
        if (s.id === stepId) {
          const next = !s.completed;
          if (next) triggerSparkles();
          return { ...s, completed: next };
        }
        return s;
      });

      const allDone = newSteps.length > 0 && newSteps.every(s => s.completed);
      return {
        ...t,
        steps: newSteps,
        completed: allDone,
        completedAt: allDone ? new Date().toISOString() : undefined
      };
    });

    setTasks(updated);
    storage.saveTasks(updated);
  };

  const handleDecompose = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const steps = aiEngine.decomposeTask(t.title, t.category);
      return { ...t, steps };
    });
    setTasks(updated);
    storage.saveTasks(updated);
    triggerSparkles();
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    storage.saveTasks(updated);
  };

  const filtered = tasks.filter(t => filterCategory === 'all' || t.category === filterCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Tasks & Micro-Steps</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Automatic 2-minute steps. Step 1 is always effortless.
        </p>
      </div>

      {/* Add Task Bar */}
      <form onSubmit={handleCreateTask} className="glass-panel p-4 rounded-3xl space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type any task (e.g. 'File taxes', 'Clean kitchen', 'Reply email')..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add & Decompose</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 text-xs font-semibold outline-none"
          >
            <option value="work">💼 Work</option>
            <option value="college">🎓 Study</option>
            <option value="home">🏠 Home</option>
            <option value="personal">🧠 Personal</option>
          </select>

          <select
            value={newEnergy}
            onChange={(e) => setNewEnergy(e.target.value as 'low' | 'medium' | 'high')}
            className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 text-xs font-semibold outline-none"
          >
            <option value="low">🔋 Low Battery</option>
            <option value="medium">⚡ Medium</option>
            <option value="high">🔥 High Energy</option>
          </select>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'work', 'college', 'home', 'personal'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl border transition capitalize font-bold hover:scale-105 ${
              filterCategory === cat
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="space-y-3.5">
        {filtered.map((task) => {
          const completedSteps = task.steps.filter(s => s.completed).length;
          const nextUnfinished = task.steps.find(s => !s.completed);

          return (
            <div
              key={task.id}
              className={`p-5 rounded-3xl glass-panel transition space-y-3 hover:border-slate-700 ${
                task.completed ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-base font-black ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 font-bold uppercase">
                      {task.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/15 text-indigo-300 font-bold">
                      {task.energyRequired}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!task.completed && nextUnfinished && (
                    <button
                      onClick={() => onStartFocus(task, nextUnfinished, nextUnfinished.durationMinutes)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 transition hover:scale-105 active:scale-95 shadow-md shadow-indigo-600/25"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Focus</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDecompose(task.id)}
                    className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition"
                    title="Re-decompose"
                  >
                    <Split className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Steps List */}
              {task.steps.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {task.steps.map((st, idx) => (
                    <div
                      key={st.id}
                      onClick={() => handleToggleStep(task.id, st.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer select-none ${
                        st.completed
                          ? 'bg-slate-950/40 border-slate-800/40 text-slate-500 line-through'
                          : idx === 0 && completedSteps === 0
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200 font-bold'
                          : 'bg-slate-900/40 border-slate-800/60 text-slate-200 font-medium hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition ${
                            st.completed
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'border-slate-600'
                          }`}
                        >
                          {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{st.title}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 shrink-0 ml-2">~{st.durationMinutes}m</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-3xl glass-panel space-y-2">
            <p className="text-sm font-bold text-slate-300">No tasks here yet.</p>
            <p className="text-xs text-slate-500">Add a task above to generate 2-minute steps.</p>
          </div>
        )}
      </div>

    </div>
  );
};
