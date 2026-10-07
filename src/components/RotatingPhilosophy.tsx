'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Quote } from 'lucide-react';

const PHILOSOPHIES = [
  "Don't organize your entire life. Make the next step easier.",
  "Starting friction is the only obstacle. The first 60 seconds do 80% of the work.",
  "Every detour is just information, never a failure. You can restart right from here.",
  "A 2-minute step done messy is 1,000% better than a perfect plan delayed.",
  "Action creates dopamine and motivation—not the other way around.",
  "Your brain isn't broken. It just needs an external executive compass.",
  "Zero guilt. No broken streaks. Today is always a clean slate.",
  "Focus isn't sitting still for 4 hours; it's gently returning when your mind wanders."
];

interface RotatingPhilosophyProps {
  collapsed?: boolean;
}

export const RotatingPhilosophy: React.FC<RotatingPhilosophyProps> = ({ collapsed = false }) => {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PHILOSOPHIES.length);
        setIsFading(false);
      }, 500);
    }, 10000); // exactly every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (collapsed) {
    return (
      <div 
        className="p-2.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 flex items-center justify-center"
        title={PHILOSOPHIES[index]}
      >
        <Quote className="w-4 h-4 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0e1524] border border-indigo-500/20 text-xs shadow-md transition-all">
      {/* 10-second subtle progress bar */}
      <div 
        key={index} 
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-amber-400 opacity-60 animate-shrink"
      />

      <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>ADHD Philosophy</span>
      </div>

      <p className={`text-slate-300 font-medium leading-relaxed transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}>
        &quot;{PHILOSOPHIES[index]}&quot;
      </p>
    </div>
  );
};
