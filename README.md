# ADHDLY — External Executive Function

> **"Don't organize your entire life. Make the next step easier."**

ADHDLY is a modern, installable Progressive Web App (PWA) designed specifically for individuals experiencing ADHD-related executive-function difficulties, task initiation paralysis, and time blindness.

---

## ⚡ Core Philosophy & Differentiation

Traditional productivity tools use the formula:
`Task ➔ Due Date ➔ Priority ➔ Massive 50-Item Checklist ➔ Broken Streaks & Shame`

This creates catastrophic decision fatigue and guilt spirals. **ADHDLY** replaces this with:
`Brain State ➔ Available Time ➔ 1 Frictionless Step (<2m) ➔ Start ➔ Focus ➔ Zero-Guilt Recovery`

The app answers one primary question at all times:
> **"What should I do right now?"**

---

## 🚀 Key Features

### 1. "What Should I Do Right Now?" (Decision Engine)
- Analyzes current brain battery (`High`, `Good`, `Low`, `Tired`, `Overwhelmed`, `Hyperfocused`), available minutes (5, 10, 15, 25, 45m), and task urgency.
- Returns **exactly ONE** recommendation with a frictionless 2-minute actionable first step.

### 2. Task Start Engine
- Signature momentum builder: "Let's make this smaller."
- "First step: Pick up one single item." ➔ [Done!] ➔ "Great! Now pick up 2 more."

### 3. AI Task Decomposer
- Splits overwhelming tasks into 4–5 bite-sized micro-steps.
- Step 1 is always effortless (< 2 minutes, e.g. "Open the project folder").

### 4. Brain Dump & Voice Dictation
- Stream-of-consciousness input via text or Web Speech API voice capture.
- Automatically organizes thoughts into Urgent, Important, Work, College, Personal, Home, and Later.
- Highlights: *"Don't worry about everything yet. What matters first?"*

### 5. 100% Legal Web Audio Focus Center & Smart Mixer
- Procedurally synthesized directly on device hardware via the **Web Audio API**:
  - **ADHD Brown Noise** (400Hz low-pass warm grounding rumble)
  - **Pink Noise** (balanced 1/f gentle auditory masking)
  - **White Noise** (crisp sound blocker)
  - **10Hz Alpha Waves** (binaural stereo focus beats)
  - **Synthesized Soft Rainfall** & **Cafe Murmur**
  - **528Hz Solfeggio Resonant Bell Chimes**
- Zero external MP3 streams, zero copyright issues, zero subscription fees, works completely offline.
- Audio source & license registry (`/api/audio/registry`).

### 6. Emergency Overwhelm Mode
- Dedicated **[ I'M OVERWHELMED ]** button: drops visual stimulus immediately.
- Guides user through gentle 60-second 4-4-4-4 Box Breathing or extracts 1 single 2-minute action.

### 7. Zero-Guilt Recovery Mode
- Permanent lifeline: *"I got off track / I'm distracted"*.
- Never scolds or shames. Response: *"That's okay. You can restart from right here."*

### 8. Doorway Launchpad & Routines
- Shows **ONE step at a time** to eliminate morning/evening routine paralysis.
- **"I'm Running Late" Mode**: Enter remaining minutes ➔ calculates real-time exit plan.
- Leaving Home Checklist (Phone, Wallet, Keys, Water, Charger, Meds).

### 9. Time Blindness & Positive Progress
- Compares estimated vs actual time with supportive buffers.
- Rewards starting, returning, and recovering. No broken streaks.

### 10. Progressive Web App (PWA) & Offline Shell
- Installable on Windows, macOS, Android, iOS.
- Offline-first Service Worker cache (`sw.js`) and `manifest.webmanifest`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Icons**: Lucide React
- **Audio**: Procedural Web Audio API Sound Synthesizer
- **Voice**: Web Speech Recognition API with text fallback
- **Dopamine Sparks**: Canvas Confetti
- **State & Storage**: Resilient client-side LocalStorage with offline synchronization

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Development
```bash
# In D:\adhdly
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🛡️ Medical & Ethical Disclaimer
ADHDLY is a productivity, organization, and external executive-function assistant. It is **not** a medical diagnosis, clinical treatment, or therapy service.
