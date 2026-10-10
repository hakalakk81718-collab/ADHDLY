'use client';

import React, { useState } from 'react';
import { Lightbulb, Send, CheckCircle2, MessageSquarePlus, X } from 'lucide-react';
import { VoiceTypingButton } from '@/components/VoiceTypingButton';
import confetti from 'canvas-confetti';

interface SidebarSuggestionBoxProps {
  collapsed?: boolean;
  onExpandSidebar?: () => void;
}

export const SidebarSuggestionBox: React.FC<SidebarSuggestionBoxProps> = ({
  collapsed = false,
  onExpandSidebar
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [text, setText] = useState('');
  const [type, setType] = useState<'Feature' | 'Bug' | 'General'>('Feature');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    // Send mailto to hakalakk81718@gmail.com
    const subject = encodeURIComponent(`[ADHDLY Sidebar Suggestion - ${type}]`);
    const body = encodeURIComponent(
      `Suggestion Type: ${type}\n\nFeedback:\n${text}\n\nSent from ADHDLY Sidebar`
    );
    window.open(`mailto:hakalakk81718@gmail.com?subject=${subject}&body=${body}`, '_blank');

    // Also persist in local storage log
    try {
      const existing = JSON.parse(localStorage.getItem('adhdly_user_suggestions') || '[]');
      existing.push({
        type,
        text: text.trim(),
        date: new Date().toISOString()
      });
      localStorage.setItem('adhdly_user_suggestions', JSON.stringify(existing));
    } catch {}

    setSubmitted(true);
    setText('');
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch {}

    setTimeout(() => {
      setSubmitted(false);
      setIsOpenModal(false);
    }, 3000);
  };

  // If sidebar is collapsed to an icon rail, render an icon button that opens a floating modal
  if (collapsed) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpenModal(true)}
          className="w-full flex items-center justify-center p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition hover:scale-105 active:scale-95 group relative"
          title="Suggestion Box (Send idea or feedback)"
        >
          <Lightbulb className="w-4 h-4 animate-pulse" />
        </button>

        {isOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm bg-[#090d16] border border-amber-500/30 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>Suggestion Box</span>
                </div>
                <button
                  onClick={() => setIsOpenModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitted ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-emerald-200">Thank you for your suggestion!</p>
                  <p className="text-[10px] text-slate-400">Sent to hakalakk81718@gmail.com</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex gap-1.5">
                    {(['Feature', 'Bug', 'General'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                          type === t
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <textarea
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type or speak any feature idea, improvement, or feedback..."
                      className="w-full p-3 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 resize-none transition"
                    />
                    <div className="absolute right-2 bottom-2">
                      <VoiceTypingButton
                        size="sm"
                        onTranscript={(t) => setText(prev => (prev ? `${prev} ${t}` : t))}
                        title="Voice type your suggestion"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Suggestion</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Expanded View in Sidebar
  return (
    <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900/90 to-indigo-950/30 border border-amber-500/25 space-y-2.5 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Suggestion Box</span>
        </div>
        <span className="text-[9px] font-mono font-bold text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
          Ideas
        </span>
      </div>

      {submitted ? (
        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-0.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
          <p className="text-[11px] font-bold text-emerald-200">Thank you!</p>
          <p className="text-[9px] text-slate-400">Sent to hakalakk81718@gmail.com</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Category mini-chips */}
          <div className="flex gap-1">
            {(['Feature', 'Bug', 'General'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold border transition ${
                  type === t
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Text input with embedded voice mic button */}
          <div className="relative">
            <textarea
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What would make ADHDLY better? (type or speak)..."
              className="w-full p-2.5 pr-8 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-amber-500/60 text-[11px] text-slate-100 placeholder-slate-500 outline-none resize-none transition leading-tight"
            />
            <div className="absolute right-1.5 bottom-1.5">
              <VoiceTypingButton
                size="sm"
                onTranscript={(t) => setText(prev => (prev ? `${prev} ${t}` : t))}
                title="Dictate suggestion with mic"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] text-slate-500 truncate max-w-[120px]">
              hakalakk81718@gmail.com
            </span>
            <button
              type="submit"
              disabled={!text.trim()}
              className="py-1 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-[10px] flex items-center gap-1 transition shadow-sm hover:scale-105 active:scale-95"
            >
              <Send className="w-2.5 h-2.5" />
              <span>Send</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
