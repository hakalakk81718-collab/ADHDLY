'use client';

import React, { useState } from 'react';
import { 
  Compass, CheckSquare, Brain, Clock, Wind, Sliders, 
  BarChart2, ShieldAlert, Sparkles, Plus, BookOpen, Briefcase, 
  Settings, Bot, Timer, Layers, PanelLeftClose, PanelLeftOpen,
  Maximize2, Minimize2, User, Menu, X, Waves, MessageSquarePlus
} from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { RotatingPhilosophy } from '@/components/RotatingPhilosophy';
import { AdhdlyLogo } from '@/components/AdhdlyLogo';

import { AuthUser } from '@/types';

export type ActiveTab = 
  | 'today' 
  | 'what-now' 
  | 'tasks' 
  | 'brain-dump' 
  | 'focus' 
  | 'reset' 
  | 'audio' 
  | 'routines' 
  | 'study-work' 
  | 'insights' 
  | 'suggestions'
  | 'landing';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenOverwhelm: () => void;
  onOpenQuickCapture: () => void;
  onOpenSoundMixer: () => void;
  onOpenAskAi: () => void;
  onOpenRunningLate: () => void;
  onOpenAccount: () => void;
  audioPlaying: boolean;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentUser?: AuthUser | null;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenOverwhelm,
  onOpenQuickCapture,
  onOpenSoundMixer,
  onOpenAskAi,
  onOpenRunningLate,
  onOpenAccount,
  audioPlaying,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentUser,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Consolidated Sidebar Menu Items (Free SEO Tools completely removed)
  const navSections = [
    {
      title: 'Action & Execution',
      items: [
        { id: 'today' as ActiveTab, label: 'Today Dashboard', icon: <Compass className="w-4 h-4" /> },
        { id: 'what-now' as ActiveTab, label: 'What Should I Do?', icon: <Sparkles className="w-4 h-4 text-amber-400" />, badge: 'Core' },
        { id: 'tasks' as ActiveTab, label: 'Tasks & Steps', icon: <CheckSquare className="w-4 h-4" /> },
        { id: 'brain-dump' as ActiveTab, label: 'Brain Dump', icon: <Brain className="w-4 h-4" /> },
        { id: 'focus' as ActiveTab, label: 'Focus Mode', icon: <Clock className="w-4 h-4 text-emerald-400" /> },
      ]
    },
    {
      title: 'Environment & Support',
      items: [
        { id: 'reset' as ActiveTab, label: 'Calm / Reset Center', icon: <Wind className="w-4 h-4 text-cyan-400" /> },
        { id: 'audio' as ActiveTab, label: 'Focus Sound Center', icon: <Sliders className="w-4 h-4 text-indigo-400" /> },
        { id: 'routines' as ActiveTab, label: 'Routines & Exit', icon: <Layers className="w-4 h-4" /> },
        { id: 'study-work' as ActiveTab, label: 'Study & Work Modes', icon: <BookOpen className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Self-Knowledge & Community',
      items: [
        { id: 'insights' as ActiveTab, label: 'Positive Insights', icon: <BarChart2 className="w-4 h-4" /> },
        { id: 'suggestions' as ActiveTab, label: 'Suggestion Box', icon: <MessageSquarePlus className="w-4 h-4 text-amber-400" />, badge: 'Feedback' },
        { id: 'landing' as ActiveTab, label: 'Product Overview', icon: <Compass className="w-4 h-4 text-indigo-400" /> },
      ]
    }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'audio') {
      onOpenSoundMixer();
    } else {
      setActiveTab(tab);
    }
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 h-16 border-b border-white/[0.06] bg-[#070b14]/85 backdrop-blur-2xl px-3 sm:px-6 flex items-center justify-between transition-all">
        
        {/* Left: Mobile hamburger + Brand + Desktop Collapse Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 lg:hidden"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Minimize / Maximize toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 hidden lg:flex transition"
            title={sidebarCollapsed ? "Expand Sidebar (Maximize)" : "Collapse Sidebar (Minimize)"}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5 text-indigo-400" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>

          {/* Brand */}
          <button 
            onClick={() => handleSelectTab('today')}
            className="flex items-center gap-2.5 text-left group transition hover:opacity-95"
          >
            <AdhdlyLogo className="w-8 h-8 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 text-lg flex items-center gap-1.5">
                ADHDLY
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block">External Executive Function</span>
            </div>
          </button>
        </div>

        {/* Right: Quick Action Triggers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Emergency Overwhelm button */}
          <button
            onClick={onOpenOverwhelm}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 glow-rose text-xs font-bold transition hover:scale-105 active:scale-95"
            title="Emergency low-stimulus flow"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">I&apos;M OVERWHELMED</span>
            <span className="md:hidden">Reset</span>
          </button>

          {/* Running Late */}
          <button
            onClick={onOpenRunningLate}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 glow-amber text-xs font-bold transition hover:scale-105 active:scale-95 hidden sm:flex"
            title="Running late exit plan"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Running Late?</span>
          </button>

          {/* 1-Tap Instant Audio Toggle */}
          <button
            onClick={() => {
              if (!soundEngine) return;
              if (audioPlaying) {
                soundEngine.stopAll();
              } else {
                soundEngine.startChannel('brown', 0.85);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold transition hover:scale-105 active:scale-95 ${
              audioPlaying
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/40'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-indigo-500/50'
            }`}
            title={audioPlaying ? "Stop Audio" : "Instant 1-Tap Brown Noise"}
          >
            <Waves className={`w-3.5 h-3.5 ${audioPlaying ? 'text-emerald-400 animate-pulse' : 'text-indigo-400'}`} />
            <span>{audioPlaying ? 'Playing' : '🎧 Noise'}</span>
          </button>

          {/* Noise & Audio Mixer */}
          <button
            onClick={onOpenSoundMixer}
            className="p-2 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Open Audio Deck & Mixer"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Ask AI */}
          <button
            onClick={onOpenAskAi}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-indigo-400 transition"
            title="Ask ADHDLY AI"
          >
            <Bot className="w-4 h-4" />
          </button>

          {/* Screen Maximize / Minimize (Fullscreen) */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition hidden sm:flex"
            title={isFullscreen ? "Exit Fullscreen" : "Maximize Screen (Distraction-Free)"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* User Account / Data Vault */}
          <button
            onClick={onOpenAccount}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition hover:scale-105 active:scale-95 ${
              currentUser
                ? 'bg-slate-900/90 border-indigo-500/40 text-slate-100 shadow-sm'
                : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-300'
            }`}
            title={currentUser ? `Signed in as ${currentUser.name}` : "Sign In & Fresh Vault"}
          >
            {currentUser ? (
              <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                {currentUser.name[0]?.toUpperCase() || 'U'}
              </div>
            ) : (
              <User className="w-4 h-4 text-emerald-400" />
            )}
            <span className="hidden md:inline max-w-[80px] truncate">
              {currentUser ? currentUser.name : 'Sign In'}
            </span>
          </button>

          {/* Quick Capture */}
          <button
            onClick={onOpenQuickCapture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-extrabold transition shadow-lg shadow-indigo-600/35 ring-1 ring-white/20 hover:scale-105 active:scale-95"
            title="Quick capture a thought"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Capture</span>
          </button>
        </div>
      </header>

      {/* Desktop / Tablet Sidebar (Collapsible: full width or icon rail) */}
      <aside 
        className={`fixed left-0 top-16 bottom-0 z-20 border-r border-white/[0.06] bg-[#070b14]/90 backdrop-blur-2xl p-3 hidden lg:flex flex-col justify-between overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        <div className="space-y-4">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'} rounded-xl text-xs font-medium transition text-left ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700/80 text-white font-bold shadow-lg shadow-indigo-600/25 border-l-2 border-indigo-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      activeTab === item.id ? 'bg-white/20 text-white' : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Section: Rotating Philosophy every 10s & Account trigger */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          {/* Rotating Philosophy */}
          <RotatingPhilosophy collapsed={sidebarCollapsed} />

          {/* Account profile pill */}
          <button
            onClick={onOpenAccount}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'} rounded-xl bg-slate-900/80 hover:bg-slate-800 border ${
              currentUser ? 'border-indigo-500/40' : 'border-slate-800'
            } text-xs text-slate-300 transition`}
            title={currentUser ? `Account: ${currentUser.name}` : "Sign In & Fresh Vault"}
          >
            {currentUser ? (
              <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px] shrink-0">
                {currentUser.name[0]?.toUpperCase() || 'U'}
              </div>
            ) : (
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {!sidebarCollapsed && (
              <div className="text-left truncate">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {currentUser ? currentUser.name : 'Sign In / Account'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {currentUser ? 'Signed In • Clean Slate' : 'Offline & Fresh Slate'}
                </div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Accessible when user taps hamburger) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
          />
          <div className="relative w-72 max-w-[80vw] bg-[#090d15] border-r border-slate-800 p-4 flex flex-col justify-between h-full z-10 shadow-2xl animate-fade-in">
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <AdhdlyLogo className="w-7 h-7" />
                  <span className="font-bold text-slate-100 text-base">ADHDLY</span>
                </div>
                <button 
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {sec.title}
                  </div>
                  {sec.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition text-left ${
                        activeTab === item.id
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <RotatingPhilosophy />
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenAccount();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                {currentUser ? (
                  <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px] shrink-0">
                    {currentUser.name[0]?.toUpperCase() || 'U'}
                  </div>
                ) : (
                  <User className="w-4 h-4 text-emerald-400" />
                )}
                <div className="text-left truncate">
                  <div className="font-bold text-slate-100">{currentUser ? currentUser.name : 'Sign In / Account'}</div>
                  <div className="text-[10px] text-slate-400">{currentUser ? 'Signed In • Clean Slate' : 'Offline & Fresh Slate'}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
