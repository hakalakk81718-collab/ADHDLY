'use client';

import React, { useState, useEffect } from 'react';
import { Wind, Droplets, Eye, Activity, ArrowRight } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';

export const ResetCenterView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'somatic'>('breathing');
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const [groundingStep, setGroundingStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => {
          const next = prev + 1;
          const cycleSec = next % 16;
          if (cycleSec < 4) setBreathPhase('Inhale');
          else if (cycleSec < 8) setBreathPhase('Hold');
          else if (cycleSec < 12) setBreathPhase('Exhale');
          else setBreathPhase('Rest');
          return next;
        });
      }, 1000);
    } else {
      setSecondsElapsed(0);
      setBreathPhase('Inhale');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive]);

  const toggleBreathing = () => {
    setIsBreathingActive(!isBreathingActive);
    if (!isBreathingActive && soundEngine) {
      soundEngine.playBellTone(528, 0.3);
    }
  };

  const groundingItems = [
    { count: '5', label: 'Things you SEE', desc: 'Notice 5 distinct objects or shadows around you.' },
    { count: '4', label: 'Things you FEEL', desc: 'Weight of feet on the floor, texture of clothing.' },
    { count: '3', label: 'Sounds you HEAR', desc: 'Computer hum, distant sounds, your own breath.' },
    { count: '2', label: 'Things you SMELL', desc: 'Coffee, paper, cool air, soap.' },
    { count: '1', label: 'Thing you TASTE', desc: 'Sip of cool water or lingering mint.' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Calm & Reset Center</h1>
        <p className="text-xs text-slate-400 font-medium">
          Rapid somatic resets to lower sensory overload.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition hover:scale-105 ${
            activeTab === 'breathing'
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Box Breathing (60s)
        </button>
        <button
          onClick={() => setActiveTab('grounding')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition hover:scale-105 ${
            activeTab === 'grounding'
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          5-4-3-2-1 Grounding
        </button>
        <button
          onClick={() => setActiveTab('somatic')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition hover:scale-105 ${
            activeTab === 'somatic'
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          2-Min Body Check
        </button>
      </div>

      {/* 1. Box Breathing View */}
      {activeTab === 'breathing' && (
        <div className="glass-panel-elevated p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-2xl">
          <div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-300 uppercase tracking-widest">
              4-4-4-4 Rhythm
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">Box Breathing</h2>
          </div>

          {/* Glowing Animated Breathing Circle */}
          <div className="relative w-56 h-56 mx-auto flex items-center justify-center my-6">
            <div
              className={`absolute inset-0 rounded-full border-2 border-indigo-500/40 bg-indigo-500/15 transition-all duration-1000 ${
                isBreathingActive && (breathPhase === 'Inhale' || breathPhase === 'Hold')
                  ? 'scale-125 bg-indigo-500/25 shadow-[0_0_40px_rgba(99,102,241,0.4)]'
                  : 'scale-90 bg-indigo-500/5'
              }`}
            />
            <div className="relative text-center">
              <span className="text-3xl font-black text-white block tracking-tight">
                {isBreathingActive ? breathPhase : 'Ready'}
              </span>
              <span className="text-xs text-indigo-300 font-mono font-bold">
                {isBreathingActive ? `${4 - (secondsElapsed % 4)}s` : '4s each'}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={toggleBreathing}
              className={`px-8 py-3.5 rounded-2xl text-xs font-black transition shadow-lg hover:scale-105 active:scale-95 ${
                isBreathingActive
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isBreathingActive ? 'Pause Breathing' : 'Start 60s Breathing Cycle'}
            </button>
          </div>
        </div>
      )}

      {/* 2. 5-4-3-2-1 Grounding View */}
      {activeTab === 'grounding' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/30">
                {groundingItems[groundingStep].count}
              </span>
              <div>
                <h3 className="text-base font-black text-white">{groundingItems[groundingStep].label}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{groundingItems[groundingStep].desc}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-mono font-bold">Step {groundingStep + 1} of 5</span>
              <button
                onClick={() => setGroundingStep(prev => (prev + 1) % 5)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition hover:scale-105 active:scale-95"
              >
                <span>{groundingStep === 4 ? 'Cycle Done' : 'Next Sense'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Somatic Quick Check */}
      {activeTab === 'somatic' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 w-fit">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Drink Cool Water</h3>
              <p className="text-xs text-slate-400">Stimulates vagus nerve and breaks mental freeze.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 w-fit">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">20-20-20 Eye Rest</h3>
              <p className="text-xs text-slate-400">Look 20 feet away for 20s to relax eye muscles.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 w-fit">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Shoulder Drop</h3>
              <p className="text-xs text-slate-400">Shrug shoulders up, then drop with a full exhale.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
