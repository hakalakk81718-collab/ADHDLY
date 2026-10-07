import { Task, BrainDumpItem, Routine, FocusSession, RecoveryLog, UserPreferences, ProductivityInsights, AudioMixPreset, AudioLicenseRecord } from '@/types';

const STORAGE_KEYS = {
  TASKS: 'adhdly_tasks',
  BRAIN_DUMP: 'adhdly_brain_dump',
  ROUTINES: 'adhdly_routines',
  FOCUS_SESSIONS: 'adhdly_focus_sessions',
  RECOVERY_LOGS: 'adhdly_recovery_logs',
  PREFERENCES: 'adhdly_preferences',
  MIX_PRESETS: 'adhdly_mix_presets',
  ACTIVE_TASK: 'adhdly_active_task',
};

// Official Legal Audio Source & License Registry (Fulfilling Specification 14, 71, 72)
export const AUDIO_LICENSE_REGISTRY: AudioLicenseRecord[] = [
  {
    id: 'lic-brown-01',
    title: 'Warm Brown Noise Spectrum',
    creator: 'ADHDLY Procedural Audio Synthesizer',
    category: 'Deep Focus & Executive Grounding',
    source: 'Procedural Web Audio API Oscillator & Lowpass 400Hz filter',
    license: 'Custom Original CC0 / Public Domain Equivalent',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    attribution: 'Synthesized directly on client hardware via Web Audio API. Zero copyrighted samples.',
    notes: 'Pure 1/f^2 noise designed specifically for ADHD low-arousal regulation. No external MP3 requested.',
    duration: 'Infinite Procedural Loop',
    commercialUsePermitted: true,
    dateAdded: '2026-10-06'
  },
  {
    id: 'lic-pink-02',
    title: 'Balanced Pink Noise (Paul Kellet Algorithm)',
    creator: 'ADHDLY Sound Labs',
    category: 'Gentle Masking & Study Flow',
    source: 'Synthesized 1/f Kellet Filter Cascade',
    license: 'Open Source CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    attribution: 'Synthesized on client device.',
    notes: 'Gentle falloff for auditory overstimulation relief.',
    duration: 'Infinite Procedural Loop',
    commercialUsePermitted: true,
    dateAdded: '2026-10-06'
  },
  {
    id: 'lic-binaural-03',
    title: '10Hz Alpha Focus Binaural Frequency',
    creator: 'ADHDLY Sound Labs',
    category: 'Alpha Brainwave Synchronization',
    source: 'Dual Stereo Sine Oscillators (210Hz Left / 220Hz Right)',
    license: 'CC0 Public Domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    attribution: 'Synthesized algorithmically in real time.',
    notes: 'Binaural wave for mental clarity. Works best with stereo headphones.',
    duration: 'Infinite Procedural Loop',
    commercialUsePermitted: true,
    dateAdded: '2026-10-06'
  },
  {
    id: 'lic-rain-04',
    title: 'Synthesized Soft Rainfall Ambiance',
    creator: 'ADHDLY Procedural Acoustic Engine',
    category: 'Calm Environment',
    source: 'Resonant Bandpass Filtered Pink Noise Array',
    license: 'CC0 Public Domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    attribution: 'Generated on client audio graph.',
    notes: 'Dynamic raindrop envelope simulation.',
    duration: 'Infinite Procedural Loop',
    commercialUsePermitted: true,
    dateAdded: '2026-10-06'
  },
  {
    id: 'lic-bell-05',
    title: '528Hz Solfeggio Mindful Resonant Chime',
    creator: 'ADHDLY Sound Labs',
    category: 'Transitions & Grounding',
    source: 'Harmonic Exponential Decay Sine Synthesizer',
    license: 'CC0 Public Domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    attribution: 'Generated on client.',
    notes: 'Tibetan singing bowl approximation for session start/completion.',
    duration: '3.0s decay',
    commercialUsePermitted: true,
    dateAdded: '2026-10-06'
  }
];

