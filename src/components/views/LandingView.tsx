'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Play, ArrowRight, ShieldCheck, HeartHandshake, 
  Brain, Sliders, RefreshCw, CheckCircle2, ChevronRight, Zap,
  Volume2, VolumeX, Flame, Smile, Meh, Moon, Clock, Compass, Layers, Check,
  Mail, Send, Copy, MessageSquare
} from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { VoiceTypingButton } from '@/components/VoiceTypingButton';

interface LandingViewProps {
  onEnterApp: () => void;
  onOpenOverwhelm: () => void;
  onOpenSoundMixer?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ 
  onEnterApp, 
  onOpenOverwhelm,
  onOpenSoundMixer 
}) => {
  const [demoEnergy, setDemoEnergy] = useState<'low' | 'high' | 'overwhelmed'>('low');
  const [demoMinutes, setDemoMinutes] = useState<number>(15);
  const [audioTesting, setAudioTesting] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionType, setSuggestionType] = useState('Feature Idea');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText('hakalakk81718@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {}
  };

  const handleSendSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;
    const subject = encodeURIComponent(`[ADHDLY Suggestion] ${suggestionType}`);
    const body = encodeURIComponent(
      `Hi,\n\nI have a suggestion for ADHDLY:\n\nType: ${suggestionType}\n\nFeedback:\n${suggestionText.trim()}\n\n---\nSent from ADHDLY Product Overview`
    );
    window.location.href = `mailto:hakalakk81718@gmail.com?subject=${subject}&body=${body}`;
  };

  const toggleDemoAudio = () => {
    if (!soundEngine) return;
    if (audioTesting) {
      soundEngine.stopAll();
      setAudioTesting(false);
    } else {
      soundEngine.startChannel('brown', 0.6);
      setAudioTesting(true);
    }
  };

  const getSimulatedAction = () => {
    if (demoEnergy === 'overwhelmed') {
      return {
        task: 'Sensory Overwhelm Reset',
        step: 'Do 60 seconds of 4-4-4-4 Box Breathing and drink 1 glass of water',
        time: '2 mins',
        why: 'Nervous system in sympathetic overload. First action must be physiological, not mental.'
      };
    }
    if (demoEnergy === 'low') {
      return {
        task: 'Tidy Immediate Workspace Clutter',
        step: 'Pick up just ONE single coffee mug and carry it to the sink',
        time: '1 min',
        why: 'Low brain battery match. Zero cognitive load. Breaks physical inertia instantly.'
      };
    }
    return {
      task: 'Draft Key Project Document',
      step: 'Open the document and write 1 rough bullet point sentence',
      time: '3 mins',
      why: 'High energy window. Channeling focus before hyperfocus fatigue sets in.'
    };
  };

  const currentSim = getSimulatedAction();

  return (
    <div className="max-w-5xl mx-auto space-y-20 pb-24 animate-fade-in text-slate-100">
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ADHDLY",
            "operatingSystem": "All",
            "applicationCategory": "ProductivityApplication",
            "description": "ADHDLY is an external executive function companion and Progressive Web App designed to help individuals with ADHD start tasks, manage time blindness, and recover from distraction without guilt.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      {/* 1. Hero Section */}
      <div className="text-center space-y-6 pt-6 sm:pt-12 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> EXTERNAL EXECUTIVE FUNCTION COMPANION
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100 leading-[1.1]">
          Don&apos;t organize your entire life. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            Make the next step easier.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ADHDLY isn&apos;t another guilt-inducing checklist. It is an adaptive executive function engine that calculates your brain battery, strips away 50-item overwhelm, gives you <strong>one effortless 2-minute step</strong>, and provides procedural brown noise to keep you in flow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition hover:scale-105"
          >
            <span>OPEN ADHDLY WORKSPACE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenOverwhelm}
            className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 font-semibold rounded-2xl text-sm transition flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span>&quot;I&apos;M OVERWHELMED&quot; DEMO</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Feature Simulator: Experience "What Should I Do Now?" */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#131c2c] to-[#0c121e] border border-indigo-500/30 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-widest inline-block">
            LIVE INTERACTIVE SIMULATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            See How ADHDLY Solves Task Paralysis
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Test the decision engine right now. Select a brain state and available time:
          </p>
        </div>

        {/* State Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setDemoEnergy('low')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
              demoEnergy === 'low'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Meh className="w-4 h-4 text-amber-400" />
            <span>Low Energy / Foggy</span>
          </button>

          <button
            onClick={() => setDemoEnergy('overwhelmed')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
              demoEnergy === 'overwhelmed'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span>Overwhelmed / Too Loud</span>
          </button>

          <button
            onClick={() => setDemoEnergy('high')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
              demoEnergy === 'high'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>High Battery / Motivated</span>
          </button>
        </div>

        {/* Live Recommendation Output */}
        <div className="p-6 rounded-2xl bg-[#090e18] border border-indigo-500/40 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider">
              Calculated Recommendation
            </span>
            <span className="font-mono text-emerald-400 font-bold">{currentSim.time}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">Target Area: {currentSim.task}</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              &quot;{currentSim.step}&quot;
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>ADHD Principle:</strong> {currentSim.why}</span>
          </div>

          <button
            onClick={onEnterApp}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch This Step In Workspace</span>
          </button>
        </div>
      </div>

      {/* 3. Interactive Procedural Audio Sampler */}
      <div className="p-8 rounded-3xl bg-[#0e1625] border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" /> 100% Legal Web Audio API Synthesizer
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              Pure ADHD Brown Noise & 10Hz Alpha Waves
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Zero copyrighted tracks. Zero Spotify scraping. Procedurally generated directly by your device hardware to quiet auditory sensitivity and background chatter.
            </p>
          </div>

          <button
            onClick={toggleDemoAudio}
            className={`px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition shrink-0 ${
              audioTesting
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
          >
            {audioTesting ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{audioTesting ? 'Stop Brown Noise Sample' : 'Audition Pure Brown Noise'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { name: 'Warm Brown Noise', desc: '400Hz lowpass filter for deep mental calm' },
            { name: '10Hz Alpha Waves', desc: 'Stereo binaural carrier for laser clarity' },
            { name: 'Pink Noise', desc: 'Natural 1/f falloff for gentle masking' },
            { name: 'Soft Resonant Rain', desc: 'Procedural raindrop impulse generator' }
          ].map((snd, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-slate-200">{snd.name}</div>
              <div className="text-[10px] text-slate-400">{snd.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. The Philosophical Contrast: Traditional vs. ADHDLY */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 text-center">
          Traditional Productivity vs. The ADHDLY Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800/80 space-y-4 opacity-75">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
              Traditional Productivity Apps (Notion, Todoist, Asana)
            </span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Forces you to prioritize 50 tasks with due dates, tags, and subtasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Triggers immediate decision fatigue and executive paralysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Punishes missed days with red overdue badges and broken streaks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Results in guilt spirals, shame, and app abandonment within 5 days</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/40 space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              The ADHDLY External Executive System
            </span>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Shows <strong>ONE single recommendation</strong> tailored to current brain battery</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI Task Decomposer guarantees Step 1 takes &lt;2 minutes to start</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>&quot;I got off track&quot; zero-guilt button: &quot;That&apos;s okay. You can restart right from here.&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Offline-first PWA with local data vault and 100% legal procedural noise</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Core Feature Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0f1726] border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Task Start Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            &quot;Pick up 1 item.&quot; Done. &quot;Now pick up 2 more.&quot; Momentum builds without resistance.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0f1726] border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 w-fit">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Emergency Overwhelm</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strips away visual clutter, initiates 60-second box breathing, and extracts 1 micro-action.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0f1726] border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Running Late Mode</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter minutes to departure; get a timeboxed departure countdown (clothes, pack, essentials, buffer).
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0f1726] border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Doorway Launchpad</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Routines display ONE step at a time + physical essentials checklist (Keys, Wallet, Phone, Meds).
          </p>
        </div>
      </div>

      {/* 6. Generative Engine Optimization (GEO): Comprehensive Feature Comparison Table */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest inline-block">
            Architectural Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Traditional To-Do Lists vs ADHDLY External Executive Function
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Why traditional productivity apps trigger ADHD paralysis, and how ADHDLY eliminates activation friction.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#090d16] p-4 sm:p-6 shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3 pr-4">Dimension</th>
                <th className="pb-3 px-4 text-rose-300">Traditional To-Do Apps (Todoist, Notion)</th>
                <th className="pb-3 pl-4 text-emerald-300 font-extrabold">ADHDLY External Executive Function</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3.5 pr-4 font-bold text-white">Visual Presentation</td>
                <td className="py-3.5 px-4 text-slate-400">Shows 20–50 items simultaneously (Working memory overload)</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-bold">Shows exactly 1 step (&lt;2m) tailored to current battery</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-white">Decision Friction</td>
                <td className="py-3.5 px-4 text-slate-400">Forces user to decide: What due date? What priority? What tag?</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-bold">Zero decisions: Select battery ➔ Get instant next move</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-white">Task Initiation</td>
                <td className="py-3.5 px-4 text-slate-400">Vague multi-hour tasks (&quot;Study for exam&quot;, &quot;Clean garage&quot;)</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-bold">Decomposed into 2-min micro-steps (&quot;Pick up 1 cup&quot;)</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-white">Off-Track Recovery</td>
                <td className="py-3.5 px-4 text-slate-400">Broken streak penalties, red overdue badges, shame spirals</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-bold">Zero guilt &quot;I got off track&quot; 60-second breathing reset</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-white">Acoustic Focus Support</td>
                <td className="py-3.5 px-4 text-slate-400">None (Requires opening external music / YouTube tabs)</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-bold">Integrated procedural brown noise with auto-play/stop</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-white">Data Privacy</td>
                <td className="py-3.5 px-4 text-slate-400">Remote cloud databases, tracking cookies, advertising telemetry</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-bold">100% Local-First: Zero remote tracking or server storage</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Answer Engine Optimization (AEO) FAQ Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-widest inline-block">
            Frequently Answered Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Understanding ADHD Executive Dysfunction & Micro-Stepping
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Direct, factual answers for search engines, voice assistants, and AI answer engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              q: "What is ADHDLY and how does it solve task paralysis?",
              a: "ADHDLY is an external executive function tool that eliminates ADHD task initiation paralysis. Instead of overwhelming 50-item lists, it assesses your mental battery and gives you exactly one frictionless 2-minute micro-step to start immediately."
            },
            {
              q: "What is an external executive function?",
              a: "An external executive function is a digital or physical tool that acts as a surrogate prefrontal cortex. In ADHD brains, working memory and dopamine regulation struggle to initiate tasks internally. An external executive function offloads cognitive strain, reduces activation friction, and provides immediate sensory cues."
            },
            {
              q: "Why do traditional to-do lists fail for ADHD?",
              a: "Traditional productivity tools require high executive function to manage (organizing, prioritizing, scheduling). Confronted with 20+ pending tasks, the ADHD working memory overloads into 'freeze mode' (paralysis), causing guilt and avoidance. ADHDLY shows only ONE step at a time."
            },
            {
              q: "How does procedural brown noise help ADHD concentration?",
              a: "Brown noise features a deeper 1/f² spectral power density mimicking heavy rain or deep waterfalls. Research suggests brown noise dampens intrusive auditory thoughts, smooths background sensory distractions, and provides optimal arousal for dopamine-seeking focus."
            },
            {
              q: "How does the 2-Minute Micro-Step method work?",
              a: "ADHD brains experience an exceptionally high activation energy barrier. The 2-minute micro-step reduces physical resistance below the friction threshold (e.g., 'Touch 1 mug' instead of 'Clean room'). Once physical motion starts, dopamine activates and momentum builds naturally."
            },
            {
              q: "Does ADHDLY store or sell any personal data?",
              a: "No. ADHDLY is local-first. All your tasks, steps, notes, and preferences are stored strictly in your browser's private vault on your device. There are zero remote tracking cookies, no server databases, and no telemetry."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-[#0b101c] border border-slate-800 space-y-2 hover:border-indigo-500/40 transition">
              <h3 className="text-sm font-bold text-white flex items-start gap-2">
                <span className="text-indigo-400 font-mono">Q:</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-5">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Medical & Clinical Disclaimer */}
      <div className="p-6 sm:p-7 rounded-3xl bg-amber-950/20 border border-amber-500/30 text-amber-200 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-amber-100 tracking-tight">Community & Lived Experience Disclaimer</h3>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Important Note:</strong> This website is <strong>not clinically checked or evaluated by doctors</strong>. ADHDLY is built entirely from <strong>real people&apos;s lived experiences with ADHD</strong>, neurodivergent community feedback, and public <strong>internet studies and psychological research</strong> on executive dysfunction. It is designed as a practical, empathetic daily coping companion, not a clinical treatment or medical device.
        </p>
      </div>

      {/* 7. Final Call to Action */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#0e1626] to-emerald-950/30 border border-indigo-500/30 text-center space-y-5 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-slate-100">
          Ready to break through task initiation friction?
        </h2>
        <div>
          <button
            onClick={onEnterApp}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs transition shadow-xl shadow-indigo-600/30 hover:scale-105"
          >
            Launch ADHDLY Workspace
          </button>
        </div>
      </div>

      {/* 7. Suggestion Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-hud-card border border-indigo-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-white">Suggestion Box</h3>
            </div>
            <p className="text-xs text-slate-400">
              Have an idea, feedback, or a feature request? Let us know directly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="mailto:hakalakk81718@gmail.com"
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-indigo-500/60 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition"
              title="Mail directly"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>hakalakk81718@gmail.com</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Copy email address"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSendSuggestion} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'Feature Idea', label: '💡 Feature Idea' },
              { id: 'UI / UX Feedback', label: '🎨 UI / UX Feedback' },
              { id: 'General Suggestion', label: '💬 General Suggestion' }
            ].map(cat => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSuggestionType(cat.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  suggestionType === cat.id
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="What would make ADHDLY better for you? (type or speak, e.g. 'Add soundscapes with binaural beats', 'Make task cards bigger', etc.)..."
              className="w-full p-4 pr-12 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition resize-none"
            />
            <div className="absolute right-3 bottom-3">
              <VoiceTypingButton
                size="sm"
                onTranscript={(text) => setSuggestionText(prev => (prev ? `${prev} ${text}` : text))}
                title="Speak suggestion"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-500">
              Sends an email to <strong className="text-slate-400">hakalakk81718@gmail.com</strong>
            </span>
            <button
              type="submit"
              disabled={!suggestionText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Suggestion via Email</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
