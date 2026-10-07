import React from 'react';

interface AdhdlyLogoProps {
  className?: string;
  size?: number;
}

export const AdhdlyLogo: React.FC<AdhdlyLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95`}
      width={size}
      height={size}
    >
      <defs>
        {/* Neurodiversity Outer Rim Gradient */}
        <linearGradient id="adhd-rim-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="35%" stopColor="#06b6d4" />
          <stop offset="70%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Left Wing Ribbon Gradient (Ascending Focus) */}
        <linearGradient id="adhd-left-wing" x1="18" y1="46" x2="32" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Right Wing Ribbon Gradient (Momentum & Flow) */}
        <linearGradient id="adhd-right-wing" x1="32" y1="16" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Dopamine Spark Gradient (Task Initiation Trigger) */}
        <linearGradient id="adhd-spark-grad" x1="22" y1="34" x2="42" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      {/* Cyber-Zen Glass Squircle Badge */}
      <rect 
        x="4" 
        y="4" 
        width="56" 
        height="56" 
        rx="16" 
        fill="#070b14" 
        stroke="url(#adhd-rim-grad)" 
        strokeWidth="2.2"
      />

      {/* Ambient Neural Core Glow */}
      <circle cx="32" cy="32" r="16" fill="#6366f1" fillOpacity="0.22" />

      {/* Modern 'A' Architecture with Neurodivergent Flow */}
      {/* Left Wing of 'A' */}
      <path 
        d="M20 46L32 16" 
        stroke="url(#adhd-left-wing)" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />

      {/* Right Wing of 'A' */}
      <path 
        d="M32 16L44 46" 
        stroke="url(#adhd-right-wing)" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />

      {/* ADHD Dopamine Spark / Initiation Crossbar (⚡ Motif) */}
      <path 
        d="M22 36L30 32L34 38L42 34" 
        stroke="url(#adhd-spark-grad)" 
        strokeWidth="3.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Apex Focus & Clarity Beacon */}
      <circle cx="32" cy="16" r="3.2" fill="#ffffff" />
      <circle cx="32" cy="16" r="1.8" fill="#38bdf8" />

      {/* Dual Synaptic Grounding Anchors */}
      <circle cx="20" cy="46" r="2.2" fill="#6366f1" />
      <circle cx="44" cy="46" r="2.2" fill="#10b981" />
    </svg>
  );
};
