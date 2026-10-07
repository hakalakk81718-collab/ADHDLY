'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Plus, Zap, X, Check } from 'lucide-react';
import { storage } from '@/lib/storage';
import { aiEngine } from '@/lib/aiEngine';
import { Task } from '@/types';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded?: (task: Task) => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({ isOpen, onClose, onTaskAdded }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setSpeechSupported(hasSpeech);
    }
  }, []);

  if (!isOpen) return null;

  const toggleVoice = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please type directly.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
                                (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSaveAsTask = () => {
    if (!text.trim()) return;
    const clean = text.trim();
    const steps = aiEngine.decomposeTask(clean);

    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: clean,
      category: 'work',
      priority: 'urgent-important',
      energyRequired: 'low',
      estimatedMinutes: 10,
      steps,
      currentStepIndex: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const existing = storage.getTasks();
    storage.saveTasks([newTask, ...existing]);
    if (onTaskAdded) onTaskAdded(newTask);

    setText('');
    onClose();
  };

  const handleSaveToBrainDump = () => {
    if (!text.trim()) return;
    const clean = text.trim();
    const processed = aiEngine.processBrainDumpText(clean);

    const existing = storage.getBrainDump();
    const newItems = processed.items.map(item => ({
      id: 'bd-' + Math.random().toString(36).substring(2, 9),
      rawText: item.text,
      category: item.category,
      createdAt: new Date().toISOString()
    }));

    storage.saveBrainDump([...newItems, ...existing]);
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1522] border border-indigo-900/40 rounded-3xl p-6 shadow-2xl text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Quick Frictionless Capture</h3>
            <p className="text-xs text-slate-400">Get it out of your head before it disappears</p>
          </div>
        </div>

        <div className="relative mb-4">
          <textarea
            autoFocus
            rows={3}
            placeholder="Type anything in your head, or tap the microphone to speak..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 resize-none"
          />

          <button
            onClick={toggleVoice}
            className={`absolute bottom-3 right-3 p-2 rounded-xl transition ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Dictate with voice"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleSaveToBrainDump}
            disabled={!text.trim()}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition"
          >
            Send to Brain Dump
          </button>

          <button
            onClick={handleSaveAsTask}
            disabled={!text.trim()}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Turn into Micro-Task
          </button>
        </div>

      </div>
    </div>
  );
};
