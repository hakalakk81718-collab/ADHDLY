'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Download, Upload, Trash2, CheckCircle2, 
  Lock, Key, X, LogIn, UserPlus, LogOut, Sparkles, RefreshCw
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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'profile'>('profile');
  
  // Form inputs
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [syncStatus, setSyncStatus] = useState<string>('Stored locally on this device');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      storage.cleanLegacyDummyData();
      const user = storage.getAuthUser();
      setCurrentUser(user);
      if (user) {
        setActiveTab('profile');
        setNameInput(user.name);
        setEmailInput(user.email || '');
      } else {
        setActiveTab('signin');
        setNameInput('');
        setEmailInput('');
      }
    }
  }, [isOpen]);

  const notify = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  if (!isOpen) return null;

  // Handle Login / Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    const cleanName = nameInput.trim() || (cleanEmail ? cleanEmail.split('@')[0] : 'Member');

    if (!cleanName && !cleanEmail) {
      notify('Please enter your name or email to sign in.');
      return;
    }

    const user: AuthUser = {
      id: 'usr-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    storage.saveAuthUser(user);
    setCurrentUser(user);

    // Clean start for workspace
    storage.clearToFreshSlate();
    if (onDataReset) onDataReset();

    if (onUserChange) onUserChange(user);
    notify(`Welcome, ${cleanName}!`);
    setActiveTab('profile');
  };

  // Handle Sign Up (New Account)
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim() || 'New Member';
    const cleanEmail = emailInput.trim();

    const user: AuthUser = {
      id: 'usr-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    storage.saveAuthUser(user);
    // New accounts ALWAYS start fresh with zero dummy data
    storage.clearToFreshSlate();
    setCurrentUser(user);

    if (onDataReset) onDataReset();
    if (onUserChange) onUserChange(user);
    notify(`Account created for ${cleanName}! Fresh workspace ready.`);
    setActiveTab('profile');
  };

  // Handle Sign Out
  const handleSignOut = () => {
    storage.saveAuthUser(null);
    setCurrentUser(null);
    setNameInput('');
    setEmailInput('');
    if (onUserChange) onUserChange(null);
    setActiveTab('signin');
    notify('Signed out. Your offline local vault remains safe on this device.');
  };

  // Handle Profile Update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: AuthUser = {
      ...currentUser,
      name: nameInput.trim() || currentUser.name,
      email: emailInput.trim() || currentUser.email
    };
    storage.saveAuthUser(updated);
    setCurrentUser(updated);
    if (onUserChange) onUserChange(updated);
    notify('Profile updated successfully.');
  };

  // Handle Fresh Start (Reset Workspace to Empty)
  const handleResetToFreshSlate = () => {
    storage.clearToFreshSlate();
    setShowConfirmClear(false);
    if (onDataReset) onDataReset();
    notify('Workspace reset: all tasks and notes cleared to a fresh slate.');
  };

  // Handle Optional Sample Tasks Load
  const handleLoadSamples = () => {
    storage.saveTasks(SAMPLE_DEMO_TASKS);
    if (onLoadSampleTasks) onLoadSampleTasks();
    notify('Loaded 3 sample tasks to preview ADHD micro-step workflows.');
  };

  // Export Data
  const handleExportData = () => {
    if (typeof window === 'undefined') return;
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      user: currentUser || { name: 'Guest', email: '' },
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
    a.download = `adhdly-vault-${(currentUser?.name || 'fresh').toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSyncStatus('Backup downloaded successfully!');
    notify('Vault backup JSON downloaded.');
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
          setCurrentUser(data.user);
          if (onUserChange) onUserChange(data.user);
        }
        setSyncStatus('Data restored successfully!');
        if (onDataReset) onDataReset();
        notify('Backup restored successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 600);
      } catch {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
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
            <h2 className="text-xl font-bold tracking-tight text-slate-100">
              {currentUser ? 'Your ADHDLY Account' : 'Sign In & Clean Slate'}
            </h2>
            <p className="text-xs text-slate-400">Offline-first • Zero tracking • Clean slate guarantee</p>
          </div>
        </div>

        {/* Notification Toast */}
        {notificationMsg && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs font-semibold text-indigo-200 flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Mode Selector Tabs (Sign In / Sign Up / Profile) */}
        {!currentUser ? (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-5">
            <button
              onClick={() => setActiveTab('signin')}
              className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'signin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        ) : null}

        {/* 1. SIGN IN FORM */}
        {!currentUser && activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 mb-5">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Your Name or Nickname
              </label>
              <input
                type="text"
                placeholder="e.g. Alex or Jordan"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition hover:scale-[1.01] active:scale-[0.99]"
            >
              <LogIn className="w-4 h-4" />
              <span>SIGN IN</span>
            </button>
          </form>
        )}

        {/* 2. SIGN UP FORM */}
        {!currentUser && activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4 mb-5">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Your Full Name or Preferred Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="maya@example.com (optional)"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition hover:scale-[1.01] active:scale-[0.99]"
            >
              <UserPlus className="w-4 h-4" />
              <span>CREATE ACCOUNT</span>
            </button>
          </form>
        )}

        {/* 3. ACTIVE PROFILE VIEW */}
        {currentUser && (
          <div className="space-y-4 mb-5">
            {/* User Profile Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-600/30">
                    {currentUser.name[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>{currentUser.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Signed In
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{currentUser.email || 'Local private profile'}</div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Sign out of current account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleUpdateProfile} className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Update Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Update Email</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2 pt-1 flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{syncStatus}</span>
              </div>
            </div>

            {/* Quick Actions: Clean Slate vs Sample Tasks */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowConfirmClear(true)}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition group"
              >
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                  <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Start Fresh</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Clear all tasks and brain dumps to an empty slate
                </p>
              </button>

              <button
                onClick={handleLoadSamples}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-left transition group"
              >
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs mb-1">
                  <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Sample Tasks</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Optional: load 3 sample ADHD tasks to test
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Data Portability: Export / Import */}
        <div className="space-y-3 mb-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Vault Backup & Data Portability
          </span>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportData}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition flex flex-col items-center justify-center gap-2 text-center group"
            >
              <Download className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-slate-200">Export Vault</div>
                <div className="text-[10px] text-slate-400">Download clean JSON</div>
              </div>
            </button>

            <label className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition flex flex-col items-center justify-center gap-2 text-center cursor-pointer group">
              <Upload className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
              <div>
                <div className="text-xs font-bold text-slate-200">Restore Vault</div>
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

        {/* Privacy & Zero-Dummy Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1.5 mb-5 leading-relaxed">
          <div className="font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Privacy & Local-First Security
          </div>
          <p className="text-[11px] text-slate-300">
            ADHDLY operates 100% on your device with no remote tracker telemetry. Every sign-in or clean start ensures zero dummy clutter so your focus stays uninterrupted.
          </p>
        </div>

        {/* Confirm Reset / Erase Modal Dropdown */}
        {showConfirmClear && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 space-y-3 text-center mb-2 animate-fade-in">
            <p className="text-xs text-rose-200 font-bold">
              Are you sure? This will clear all tasks and brain dumps to an empty clean slate.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleResetToFreshSlate}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition"
              >
                Yes, Start Completely Fresh
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