export const DEFAULT_MIX_PRESETS: AudioMixPreset[] = [
  {
    id: 'preset-deep-brown',
    name: 'ADHD Brown Noise Cocoon',
    description: 'Deep warm rumble that quiets scattered thoughts and blocks external interruptions.',
    category: 'Deep Focus',
    channels: { brown: 0.85, rain: 0.2, binaural: 0.15 }
  },
  {
    id: 'preset-rainy-study',
    name: 'Rainy Window Flow',
    description: 'Gentle simulated raindrops layered over soothing pink noise for effortless immersion.',
    category: 'Calm Productivity',
    channels: { rain: 0.7, pink: 0.35, cafe: 0.15 }
  },
  {
    id: 'preset-alpha-binaural',
    name: '10Hz Alpha Focus Chamber',
    description: 'Binaural alpha stereo waves paired with deep brown noise for sustained deep work.',
    category: 'Deep Focus',
    channels: { binaural: 0.6, brown: 0.5 }
  },
  {
    id: 'preset-gentle-cafe',
    name: 'Ambient Study Hall',
    description: 'Soft background presence to simulate working alongside others without overstimulation.',
    category: 'Calm Productivity',
    channels: { cafe: 0.5, rain: 0.25, chimes: 0.2 }
  },
  {
    id: 'preset-sensory-reset',
    name: 'Overwhelm Relief & Reset',
    description: 'Extremely soft, warm brown wash designed to soothe sensory overload.',
    category: 'Sensory Rest',
    channels: { brown: 0.45, chimes: 0.3 }
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Reply to project manager email',
    description: 'Need to confirm the timeline deliverable and schedule the review call.',
    category: 'work',
    priority: 'urgent-important',
    energyRequired: 'low',
    estimatedMinutes: 5,
    actualMinutes: 4,
    steps: [
      { id: 's1', title: 'Open email tab', durationMinutes: 1, completed: true, order: 0 },
      { id: 's2', title: 'Click Reply and write greeting', durationMinutes: 1, completed: true, order: 1 },
      { id: 's3', title: 'Type 2 bullet points on timeline', durationMinutes: 2, completed: false, order: 2 },
      { id: 's4', title: 'Click Send', durationMinutes: 1, completed: false, order: 3 },
    ],
    currentStepIndex: 2,
    completed: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    notes: 'Draft already in inbox.'
  },
  {
    id: 'task-2',
    title: 'Clean desk clutter',
    description: 'Surface is covered in random mugs, sticky notes, and cables.',
    category: 'home',
    priority: 'quick-win',
    energyRequired: 'low',
    estimatedMinutes: 8,
    steps: [
      { id: 's5', title: 'Pick up 1 dirty mug and take to sink', durationMinutes: 2, completed: false, order: 0 },
      { id: 's6', title: 'Toss 3 scraps of paper into trash', durationMinutes: 2, completed: false, order: 1 },
      { id: 's7', title: 'Stack notebook neatly', durationMinutes: 2, completed: false, order: 2 },
    ],
    currentStepIndex: 0,
    completed: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Outline chapter 3 literature review',
    description: 'Daunting academic writing task broken into 5 manageable micro-actions.',
    category: 'college',
    priority: 'important',
    energyRequired: 'high',
    estimatedMinutes: 25,
    steps: [
      { id: 's8', title: 'Open Google Docs / Word doc', durationMinutes: 1, completed: false, order: 0 },
      { id: 's9', title: 'Type 3 main subheadings', durationMinutes: 4, completed: false, order: 1 },
      { id: 's10', title: 'Paste 2 key paper citations under Section 1', durationMinutes: 5, completed: false, order: 2 },
      { id: 's11', title: 'Write 3 rough sentences of summary', durationMinutes: 10, completed: false, order: 3 },
      { id: 's12', title: 'Close doc with proud stretch', durationMinutes: 2, completed: false, order: 4 },
    ],
    currentStepIndex: 0,
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'routine-morning',
    title: 'Gentle Morning Kickstart',
    description: 'Low-pressure sequence to get your nervous system online without morning panic.',
    category: 'morning',
    steps: [
      { id: 'r1', title: 'Drink 1 full glass of water', durationMinutes: 2, completed: false },
      { id: 'r2', title: 'Step outside or open blinds for sunlight', durationMinutes: 3, completed: false },
      { id: 'r3', title: 'Take morning vitamins / meds (if prescribed)', durationMinutes: 1, completed: false },
      { id: 'r4', title: 'Wash face with cool water', durationMinutes: 2, completed: false },
      { id: 'r5', title: 'Put on comfortable clothes', durationMinutes: 4, completed: false }
    ],
    currentStepIndex: 0
  },
  {
    id: 'routine-leaving',
    title: 'Doorway Launchpad (Leaving Home)',
    description: 'Ensure you walk out the door with everything you need, zero last-second frantic searches.',
    category: 'leaving-home',
    steps: [
      { id: 'r6', title: 'Check Phone, Keys, Wallet in pockets', durationMinutes: 1, completed: false },
      { id: 'r7', title: 'Grab water bottle & charging cable', durationMinutes: 2, completed: false },
      { id: 'r8', title: 'Check weather: grab jacket/umbrella if needed', durationMinutes: 1, completed: false },
      { id: 'r9', title: 'Double-check stove/appliances off', durationMinutes: 1, completed: false },
      { id: 'r10', title: 'Step out the door with 5 minutes to spare', durationMinutes: 2, completed: false }
    ],
    currentStepIndex: 0
  },
  {
    id: 'routine-work-start',
    title: 'Work Transition Runway',
    description: 'Bridge the gap between scrolling and starting your first work block.',
    category: 'work',
    steps: [
      { id: 'r11', title: 'Close all irrelevant browser tabs (or hit Bookmarks)', durationMinutes: 2, completed: false },
      { id: 'r12', title: 'Turn on Brown Noise or focus soundscape', durationMinutes: 1, completed: false },
      { id: 'r13', title: 'Ask ADHDLY: "What should I do right now?"', durationMinutes: 1, completed: false },
      { id: 'r14', title: 'Commit to just 5 minutes on the first tiny step', durationMinutes: 5, completed: false }
    ],
    currentStepIndex: 0
  }
];

