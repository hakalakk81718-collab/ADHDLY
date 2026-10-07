export type EnergyLevel = 'high' | 'good' | 'low' | 'tired' | 'overwhelmed' | 'hyperfocused';

export type TaskPriority = 'urgent-important' | 'important' | 'quick-win' | 'low';

export type TaskCategory = 'work' | 'college' | 'personal' | 'home' | 'admin' | 'health';

export interface MicroStep {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  energyRequired: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
  actualMinutes?: number;
  steps: MicroStep[];
  currentStepIndex: number;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  lastProgressAt?: string;
  delayedCount?: number;
}

export interface BrainDumpItem {
  id: string;
  rawText: string;
  category: 'urgent' | 'important' | 'work' | 'college' | 'personal' | 'home' | 'later' | 'optional' | 'admin';
  convertedToTaskId?: string;
  createdAt: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  durationMinutes: number;
  icon?: string;
  completed: boolean;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  category: 'morning' | 'study' | 'work' | 'night' | 'leaving-home' | 'custom';
  steps: RoutineStep[];
  currentStepIndex: number;
  lastCompletedAt?: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle: string;
  stepTitle?: string;
  plannedMinutes: number;
  actualSeconds: number;
  completedSuccessfully: boolean;
  interrupted: boolean;
  energyBefore?: EnergyLevel;
  energyAfter?: EnergyLevel;
  notes?: string;
  createdAt: string;
}

export interface RecoveryLog {
  id: string;
  timestamp: string;
  trigger: 'distracted' | 'overwhelmed' | 'fatigued' | 'stuck';
  actionTaken: '2min-reset' | '5min-reset' | 'change-task' | 'brain-dump' | 'water-stretch';
  success: boolean;
}

export interface AudioChannelState {
  id: string;
  name: string;
  type: 'brown' | 'pink' | 'white' | 'binaural' | 'rain' | 'cafe' | 'chimes';
  volume: number; // 0 to 1
  enabled: boolean;
  description: string;
}

export interface AudioMixPreset {
  id: string;
  name: string;
  description: string;
  category: 'Deep Focus' | 'Calm Productivity' | 'Late Night' | 'Reset' | 'Sensory Rest';
  channels: { [type: string]: number };
}

export interface AudioLicenseRecord {
  id: string;
  title: string;
  creator: string;
  category: string;
  source: string;
  license: string;
  licenseUrl: string;
  attribution: string;
  notes: string;
  duration: string;
  commercialUsePermitted: boolean;
  dateAdded: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  sensoryFriendly: boolean;
  reducedMotion: boolean;
  soundVolume: number;
  currentEnergy: EnergyLevel;
  preferredFocusMinutes: number;
  autoStartBreathing: boolean;
  audioFadeOutSeconds: number;
  leavingChecklist: { id: string; label: string; checked: boolean }[];
}

export interface ProductivityInsights {
  totalFocusMinutes: number;
  tasksStarted: number;
  tasksCompleted: number;
  recoverySessions: number;
  returnsAfterDistraction: number;
  averageTaskDuration: number;
  estimatedVsActualRatio: number; // >1 means underestimating, <1 means overestimating
  bestFocusTimeWindow: string;
  positiveMilestones: string[];
}
