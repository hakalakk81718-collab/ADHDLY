'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceTypingButtonProps {
  onTranscript: (transcript: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
}

export const VoiceTypingButton: React.FC<VoiceTypingButtonProps> = ({
  onTranscript,
  className = '',
  size = 'md',
  title = 'Voice typing (Click and speak)'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = 
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === 'undefined') return;

    const SpeechRecognition = 
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or type manually.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal || event.results[i][0]) {
            text += event.results[i][0].transcript + ' ';
          }
        }
        if (text.trim()) {
          onTranscript(text.trim());
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Error starting speech recognition:', err);
      setIsListening(false);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 rounded-lg text-xs',
    md: 'p-2 rounded-xl text-xs',
    lg: 'p-2.5 rounded-2xl text-sm'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`transition-all flex items-center justify-center shrink-0 ${sizeClasses} ${
        isListening
          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-2 ring-rose-400/50 animate-pulse'
          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-slate-700/80 hover:border-indigo-500/50'
      } ${className}`}
      title={isListening ? 'Listening... click to stop' : title}
      aria-label={isListening ? 'Stop listening' : 'Start voice typing'}
    >
      {isListening ? (
        <span className="flex items-center gap-1">
          <Mic className={`${iconSizes} fill-current text-white animate-bounce`} />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Listening</span>
        </span>
      ) : (
        <Mic className={iconSizes} />
      )}
    </button>
  );
};
