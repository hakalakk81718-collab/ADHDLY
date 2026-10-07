'use client';

import React, { useEffect, useRef } from 'react';
import { soundEngine } from '@/lib/soundEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      let data: Uint8Array | null = null;
      const analyser = soundEngine?.getAnalyser();
      if (analyser && isPlaying) {
        data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data as any);
      }

      const bars = 32;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        let barHeight = 4;
        if (data && isPlaying) {
          const val = data[i % data.length] || 0;
          barHeight = Math.max(4, (val / 255) * (height * 0.78));
        } else if (isPlaying) {
          barHeight = 6 + Math.sin(phase + i * 0.4) * 8;
        }

        const x = i * barWidth;
        const y = centerY - barHeight / 2;

        // Gradient from indigo to cyber cyan / emerald
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#818cf8');
        grad.addColorStop(0.5, '#38bdf8');
        grad.addColorStop(1, '#34d399');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x + 1.5, y, Math.max(2, barWidth - 3), barHeight, 3);
        ctx.fill();
      }

      phase += 0.08;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="w-full h-14 bg-slate-950/80 rounded-2xl border border-indigo-500/30 overflow-hidden flex items-center justify-center p-2 relative shadow-inner">
      <canvas ref={canvasRef} width={400} height={48} className="w-full h-full" />
      {!isPlaying && (
        <span className="absolute text-[10px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
          Audio Idle • Tap Any Channel Below
        </span>
      )}
    </div>
  );
};