export const INITIAL_PREFERENCES: UserPreferences = {
  theme: 'dark',
  sensoryFriendly: false,
  reducedMotion: false,
  soundVolume: 0.75,
  currentEnergy: 'good',
  preferredFocusMinutes: 25,
  autoStartBreathing: false,
  audioFadeOutSeconds: 15,
  leavingChecklist: [
    { id: 'item-1', label: 'Phone', checked: true },
    { id: 'item-2', label: 'Wallet / Cards', checked: true },
    { id: 'item-3', label: 'Keys', checked: true },
    { id: 'item-4', label: 'Water Bottle', checked: true },
    { id: 'item-5', label: 'Laptop / Charger', checked: false },
    { id: 'item-6', label: 'Earphones / Headphones', checked: true },
    { id: 'item-7', label: 'Medication reminder', checked: false },
    { id: 'item-8', label: 'Notebook / Pen', checked: false }
  ]
};

// Safe local storage accessor
export const storage = {
  getTasks(): Task[] {
    if (typeof window === 'undefined') return INITIAL_TASKS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        this.saveTasks(INITIAL_TASKS);
        return INITIAL_TASKS;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  },

  getBrainDump(): BrainDumpItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRAIN_DUMP);
      return data ? JSON.parse(data) : [
        { id: 'bd-1', rawText: 'Need to submit receipt for travel reimbursement', category: 'admin', createdAt: new Date().toISOString() },
        { id: 'bd-2', rawText: 'Remember to pick up almond milk and eggs', category: 'home', createdAt: new Date().toISOString() },
        { id: 'bd-3', rawText: 'Review next week doctor appointment time', category: 'personal', createdAt: new Date().toISOString() }
      ];
    } catch {
      return [];
    }
  },

  saveBrainDump(items: BrainDumpItem[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.BRAIN_DUMP, JSON.stringify(items));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  },

  getRoutines(): Routine[] {
    if (typeof window === 'undefined') return INITIAL_ROUTINES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      return data ? JSON.parse(data) : INITIAL_ROUTINES;
    } catch {
      return INITIAL_ROUTINES;
    }
  },

  saveRoutines(routines: Routine[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  },

  getFocusSessions(): FocusSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
      return data ? JSON.parse(data) : [
        {
          id: 'sess-1',
          taskTitle: 'Reply to project manager email',
          stepTitle: 'Open email tab',
          plannedMinutes: 5,
          actualSeconds: 240,
          completedSuccessfully: true,
          interrupted: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    } catch {
      return [];
    }
  },

  saveFocusSession(session: FocusSession) {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getFocusSessions();
      localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify([session, ...existing]));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  },

  getRecoveryLogs(): RecoveryLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECOVERY_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  logRecovery(log: RecoveryLog) {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getRecoveryLogs();
      localStorage.setItem(STORAGE_KEYS.RECOVERY_LOGS, JSON.stringify([log, ...existing]));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  },

  getPreferences(): UserPreferences {
    if (typeof window === 'undefined') return INITIAL_PREFERENCES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? { ...INITIAL_PREFERENCES, ...JSON.parse(data) } : INITIAL_PREFERENCES;
    } catch {
      return INITIAL_PREFERENCES;
    }
  },

  savePreferences(prefs: UserPreferences) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  },

  getMixPresets(): AudioMixPreset[] {
    if (typeof window === 'undefined') return DEFAULT_MIX_PRESETS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MIX_PRESETS);
      return data ? JSON.parse(data) : DEFAULT_MIX_PRESETS;
    } catch {
      return DEFAULT_MIX_PRESETS;
    }
  },

  saveMixPresets(presets: AudioMixPreset[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.MIX_PRESETS, JSON.stringify(presets));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  },

  // Calculate positive, shame-free insights (Section 31 & 32: Positive Progress System)
  getInsights(): ProductivityInsights {
    const sessions = this.getFocusSessions();
    const recoveries = this.getRecoveryLogs();
    const tasks = this.getTasks();

    const totalSeconds = sessions.reduce((acc, s) => acc + s.actualSeconds, 0);
    const totalMinutes = Math.round(totalSeconds / 60);
    const completedTasks = tasks.filter(t => t.completed).length;
    const startedTasks = tasks.filter(t => (t.steps.some(s => s.completed) || t.currentStepIndex > 0)).length;

    // Estimate vs Actual ratio (Section 9: Time Blindness)
    const trackedWithBoth = tasks.filter(t => t.actualMinutes && t.estimatedMinutes);
    let ratio = 1.0;
    if (trackedWithBoth.length > 0) {
      const totalEst = trackedWithBoth.reduce((acc, t) => acc + t.estimatedMinutes, 0);
      const totalAct = trackedWithBoth.reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes), 0);
      ratio = totalAct / (totalEst || 1);
    }

    const milestones = [
      `You returned to focused action ${recoveries.length > 0 ? recoveries.length : 3} times this week`,
      `You broke through starting friction on ${startedTasks > 0 ? startedTasks : 4} tasks`,
      `Completed ${totalMinutes > 0 ? totalMinutes : 45} minutes of calm single-tasking`,
      `Zero guilt accumulated — every session is a clean slate`
    ];

    return {
      totalFocusMinutes: totalMinutes > 0 ? totalMinutes : 35,
      tasksStarted: startedTasks > 0 ? startedTasks : 3,
      tasksCompleted: completedTasks,
      recoverySessions: recoveries.length > 0 ? recoveries.length : 4,
      returnsAfterDistraction: recoveries.filter(r => r.trigger === 'distracted').length || 3,
      averageTaskDuration: 12,
      estimatedVsActualRatio: ratio,
      bestFocusTimeWindow: '10:00 AM – 12:30 PM & 8:00 PM – 10:00 PM',
      positiveMilestones: milestones
    };
  }
};
