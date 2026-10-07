'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, X } from 'lucide-react';
import { aiEngine } from '@/lib/aiEngine';

interface AskAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDecomposeRequest?: (text: string) => void;
}

export const AskAiModal: React.FC<AskAiModalProps> = ({ isOpen, onClose, onDecomposeRequest }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([
    {
      sender: 'assistant',
      text: "Hey! I'm ADHDLY, your external executive function. Feeling stuck, overwhelmed, or having trouble starting? Tell me what you're facing and I'll find the smallest, easiest next move."
    }
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "I can't start this task",
    "I'm overwhelmed by everything",
    "I only have 10 minutes",
    "Why do I keep postponing this?",
    "Help me plan my afternoon"
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || query).trim();
    if (!text) return;

    const userMsg = { sender: 'user' as const, text };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'assistant', text: data.answer || aiEngine.askAssistant(text) }]);
    } catch {
      const fallback = aiEngine.askAssistant(text);
      setMessages(prev => [...prev, { sender: 'assistant', text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0f1624] border border-indigo-900/40 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col h-[600px] max-h-[90vh]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Ask ADHDLY</h3>
            <p className="text-xs text-slate-400">Your External Executive Function Partner</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" /> Thinking kindly...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-indigo-500/50 hover:text-white transition shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="pt-2 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="What are you stuck on right now?..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Medical disclaimer */}
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-slate-500">
            <AlertCircle className="w-3 h-3 text-slate-500 shrink-0" />
            <span>Productivity & executive support tool. Not medical diagnosis or therapeutic treatment.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
