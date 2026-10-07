'use client';

import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Sliders, Play, Square, Clock, ShieldCheck, 
  Sparkles, X, Waves, CloudRain, Zap, Music, Coffee, Bell
} from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { AUDIO_LICENSE_REGISTRY, DEFAULT_MIX_PRESETS, storage } from '@/lib/storage';
import { AudioMixPreset } from '@/types';
import { AudioVisualizer } from '@/components/AudioVisualizer';

interface SoundMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundMixerModal: React.FC<SoundMixerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mixer' | 'presets' | 'license'>('mixer');
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.85);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);

  // Channels state
  const [channels, setChannels] = useState<{ [key: string]: { name: string; volume: number; active: boolean; desc: string; icon: string } }>({
    brown: { name: 'Sub-Bass Brown Noise', volume: 0.85, active: false, desc: 'Deep warm 200Hz rumble • Maximum ADHD grounding', icon: 'waves' },
    rain: { name: 'Cozy Rain & Droplets', volume: 0.65, active: false, desc: 'Multi-layer rainfall with natural soft droplets', icon: 'rain' },
    binaural: { name: '10Hz Alpha Focus Waves', volume: 0.6, active: false, desc: 'Dual sine binaural beat + sub carrier for laser flow', icon: 'alpha' },
    drone: { name: 'Lofi Ambient Warm Drone', volume: 0.45, active: false, desc: 'Procedural warm chord triad with breathing sweep', icon: 'drone' },
    cafe: { name: 'Cozy Cafe Ambiance', volume: 0.4, active: false, desc: 'Warm gentle background murmur', icon: 'cafe' },
    pink: { name: 'Gentle Pink Noise', volume: 0.4, active: false, desc: 'Natural 1/f masking for sensory relief', icon: 'pink' }
  });

  const presets = storage.getMixPresets();

  useEffect(() => {
    if (!soundEngine) return;
    setIsPlaying(soundEngine.getIsPlaying());
    setChannels(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        next[key] = {
          ...next[key],
          active: soundEngine.hasChannel(key)
        };
      });
      return next;
    });
  }, [isOpen]);

  const toggleChannel = (type: string) => {
    if (!soundEngine) return;
    const current = channels[type];
    const nextActive = !current.active;

    setChannels(prev => ({
      ...prev,
      [type]: { ...prev[type], active: nextActive }
    }));

    if (nextActive) {
      soundEngine.startChannel(type, current.volume);
      setIsPlaying(true);
    } else {
      soundEngine.stopChannel(type);
      const remainingActive = Object.entries(channels).some(([k, v]) => k !== type && v.active);
      if (!remainingActive) setIsPlaying(false);
    }
  };

  const handleVolumeChange = (type: string, val: number) => {
    if (!soundEngine) return;
    setChannels(prev => ({
      ...prev,
      [type]: { ...prev[type], volume: val }
    }));
    if (channels[type].active) {
      soundEngine.setChannelVolume(type, val);
    }
  };

  const handleMasterVolume = (val: number) => {
    setMasterVolume(val);
    if (soundEngine) soundEngine.setMasterVolume(val);
  };

  const applyPreset = (preset: AudioMixPreset) => {
    if (!soundEngine) return;
    soundEngine.stopAll();

    const newChannels = { ...channels };
    Object.keys(newChannels).forEach(k => {
      newChannels[k].active = false;
    });

    Object.entries(preset.channels).forEach(([type, vol]) => {
      if (newChannels[type]) {
        newChannels[type].volume = vol;
        newChannels[type].active = true;
        soundEngine.startChannel(type, vol);
      }
    });

    setChannels(newChannels);
    setIsPlaying(true);
  };

  const stopAll = () => {
    if (soundEngine) soundEngine.stopAll();
    const reset = { ...channels };
    Object.keys(reset).forEach(k => { reset[k].active = false; });
    setChannels(reset);
    setIsPlaying(false);
  };

  const setTimer = (mins: number) => {
    setTimerMinutes(mins);
    if (soundEngine) {
      soundEngine.setTimer(mins, () => {
        setIsPlaying(false);
        setTimerMinutes(null);
      });
    }
  };

  const playChime = () => {
    if (soundEngine) soundEngine.playBellTone(528, 0.7);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="relative w-full max-w-2xl bg-[#090e18] border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#060a12]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              <Waves className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                ADHD Focus Sound Center
                {isPlaying && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Active
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">100% Procedural Synthesizer • Zero Lag • Infinite Seamless Loops</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Audio Visualizer Strip */}
        <div className="px-6 pt-4 pb-2 bg-[#060a12]/50 border-b border-slate-800/80">
          <AudioVisualizer isPlaying={isPlaying} />
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-[#080d16] text-xs">
          <button
            onClick={() => setActiveTab('mixer')}
            className={`px-4 py-2 font-bold border-b-2 transition ${activeTab === 'mixer' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Channel Mixer
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 font-bold border-b-2 transition ${activeTab === 'presets' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Instant Soundscapes
          </button>
          <button
            onClick={() => setActiveTab('license')}
            className={`px-4 py-2 font-bold border-b-2 transition flex items-center gap-1.5 ${activeTab === 'license' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            License & Origins
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'mixer' && (
            <div className="space-y-4">
              
              {/* Master Control Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {masterVolume === 0 ? <VolumeX className="w-5 h-5 text-slate-500" /> : <Volume2 className="w-5 h-5 text-indigo-400" />}
                  <div>
                    <span className="text-xs font-bold text-white">Master Output</span>
                    <p className="text-[10px] text-slate-400 font-mono">{Math.round(masterVolume * 100)}%</p>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={masterVolume}
                  onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
                  className="w-32 sm:w-48 accent-indigo-500 cursor-pointer"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={playChime}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
                    title="Play 528Hz Tibetan Chime"
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  {isPlaying ? (
                    <button
                      onClick={stopAll}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" /> Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleChannel('brown')}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Brown Noise
                    </button>
                  )}
                </div>
              </div>

              {/* Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(channels).map(([type, ch]) => (
                  <div
                    key={type}
                    className={`p-4 rounded-2xl border transition ${
                      ch.active 
                        ? 'bg-indigo-950/25 border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30' 
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                          {ch.name}
                          {ch.active && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{ch.desc}</div>
                      </div>
                      <button
                        onClick={() => toggleChannel(type)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ml-2 ${
                          ch.active 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {ch.active ? 'Active' : 'Turn On'}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        disabled={!ch.active}
                        value={ch.volume}
                        onChange={(e) => handleVolumeChange(type, parseFloat(e.target.value))}
                        className={`w-full accent-indigo-500 cursor-pointer ${!ch.active && 'opacity-30'}`}
                      />
                      <span className="text-[11px] text-slate-400 font-mono w-7 text-right">
                        {Math.round(ch.volume * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sleep / Focus Timer Strip */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" /> Gentle Fade Timer
                  </span>
                  {timerMinutes && (
                    <span className="text-amber-400 font-mono font-bold">Fades out in {timerMinutes}m</span>
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {[5, 15, 25, 45, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setTimer(mins)}
                      className={`px-3 py-1 text-xs font-bold rounded-xl border transition ${
                        timerMinutes === mins
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                  {timerMinutes && (
                    <button
                      onClick={() => setTimerMinutes(null)}
                      className="px-2.5 py-1 text-xs rounded-xl text-slate-400 hover:text-slate-200 border border-slate-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">
                1-tap ADHD soundscape presets. Zero cognitive load:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: 'preset-deep-brown',
                    name: 'Deep ADHD Brown Noise Cocoon',
                    desc: 'Deep warm sub-bass rumble. Muffles chatter and locks brain into focus.',
                    channels: { brown: 0.9, rain: 0.25 }
                  },
                  {
                    id: 'preset-lofi-drone',
                    name: 'Lo-Fi Ambient Warm Drone',
                    desc: 'Analog chord triad with slow breathing filter. Cozy & grounding.',
                    channels: { drone: 0.65, brown: 0.5 }
                  },
                  {
                    id: 'preset-alpha-focus',
                    name: '10Hz Alpha Waves Flow State',
                    desc: 'Stereo binaural frequency for laser focus. Best with headphones.',
                    channels: { binaural: 0.7, brown: 0.4 }
                  },
                  {
                    id: 'preset-rainy-cafe',
                    name: 'Rainy Coffeehouse',
                    desc: 'Soothing rain combined with warm atmospheric presence.',
                    channels: { rain: 0.7, cafe: 0.4, brown: 0.3 }
                  }
                ].map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-black text-white">{p.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
                    </div>
                    <button
                      onClick={() => applyPreset(p as any)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-indigo-600/25"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Play Mix
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'license' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 leading-relaxed font-medium">
                🛡️ All audio is 100% synthetically generated in your browser via Web Audio API. Zero copyrighted music. Zero streaming lag. Works completely offline.
              </div>
              <div className="space-y-2">
                {AUDIO_LICENSE_REGISTRY.map(r => (
                  <div key={r.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px]">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{r.title}</span>
                      <span className="text-emerald-400">{r.license}</span>
                    </div>
                    <div className="text-slate-400 mt-0.5">{r.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#060a12] flex items-center justify-between text-xs text-slate-400">
          <span>Continuous hardware playback • 0 MB bandwidth</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition"
          >
            Close Deck
          </button>
        </div>

      </div>
    </div>
  );
};
