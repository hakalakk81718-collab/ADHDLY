'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, Send, CheckCircle2, MessageSquarePlus, Sparkles, HeartHandshake, History, Clock } from 'lucide-react';
import { VoiceTypingButton } from '@/components/VoiceTypingButton';
import confetti from 'canvas-confetti';

interface SavedSuggestion {
  type: string;
  text: string;
  date: string;
}

export const SuggestionBoxView: React.FC = () => {
  const [suggestionType, setSuggestionType] = useState<'Feature Request' | 'Bug Report' | 'ADHD Workflow Idea' | 'General Feedback'>('Feature Request');
  const [suggestionText, setSuggestionText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<SavedSuggestion[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('adhdly_user_suggestions');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    // Send mailto to hakalakk81718@gmail.com
    const subject = encodeURIComponent(`[ADHDLY Feedback - ${suggestionType}]`);
    const body = encodeURIComponent(
      `Suggestion Type: ${suggestionType}\n\nFeedback:\n${suggestionText.trim()}\n\nSent from ADHDLY App User`
    );
    window.open(`mailto:hakalakk81718@gmail.com?subject=${subject}&body=${body}`, '_blank');

    // Save to local history
    const newEntry: SavedSuggestion = {
      type: suggestionType,
      text: suggestionText.trim(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    try {
      localStorage.setItem('adhdly_user_suggestions', JSON.stringify(updatedHistory));
    } catch {}

    setSubmitted(true);
    setSuggestionText('');

    try {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    } catch {}

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
          <Lightbulb className="w-3.5 h-3.5" /> Community Driven
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Suggestion Box
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-lg mx-auto">
          Help us build the ultimate external executive function. What features, sounds, or shortcuts would make ADHDLY better for you?
        </p>
      </div>

      {/* Main Suggestion Card */}
      <div className="glass-panel-elevated glow-indigo border border-indigo-500/30 p-6 sm:p-8 rounded-3xl space-y-5">
        
        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Thank you for your feedback!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your suggestion has been logged and sent to <span className="font-mono text-indigo-300 font-bold">hakalakk81718@gmail.com</span>. We read every single idea.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              Submit Another Idea
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Feature Request', label: '🚀 Feature Request' },
                  { id: 'Bug Report', label: '🐛 Bug Report' },
                  { id: 'ADHD Workflow Idea', label: '🧠 Workflow Idea' },
                  { id: 'General Feedback', label: '💬 General Feedback' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSuggestionType(cat.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                      suggestionType === cat.id
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input with Voice Dictation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  Your Suggestion
                </label>
                <span className="text-slate-500 text-[11px]">Type with keyboard or tap mic to speak</span>
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  placeholder="Tell us what you'd love to see (e.g. 'Add binaural brown noise presets', 'Make task card text bigger', 'Add an iOS widget', etc.)..."
                  className="w-full p-4 pr-12 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
                <div className="absolute right-3 bottom-3">
                  <VoiceTypingButton
                    size="md"
                    onTranscript={(text) => setSuggestionText(prev => (prev ? `${prev} ${text}` : text))}
                    title="Speak suggestion with microphone"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-500 text-center sm:text-left">
                Sends directly to <strong className="text-slate-400 font-mono">hakalakk81718@gmail.com</strong>
              </span>

              <button
                type="submit"
                disabled={!suggestionText.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit to Developers</span>
              </button>
            </div>

          </form>
        )}

      </div>

      {/* History of Sent Suggestions */}
      {history.length > 0 && (
        <div className="glass-panel p-5 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Your Submitted Suggestions ({history.length})</span>
          </div>

          <div className="space-y-2">
            {history.slice(0, 5).map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                    {item.type}
                  </span>
                  <p className="text-slate-200">{item.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
