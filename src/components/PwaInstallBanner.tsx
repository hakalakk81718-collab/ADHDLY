'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Share, PlusSquare, CheckCircle2, ChevronRight } from 'lucide-react';
import { AdhdlyLogo } from '@/components/AdhdlyLogo';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
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

    // Check if user previously closed or installed
    const dismissed = localStorage.getItem('adhdly_pwa_dismissed');
    if (dismissed === 'true') {
      setShowBanner(false);
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
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Trigger banner after 1.5s delay if not dismissed
    const timer = setTimeout(() => {
      const isDismissedNow = localStorage.getItem('adhdly_pwa_dismissed');
      if (isDismissedNow !== 'true') {
        setShowBanner(true);
      }
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
      if (choice && choice.outcome === 'accepted') {
        setShowBanner(false);
        setInstalled(true);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('adhdly_pwa_installed', 'true');
        }
      }
      setDeferredPrompt(null);
    } else {
      // Show device-specific install guide
      setShowManualGuide(true);
    }
  };

  const handleClose = () => {
    setShowBanner(false);
    setShowManualGuide(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('adhdly_pwa_dismissed', 'true');
    }
  };

  if (installed || !showBanner) return null;

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
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title="Close"
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
                onClick={handleClose}
                className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
              >
                Later
              </button>

              <button
                onClick={handleInstallClick}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition hover:scale-105 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            </div>
          </div>
        ) : (
          /* Manual Step Guide (When browser does not allow programmatic prompt or requires click) */
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
            {platform === 'ios' ? (
              <div className="p-2.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5 text-[11px]">
                <div className="font-bold text-indigo-200 flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5 text-indigo-400" /> Install on iOS / Safari:
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>Tap the <strong>Share</strong> button at bottom of Safari</li>
                  <li>Scroll and select <strong>&quot;Add to Home Screen&quot;</strong> <PlusSquare className="w-3 h-3 inline text-emerald-400" /></li>
                  <li>Tap <strong>Add</strong> to launch ADHDLY as a full app!</li>
                </ol>
              </div>
            ) : (
              <div className="p-2.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5 text-[11px]">
                <div className="font-bold text-indigo-200 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" /> Install on Desktop / Browser:
                </div>
                <p className="text-slate-300">
                  Click the <strong>Install app icon (⊕)</strong> on the right side of your address bar or browser menu (⋮) and select <strong>Install ADHDLY</strong>.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleClose}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
              >
                Got It
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
