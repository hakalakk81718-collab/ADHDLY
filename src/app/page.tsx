'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, ActiveTab } from '@/components/Navigation';
import { TodayView } from '@/components/views/TodayView';
import { WhatNowView } from '@/components/views/WhatNowView';
import { TasksView } from '@/components/views/TasksView';
import { BrainDumpView } from '@/components/views/BrainDumpView';
import { FocusView } from '@/components/views/FocusView';
import { ResetCenterView } from '@/components/views/ResetCenterView';
import { RoutinesView } from '@/components/views/RoutinesView';
import { StudyWorkView } from '@/components/views/StudyWorkView';
import { InsightsView } from '@/components/views/InsightsView';
import { LandingView } from '@/components/views/LandingView';

import { SoundMixerModal } from '@/components/SoundMixerModal';
import { OverwhelmModal } from '@/components/OverwhelmModal';
import { RecoveryModal } from '@/components/RecoveryModal';
import { RunningLateModal } from '@/components/RunningLateModal';
import { AskAiModal } from '@/components/AskAiModal';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';
import { AccountModal } from '@/components/AccountModal';
import { PwaInstallBanner } from '@/components/PwaInstallBanner';

import { storage, INITIAL_TASKS, INITIAL_ROUTINES, SAMPLE_DEMO_TASKS } from '@/lib/storage';
import { soundEngine } from '@/lib/soundEngine';
import { Task, MicroStep, EnergyLevel, BrainDumpItem, Routine, AuthUser } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [brainDump, setBrainDump] = useState<BrainDumpItem[]>([]);
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);
  const [energy, setEnergy] = useState<EnergyLevel>('good');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Focus mode states
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [activeFocusStep, setActiveFocusStep] = useState<MicroStep | null>(null);
  const [focusMinutes, setFocusMinutes] = useState<number>(25);

  // Modals state
  const [soundModalOpen, setSoundModalOpen] = useState(false);
  const [overwhelmModalOpen, setOverwhelmModalOpen] = useState(false);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [runningLateModalOpen, setRunningLateModalOpen] = useState(false);
  const [askAiModalOpen, setAskAiModalOpen] = useState(false);
  const [quickCaptureModalOpen, setQuickCaptureModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Load persisted data on mount with clean slate check
  useEffect(() => {
    storage.cleanLegacyDummyData();
    const user = storage.getAuthUser();
    setCurrentUser(user);

    const loadedTasks = storage.getTasks();
    setTasks(loadedTasks || []);
    
    const loadedDump = storage.getBrainDump();
    setBrainDump(loadedDump || []);

    const loadedRoutines = storage.getRoutines();
    if (loadedRoutines && loadedRoutines.length > 0) setRoutines(loadedRoutines);

    const prefs = storage.getPreferences();
    setEnergy(prefs.currentEnergy || 'good');

    if (prefs.sensoryFriendly && typeof document !== 'undefined') {
      document.body.classList.add('sensory-friendly');
    }

    const interval = setInterval(() => {
      if (soundEngine) {
        setAudioPlaying(soundEngine.getIsPlaying());
      }
    }, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickCaptureModalOpen(true);
      } else if (e.key === 'Escape') {
        setSoundModalOpen(false);
        setOverwhelmModalOpen(false);
        setRecoveryModalOpen(false);
        setRunningLateModalOpen(false);
        setAskAiModalOpen(false);
        setQuickCaptureModalOpen(false);
        setAccountModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleStartFocus = (task: Task, step?: MicroStep, minutes?: number) => {
    setActiveFocusTask(task);
    setActiveFocusStep(step || null);
    if (minutes) setFocusMinutes(minutes);
    setActiveTab('focus');
  };

  const handleStartSingleStep = (stepTitle: string, durationMinutes: number) => {
    const dummyTask: Task = {
      id: 'task-quick-' + Date.now(),
      title: stepTitle,
      category: 'work',
      priority: 'urgent-important',
      energyRequired: 'low',
      estimatedMinutes: durationMinutes,
      steps: [{ id: 's1', title: stepTitle, durationMinutes, completed: false, order: 0 }],
      currentStepIndex: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };
    handleStartFocus(dummyTask, dummyTask.steps[0], durationMinutes);
  };

  const handleAddTask = (newTask: Task) => {
    const updated = [newTask, ...tasks];
    setTasks(updated);
    storage.saveTasks(updated);
  };

  const handleRecoveryAction = (action: string) => {
    if (action === '2min-reset' || action === '5min-reset') {
      handleStartSingleStep(
        action === '2min-reset' ? '2-Minute gentle breathing reset' : '5-Minute mindful tea & stretch reset',
        action === '2min-reset' ? 2 : 5
      );
    } else if (action === 'brain-dump') {
      setActiveTab('brain-dump');
    } else if (action === 'change-task') {
      setActiveTab('what-now');
    } else {
      setActiveTab('reset');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans">
      
      {/* Global Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(t) => {
          if (t === 'audio') {
            setSoundModalOpen(true);
          } else {
            setActiveTab(t);
          }
        }}
        onOpenOverwhelm={() => setOverwhelmModalOpen(true)}
        onOpenQuickCapture={() => setQuickCaptureModalOpen(true)}
        onOpenSoundMixer={() => setSoundModalOpen(true)}
        onOpenAskAi={() => setAskAiModalOpen(true)}
        onOpenRunningLate={() => setRunningLateModalOpen(true)}
        onOpenAccount={() => setAccountModalOpen(true)}
        audioPlaying={audioPlaying}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        currentUser={currentUser}
      />

      {/* Main Workspace Canvas (Dynamically adapts to sidebar width) */}
      <main className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto ${
        sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-72'
      }`}>
        {activeTab === 'landing' && (
          <LandingView
            onEnterApp={() => setActiveTab('today')}
            onOpenOverwhelm={() => setOverwhelmModalOpen(true)}
            onOpenSoundMixer={() => setSoundModalOpen(true)}
          />
        )}

        {activeTab === 'today' && (
          <TodayView
            tasks={tasks}
            energy={energy}
            setEnergy={(e) => {
              setEnergy(e);
              const prefs = storage.getPreferences();
              storage.savePreferences({ ...prefs, currentEnergy: e });
            }}
            onStartFocus={handleStartFocus}
            onOpenOverwhelm={() => setOverwhelmModalOpen(true)}
            onOpenBrainDump={() => setActiveTab('brain-dump')}
            onOpenTasks={() => setActiveTab('tasks')}
            onDecomposeTask={() => setActiveTab('tasks')}
            onAddTask={handleAddTask}
          />
        )}

        {activeTab === 'what-now' && (
          <WhatNowView
            tasks={tasks}
            energy={energy}
            setEnergy={(e) => {
              setEnergy(e);
              const prefs = storage.getPreferences();
              storage.savePreferences({ ...prefs, currentEnergy: e });
            }}
            onStartFocus={handleStartFocus}
            onDecomposeTask={() => setActiveTab('tasks')}
            onAddTask={handleAddTask}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            setTasks={setTasks}
            onStartFocus={handleStartFocus}
          />
        )}

        {activeTab === 'brain-dump' && (
          <BrainDumpView
            items={brainDump}
            setItems={setBrainDump}
            onConvertToTask={(newTask) => {
              handleAddTask(newTask);
              handleStartFocus(newTask, newTask.steps[0], newTask.steps[0]?.durationMinutes || 5);
            }}
          />
        )}

        {activeTab === 'focus' && (
          <FocusView
            activeTask={activeFocusTask}
            activeStep={activeFocusStep}
            initialMinutes={focusMinutes}
            onExit={() => setActiveTab('today')}
            onOpenRecovery={() => setRecoveryModalOpen(true)}
            onTaskCompleted={(taskId) => {
              const updated = tasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
              setTasks(updated);
              storage.saveTasks(updated);
            }}
          />
        )}

        {activeTab === 'reset' && <ResetCenterView />}

        {activeTab === 'routines' && (
          <RoutinesView
            routines={routines}
            setRoutines={setRoutines}
          />
        )}

        {activeTab === 'study-work' && (
          <StudyWorkView
            onStartFocus={handleStartFocus}
            onAddTask={handleAddTask}
          />
        )}

        {activeTab === 'insights' && <InsightsView />}
      </main>

      {/* Interactive Modals */}
      <SoundMixerModal
        isOpen={soundModalOpen}
        onClose={() => setSoundModalOpen(false)}
      />

      <OverwhelmModal
        isOpen={overwhelmModalOpen}
        onClose={() => setOverwhelmModalOpen(false)}
        onStartSingleStep={handleStartSingleStep}
      />

      <RecoveryModal
        isOpen={recoveryModalOpen}
        onClose={() => setRecoveryModalOpen(false)}
        onActionSelected={handleRecoveryAction}
      />

      <RunningLateModal
        isOpen={runningLateModalOpen}
        onClose={() => setRunningLateModalOpen(false)}
      />

      <AskAiModal
        isOpen={askAiModalOpen}
        onClose={() => setAskAiModalOpen(false)}
      />

      <QuickCaptureModal
        isOpen={quickCaptureModalOpen}
        onClose={() => setQuickCaptureModalOpen(false)}
        onTaskAdded={handleAddTask}
      />

      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onDataReset={() => {
          setTasks([]);
          setBrainDump([]);
        }}
        onUserChange={(user) => {
          setCurrentUser(user);
          setTasks(storage.getTasks());
          setBrainDump(storage.getBrainDump());
        }}
        onLoadSampleTasks={() => {
          setTasks(storage.getTasks());
        }}
      />

      {/* Subtle PWA Install Banner */}
      <PwaInstallBanner />

    </div>
  );
}
