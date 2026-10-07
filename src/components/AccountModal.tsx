'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Download, Upload, Trash2, CheckCircle2, 
  Lock, X, Sparkles, Layers, RefreshCw
} from 'lucide-react';
import { storage, SAMPLE_DEMO_TASKS } from '@/lib/storage';
import { AuthUser } from '@/types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset?: () => void;
  onUserChange?: (user: AuthUser | null) => void;
  onLoadSampleTasks?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ 
  isOpen, 
  onClose, 
  onDataReset,
  onUserChange,
  onLoadSampleTasks 
}) => {
  const [userName, setUserName] = useState<string>('Guest');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [syncStatus, setSyncStatus] = useState<string>('Stored locally on this device');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'fresh' | 'sample'>('fresh');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const user = storage.getAuthUser();
      if (user && user.name) {
        setUserName(user.name);
        setUserEmail(user.email || '');
        setNameInput(user.name);
        setEmailInput(user.email || '');
      } else {
        const legacyName = localStorage.getItem('adhdly_user_name');
        const legacyEmail = localStorage.getItem('adhdly_user_email');
        if (legacyName && legacyName !== 'Alex (Local Account)') {
          setUserName(legacyName);
          setUserEmail(legacyEmail || '');
          setNameInput(legacyName);
          setEmailInput(legacyEmail || '');
        } else {
          setUserName('Guest');
          setUserEmail('');
          setNameInput('');
          setEmailInput('');
        }
      }
    }
  }, [isOpen]);

  const notify = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  if (!isOpen) return null;

  // Save profile info
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim() || 'Guest';
    const cleanEmail = emailInput.trim();

    setUserName(cleanName);
    setUserEmail(cleanEmail);

    const user: AuthUser = {
      id: 'usr-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    storage.saveAuthUser(user);
    if (onUserChange) onUserChange(user);
    setIsEditing(false);
    notify(`Profile updated for ${cleanName}!`);
  };

  // Option 1: Start 100% Fresh (0 tasks)
  const handleStartFresh = () => {
    setSelectedOption('fresh');
    storage.clearToFreshSlate();
    if (onDataReset) onDataReset();
    notify('Started fresh: 0 tasks in your workspace.');
  };

  // Option 2: Start with 3 Sample Tasks
  const handleStartWithSampleTasks = () => {
    setSelectedOption('sample');
    storage.saveTasks(SAMPLE_DEMO_TASKS);
    if (onLoadSampleTasks) {
      onLoadSampleTasks();
    } else if (onDataReset) {
      onDataReset();
    }
    notify('Loaded 3 sample tasks into your workspace.');
  };

  // Export Data
  const handleExportData = () => {
    if (typeof window === 'undefined') return;
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      user: { name: userName, email: userEmail },
      tasks: storage.getTasks(),
      brainDump: storage.getBrainDump(),
      routines: storage.getRoutines(),
      preferences: storage.getPreferences(),
      focusSessions: storage.getFocusSessions(),
      recoveryLogs: storage.getRecoveryLogs(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adhdly-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Backup downloaded successfully!');
  };

  // Import Data
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.tasks) storage.saveTasks(data.tasks);
        if (data.brainDump) storage.saveBrainDump(data.brainDump);
        if (data.routines) storage.saveRoutines(data.routines);
        if (data.preferences) storage.savePreferences(data.preferences);
        if (data.user) {
          storage.saveAuthUser(data.user);
          setUserName(data.user.name || 'Guest');
          setUserEmail(data.user.email || '');
          if (onUserChange) onUserChange(data.user);
        }
        notify('Data restored successfully! Refreshing view...');
        if (onDataReset) onDataReset();
        setTimeout(() => {
          window.location.reload();
        }, 600);
      } catch {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Clear all local data & reset
  const handleClearAllData = () => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
    setShowConfirmClear(false);
    if (onDataReset) onDataReset();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-slate-100">
      <div className="relative w-full max-w-lg bg-[#0e1522] border border-indigo-900/40 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100">Account & Data Vault</h2>
            <p className="text-xs text-slate-400">Offline-first • Zero-tracker local backup</p>
          </div>
        </div>

        {/* Notification Toast */}
        {notificationMsg && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs font-semibold text-indigo-200 flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 mb-5">
          {!isEditing ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">
                  {userName[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    {userName}
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {userEmail || 'Local private profile'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Your Name / Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. Alex or Maya"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Email / Handle (Optional)</label>
                <input
                  type="email"
                  placeholder="name@example.com (optional)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        </div>

        {/* 2 Workspace Options: 0 Tasks (Fresh) vs 3 Tasks (Sample) */}
        <div className="space-y-2.5 mb-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Workspace Mode (Choose One)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option 1: Start 100% Fresh (0 Tasks) */}
            <button
              type="button"
              onClick={handleStartFresh}
              className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between gap-3 group ${
                selectedOption === 'fresh'
                  ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Option 1: Clean Slate</span>
                  </div>
                  {selectedOption === 'fresh' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="text-sm font-black text-white">0 Tasks (Start Fresh)</div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Completely empty workspace. Zero dummy tasks or clutter.
                </p>
              </div>

              <div className="w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold text-center transition">
                Start with 0 Tasks
              </div>
            </button>

            {/* Option 2: 3 Sample Tasks */}
            <button
              type="button"
              onClick={handleStartWithSampleTasks}
              className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between gap-3 group ${
                selectedOption === 'sample'
                  ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Option 2: Sample Tasks</span>
                  </div>
                  {selectedOption === 'sample' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="text-sm font-black text-white">3 Tasks (Examples)</div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Loads 3 pre-decomposed tasks to preview the workflow.
                </p>
              </div>

              <div className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold text-center transition">
                Start with 3 Tasks
              </div>
            </button>
          </div>
        </div>

        {/* Data Portability: Export / Import */}
        <div className="space-y-3 mb-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Data Portability & Backup
          </span>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportData}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition flex flex-col items-center justify-center gap-2 text-center group"
            >
              <Download className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-slate-200">Export Backup</div>
                <div className="text-[10px] text-slate-400">Download JSON file</div>
              </div>
            </button>

            <label className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition flex flex-col items-center justify-center gap-2 text-center cursor-pointer group">
              <Upload className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-slate-200">Restore Backup</div>
                <div className="text-[10px] text-slate-400">Upload JSON file</div>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1.5 mb-5 leading-relaxed">
          <div className="font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Privacy & Local-First Security
          </div>
          <p className="text-[11px] text-slate-300">
            ADHDLY is built with a local-first philosophy. Your tasks and settings reside directly on your machine. You can export or clear your vault at any time.
          </p>
        </div>

        {/* Clear Data Danger Zone */}
        <div className="pt-3 border-t border-slate-800">
          {!showConfirmClear ? (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Local Data & Reset
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2 text-center">
              <p className="text-xs text-rose-200 font-medium">Are you sure? This erases all tasks and routines from your browser.</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleClearAllData}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Yes, Erase Everything
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
