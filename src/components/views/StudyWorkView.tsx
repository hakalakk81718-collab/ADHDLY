'use client';

import React, { useState } from 'react';
import { BookOpen, Briefcase, Play } from 'lucide-react';
import { Task } from '@/types';
import { aiEngine } from '@/lib/aiEngine';
import { VoiceTypingButton } from '@/components/VoiceTypingButton';
import confetti from 'canvas-confetti';

interface StudyWorkViewProps {
  onStartFocus: (task: Task, step?: any, minutes?: number) => void;
  onAddTask: (task: Task) => void;
}

export const StudyWorkView: React.FC<StudyWorkViewProps> = ({ onStartFocus, onAddTask }) => {
  const [activeTab, setActiveTab] = useState<'study' | 'work'>('study');
  const [inputTitle, setInputTitle] = useState('');

  const studyTemplates = [
    { title: 'Study for upcoming Exam/Topic', time: '25m', desc: '1. Open syllabus -> 2. Pick 1 topic -> 3. Skim bold headers -> 4. Write 3 notes' },
    { title: 'Write Essay / Paper Introduction', time: '20m', desc: '1. Open document -> 2. Write 1 rough thesis sentence -> 3. Add 2 citations' },
    { title: 'Complete Problem Set / Homework', time: '30m', desc: '1. Set up paper/IDE -> 2. Solve problem 1 only -> 3. Take 2-min breather' },
  ];

  const workTemplates = [
    { title: 'Clear Urgent Inbox Messages', time: '15m', desc: '1. Open email -> 2. Reply to 2 shortest threads -> 3. Archive done emails' },
    { title: 'Prepare for Upcoming Review / Meeting', time: '20m', desc: '1. Open calendar event -> 2. Write 3 agenda bullets -> 3. Review slide deck' },
    { title: 'Unblock Code / Project Task', time: '25m', desc: '1. Open IDE & isolate bug -> 2. Reproduce in terminal -> 3. Add 1 fix commit' },
  ];

  const handleLaunchTemplate = (tmpl: { title: string; time: string; desc: string }) => {
    const steps = aiEngine.decomposeTask(tmpl.title, activeTab === 'study' ? 'college' : 'work');
    const task: Task = {
      id: 'task-' + Date.now(),
      title: tmpl.title,
      category: (activeTab === 'study' ? 'college' : 'work') as any,
      priority: 'urgent-important',
      energyRequired: 'low',
      estimatedMinutes: parseInt(tmpl.time) || 20,
      steps,
      currentStepIndex: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    onAddTask(task);
    onStartFocus(task, steps[0], steps[0]?.durationMinutes || 5);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const handleCustomLaunch = () => {
    if (!inputTitle.trim()) return;
    handleLaunchTemplate({
      title: inputTitle.trim(),
      time: '20m',
      desc: 'Custom decomposed workflow'
    });
    setInputTitle('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Study & Work Modes</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Pre-decomposed executive function templates designed for common ADHD resistance traps.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab('study')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition ${
            activeTab === 'study'
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Study Mode</span>
        </button>

        <button
          onClick={() => setActiveTab('work')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition ${
            activeTab === 'work'
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Work Mode</span>
        </button>
      </div>

      {/* Quick Launch Input */}
      <div className="p-4 rounded-3xl bg-[#0e1624] border border-slate-800 flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={`Enter or speak any ${activeTab} task (e.g. "${activeTab === 'study' ? 'Study linear algebra' : 'Finish client report'}")`}
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            className="w-full pl-4 pr-11 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            <VoiceTypingButton
              size="sm"
              onTranscript={(text) => setInputTitle(prev => (prev ? `${prev} ${text}` : text))}
              title={`Speak ${activeTab} task`}
            />
          </div>
        </div>
        <button
          onClick={handleCustomLaunch}
          disabled={!inputTitle.trim()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/30"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Break Down & Focus</span>
        </button>
      </div>

      {/* Pre-Built Breakdown Templates */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Instant Decomposed Templates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(activeTab === 'study' ? studyTemplates : workTemplates).map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[#0f1522] border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100">{t.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                    {t.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
              </div>

              <button
                onClick={() => handleLaunchTemplate(t)}
                className="w-full py-2.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch This Plan</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
