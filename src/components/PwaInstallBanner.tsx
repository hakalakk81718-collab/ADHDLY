'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Share, PlusSquare, CheckCircle2, ChevronRight } from 'lucide-react';
import { AdhdlyLogo } from '@/components/AdhdlyLogo';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already running in standalone PWA window mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // Detect user platform
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else if (/android/.test(ua)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Listen for native Chromium install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Always show notification to install after slight 1.5s delay
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('adhdly_pwa_minimized');
      if (dismissed === 'true') {
        setIsMinimized(true);
      }
      setShowBanner(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show device-specific install guide
      setShowManualGuide(true);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('adhdly_pwa_minimized', 'true');
    }
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setShowManualGuide(false);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('adhdly_pwa_minimized');
    }
  };

  if (installed || !showBanner) return null;

  // Minimized discrete floating button
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
        <button
          onClick={handleMaximize}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-indigo-600/95 hover:bg-indigo-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/35 border border-indigo-400/40 transition hover:scale-105 active:scale-95 group"
          title="Install ADHDLY on your device"
        >
          <AdhdlyLogo className="w-4 h-4" />
          <span>Install App</span>
          <Download className="w-3.5 h-3.5 text-indigo-200 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] z-50 animate-fade-in">
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0f172a]/95 to-[#090e1a]/95 backdrop-blur-2xl border border-indigo-500/40 p-4 shadow-2xl text-slate-100 glow-indigo">
        
        {/* Top Notification Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <AdhdlyLogo className="w-9 h-9 shadow-lg shadow-indigo-500/30" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white tracking-tight">Install ADHDLY</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  App
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                One-tap focus • Works offline • Zero distractions
              </p>
            </div>
          </div>

          <button
            onClick={handleMinimize}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title="Minimize notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button Row */}
        {!showManualGuide ? (
          <div className="mt-3 flex items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Ready for your {platform === 'ios' ? 'iPhone' : platform === 'android' ? 'Android' : 'computer'}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMinimize}
                className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
              >
                Later
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            </div>
          </div>
        ) : (
          /* Manual Step Guide (For iOS Safari or Desktop where browser needs user gesture) */
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
            <div className="text-[11px] font-bold text-indigo-300">
              {platform === 'ios' && 'How to install on iPhone / iPad:'}
              {platform === 'android' && 'How to install on Android:'}
              {platform === 'desktop' && 'How to install on Computer:'}
            </div>

            {platform === 'ios' && (
              <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Tap the <strong>Share</strong> button <Share className="w-3 h-3 inline text-indigo-400" /> in Safari.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Scroll down and select <strong>Add to Home Screen</strong> <PlusSquare className="w-3 h-3 inline text-indigo-400" />.</span>
                </div>
              </div>
            )}

            {platform === 'desktop' && (
              <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Look at your browser&apos;s <strong>address bar</strong> (top right).</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Click the <strong>Install App icon (⊕ or ⬇)</strong> to add ADHDLY to your desktop.</span>
                </div>
              </div>
            )}

            {platform === 'android' && (
              <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Tap the <strong>Menu (⋮)</strong> icon in your browser.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
                </div>
              </div>
            )}

            <button
              onClick={handleMinimize}
              className="w-full mt-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
            >
              Got it, thanks!
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
