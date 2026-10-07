'use client';

import React, { useState } from 'react';
import { HeartHandshake, Wind, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { aiEngine } from '@/lib/aiEngine';
import { MicroStep } from '@/types';
import { VoiceTypingButton } from '@/components/VoiceTypingButton';

interface OverwhelmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSingleStep: (stepTitle: string, durationMinutes: number) => void;
}

export const OverwhelmModal: React.FC<OverwhelmModalProps> = ({ isOpen, onClose, onStartSingleStep }) => {
  const [step, setStep] = useState<'question' | 'breathing' | 'breakdown' | 'action'>('question');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [microSteps, setMicroSteps] = useState<MicroStep[]>([]);
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    if (area === 'dont-know') {
      setStep('breathing');
      startBreathingCycle();
    } else {
      setStep('breakdown');
      const steps = aiEngine.decomposeTask(`Handle urgent ${area} matter`, area);
      setMicroSteps(steps);
    }
  };

  const breathingTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (breathingTimerRef.current) clearInterval(breathingTimerRef.current);
    };
  }, []);

  const startBreathingCycle = () => {
    if (breathingTimerRef.current) clearInterval(breathingTimerRef.current);
    let count = 0;
    breathingTimerRef.current = setInterval(() => {
      count = (count + 1) % 4;
      if (count === 0) setBreathPhase('Inhale');
      else if (count === 1) setBreathPhase('Hold');
      else if (count === 2) setBreathPhase('Exhale');
      else setBreathPhase('Rest');
    }, 4000);
  };

  const handleCustomDecompose = () => {
    if (!customInput.trim()) return;
    const steps = aiEngine.decomposeTask(customInput);
    setMicroSteps(steps);
    setStep('action');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e141f] border border-blue-950/60 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Gentle Question */}
        {step === 'question' && (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <HeartHandshake className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-100">Take a breath. You are safe.</h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Overwhelm means your brain is holding too many open loops at once. We are going to close all of them and pick just <strong>one tiny thing</strong>.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">What feels heaviest right now?</p>
              
              <div className="grid grid-cols-1 gap-2 pt-1">
                {[
                  { id: 'work', label: '💼 Work / Job stress', desc: 'Deadlines, messages, tasks' },
                  { id: 'college', label: '🎓 School / College', desc: 'Assignments, readings, exams' },
                  { id: 'home', label: '🏠 Home / Living Space', desc: 'Dishes, laundry, physical clutter' },
                  { id: 'personal', label: '🧠 Life Admin & Brain Fog', desc: 'Messages, finances, endless thoughts' },
                  { id: 'dont-know', label: '🌀 I honestly do not know / Everything is too loud', desc: 'Let ADHDLY gently guide you to zero' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectArea(item.id)}
                    className="w-full p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition flex items-center justify-between text-left group"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-indigo-300">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Gentle Breathing Reset (If user doesn't know) */}
        {step === 'breathing' && (
          <div className="space-y-6 text-center py-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-semibold">60-Second Nervous System Reset</h3>
              <p className="text-xs text-slate-400 mt-1">Box Breathing: Follow the circle</p>
            </div>

            {/* Breathing Circle */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-4">
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 bg-indigo-500/5 animate-breathe" />
              <div className="relative text-center">
                <span className="text-lg font-bold text-indigo-300 block">{breathPhase}</span>
                <span className="text-xs text-slate-400">4 seconds</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-300">Feeling even slightly more grounded?</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep('breakdown')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                >
                  Yes, let&apos;s pick one tiny step
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  I just needed to breathe (Close)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Breakdown or type custom thought */}
        {step === 'breakdown' && (
          <div className="space-y-5">
            <div className="text-center">
              <h3 className="text-xl font-semibold">We made it smaller.</h3>
              <p className="text-xs text-slate-400 mt-1">You do NOT have to fix everything today. Just look at Step 1:</p>
            </div>

            {microSteps.length > 0 ? (
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/40 space-y-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  FIRST EFFORTLESS STEP
                </span>
                <h4 className="text-base font-semibold text-slate-100">{microSteps[0]?.title}</h4>
                <p className="text-xs text-slate-400">Takes ~{microSteps[0]?.durationMinutes || 2} minutes. That is all we ask of you.</p>

                <button
                  onClick={() => {
                    onStartSingleStep(microSteps[0]?.title || 'Small first step', microSteps[0]?.durationMinutes || 2);
                    onClose();
                  }}
                  className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/25"
                >
                  <CheckCircle2 className="w-4 h-4" /> Start This 2-Minute Step Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="What is the one thing stressing you out?"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full p-3 pr-11 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:border-indigo-500 outline-none"
                  />
                  <div className="absolute right-2">
                    <VoiceTypingButton
                      size="sm"
                      onTranscript={(text) => setCustomInput((prev) => (prev ? `${prev} ${text}` : text))}
                    />
                  </div>
                </div>
                <button
                  onClick={handleCustomDecompose}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition"
                >
                  Decompose into 2-minute steps
                </button>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                onClick={() => setStep('question')}
                className="text-xs text-slate-500 hover:text-slate-400 underline"
              >
                Go back to choices
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Ready to Start */}
        {step === 'action' && microSteps.length > 0 && (
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold">Your single action:</h3>
            <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 text-left">
              <p className="text-sm font-semibold text-indigo-300">{microSteps[0]?.title}</p>
              <p className="text-xs text-slate-400 mt-1">Duration: ~{microSteps[0]?.durationMinutes} min</p>
            </div>

            <button
              onClick={() => {
                onStartSingleStep(microSteps[0]?.title || 'Quick step', microSteps[0]?.durationMinutes || 2);
                onClose();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition"
            >
              Start Focus on this Step
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
