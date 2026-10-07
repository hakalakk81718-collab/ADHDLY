import { Task, EnergyLevel, MicroStep } from '@/types';

export interface RecommendationResult {
  task: Task;
  recommendedStep: MicroStep;
  durationMinutes: number;
  reason: string[];
  encouragement: string;
}

export interface RunningLatePlanItem {
  minuteWindow: string;
  action: string;
  category: 'prep' | 'pack' | 'essentials' | 'buffer';
  durationMinutes: number;
}

export const aiEngine = {
  // Task Decomposer (Section 6 & 7: Decomposer & Task Start Engine)
  decomposeTask(title: string, category: string = 'work'): MicroStep[] {
    const lower = title.toLowerCase();

    // Contextual intelligent templates
    if (lower.includes('clean') || lower.includes('room') || lower.includes('desk') || lower.includes('tidy')) {
      return [
        { id: 'step-1', title: 'Pick up just ONE single item and put it in place', durationMinutes: 1, completed: false, order: 0 },
        { id: 'step-2', title: 'Collect any dishes or cups and carry to the sink', durationMinutes: 3, completed: false, order: 1 },
        { id: 'step-3', title: 'Throw away obvious trash in sight into one bag', durationMinutes: 3, completed: false, order: 2 },
        { id: 'step-4', title: 'Tuck in your chair and wipe down the center surface', durationMinutes: 2, completed: false, order: 3 },
        { id: 'step-5', title: 'Stand back and take a deep breath — you did great!', durationMinutes: 1, completed: false, order: 4 },
      ];
    }

    if (lower.includes('email') || lower.includes('reply') || lower.includes('message') || lower.includes('inbox')) {
      return [
        { id: 'step-1', title: 'Open your email tab or app (don\'t read everything yet)', durationMinutes: 1, completed: false, order: 0 },
        { id: 'step-2', title: 'Find this one specific thread and click open', durationMinutes: 1, completed: false, order: 1 },
        { id: 'step-3', title: 'Type the greeting and first 1-sentence thought', durationMinutes: 2, completed: false, order: 2 },
        { id: 'step-4', title: 'Add 1 sentence on the next step or attachment', durationMinutes: 2, completed: false, order: 3 },
        { id: 'step-5', title: 'Hit Send immediately without second-guessing', durationMinutes: 1, completed: false, order: 4 },
      ];
    }

    if (lower.includes('study') || lower.includes('exam') || lower.includes('read') || lower.includes('chapter') || lower.includes('paper')) {
      return [
        { id: 'step-1', title: 'Open the document or book to page 1 of this topic', durationMinutes: 1, completed: false, order: 0 },
        { id: 'step-2', title: 'Skim only the bold titles and subheadings for 2 minutes', durationMinutes: 2, completed: false, order: 1 },
        { id: 'step-3', title: 'Read the summary paragraph or introduction section', durationMinutes: 5, completed: false, order: 2 },
        { id: 'step-4', title: 'Write down 3 bullet points in your own casual words', durationMinutes: 5, completed: false, order: 3 },
        { id: 'step-5', title: 'Close with a stretch — you gave your brain a strong anchor', durationMinutes: 1, completed: false, order: 4 },
      ];
    }

    if (lower.includes('bill') || lower.includes('tax') || lower.includes('renew') || lower.includes('form') || lower.includes('passport') || lower.includes('admin')) {
      return [
        { id: 'step-1', title: 'Open the website portal or locate the envelope', durationMinutes: 2, completed: false, order: 0 },
        { id: 'step-2', title: 'Log in and locate the form/reference number', durationMinutes: 3, completed: false, order: 1 },
        { id: 'step-3', title: 'Fill out Section 1 (basic personal details only)', durationMinutes: 5, completed: false, order: 2 },
        { id: 'step-4', title: 'Check confirmation page and click Submit', durationMinutes: 3, completed: false, order: 3 },
        { id: 'step-5', title: 'Save confirmation number into notes', durationMinutes: 1, completed: false, order: 4 },
      ];
    }

    // Default ADHD micro-action algorithm: First step is always trivial
    return [
      { id: 'step-1', title: `Open your workspace or file for "${title}"`, durationMinutes: 2, completed: false, order: 0 },
      { id: 'step-2', title: 'Write down the very first rough sentence or bullet point', durationMinutes: 3, completed: false, order: 1 },
      { id: 'step-3', title: 'Spend 5 minutes making forward progress without self-editing', durationMinutes: 5, completed: false, order: 2 },
      { id: 'step-4', title: 'Do a quick 2-minute review of what you just produced', durationMinutes: 2, completed: false, order: 3 },
      { id: 'step-5', title: 'Mark step complete and claim your dopamine point', durationMinutes: 1, completed: false, order: 4 },
    ];
  },

  // "What Should I Do Now?" algorithmic recommendation engine (Section 8)
  getWhatShouldIDoNow(tasks: Task[], energy: EnergyLevel, availableMinutes: number = 25): RecommendationResult | null {
    const uncompleted = tasks.filter(t => !t.completed);
    if (uncompleted.length === 0) return null;

    // Score each task
    const scored = uncompleted.map(t => {
      let score = 0;
      const reasons: string[] = [];

      // Energy matching
      if (energy === 'tired' || energy === 'low' || energy === 'overwhelmed') {
        if (t.energyRequired === 'low') {
          score += 40;
          reasons.push('Gentle match for low brain battery');
        } else if (t.energyRequired === 'high') {
          score -= 30;
        }
      } else if (energy === 'high' || energy === 'hyperfocused') {
        if (t.energyRequired === 'high') {
          score += 35;
          reasons.push('High brain energy match');
        }
      }

      // Time fit
      const est = t.estimatedMinutes || 15;
      if (est <= availableMinutes) {
        score += 30;
        reasons.push(`Easily fits in your ${availableMinutes}-minute window`);
      } else {
        score += 10;
        reasons.push(`We will only do the first 2-minute chunk`);
      }

      // Priority
      if (t.priority === 'urgent-important') {
        score += 35;
        reasons.push('High urgency deadline');
      } else if (t.priority === 'quick-win') {
        score += 25;
        reasons.push('Quick dopamine win');
      }

      // Momentum bonus: task already has partial steps completed
      const completedSteps = t.steps.filter(s => s.completed).length;
      if (completedSteps > 0 && completedSteps < t.steps.length) {
        score += 20;
        reasons.push('Already in progress — easy to pick back up');
      }

      return { task: t, score, reasons };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    const task = best.task;

    // Find current uncompleted step or generate first micro-step
    let currentStep = task.steps.find(s => !s.completed);
    if (!currentStep) {
      currentStep = {
        id: 'step-init',
        title: `Open workspace for ${task.title}`,
        durationMinutes: 2,
        completed: false,
        order: 0
      };
    }

    return {
      task,
      recommendedStep: currentStep,
      durationMinutes: Math.min(currentStep.durationMinutes || 2, 5),
      reason: best.reasons.slice(0, 3),
      encouragement: energy === 'tired' || energy === 'overwhelmed'
        ? "No pressure to finish the whole thing. Just do this tiny step."
        : "You're primed for this. One step at a time."
    };
  },

  // Brain Dump NLP Organizer (Section 5)
  processBrainDumpText(rawText: string): { items: { text: string; category: 'urgent' | 'important' | 'work' | 'college' | 'personal' | 'home' | 'later' | 'optional' }[]; topAction: string } {
    // Split by newlines, commas, or semicolons
    const rawTokens = rawText
      .split(/\n|,|;/)
      .map(s => s.trim())
      .filter(s => s.length > 2);

    const categorized = rawTokens.map(item => {
      const lower = item.toLowerCase();
      let category: 'urgent' | 'important' | 'work' | 'college' | 'personal' | 'home' | 'later' | 'optional' = 'personal';

      if (lower.includes('today') || lower.includes('asap') || lower.includes('urgent') || lower.includes('deadline')) {
        category = 'urgent';
      } else if (lower.includes('exam') || lower.includes('assignment') || lower.includes('class') || lower.includes('professor') || lower.includes('college')) {
        category = 'college';
      } else if (lower.includes('email') || lower.includes('boss') || lower.includes('client') || lower.includes('meeting') || lower.includes('project') || lower.includes('bug')) {
        category = 'work';
      } else if (lower.includes('groceries') || lower.includes('clean') || lower.includes('dishes') || lower.includes('laundry') || lower.includes('room') || lower.includes('cook')) {
        category = 'home';
      } else if (lower.includes('someday') || lower.includes('maybe') || lower.includes('learn') || lower.includes('watch') || lower.includes('read later')) {
        category = 'later';
      } else if (lower.includes('important') || lower.includes('tax') || lower.includes('bank') || lower.includes('bill')) {
        category = 'important';
      }

      return { text: item, category };
    });

    const topPick = categorized.find(c => c.category === 'urgent') ||
                    categorized.find(c => c.category === 'important') ||
                    categorized[0];

    return {
      items: categorized,
      topAction: topPick ? topPick.text : (rawTokens[0] || 'Pick the easiest item first')
    };
  },

  // "I'm Running Late" Mode Plan Generator (Section 22)
  generateRunningLatePlan(minutesAvailable: number): RunningLatePlanItem[] {
    const mins = Math.max(5, Math.min(120, minutesAvailable));

    if (mins <= 10) {
      return [
        { minuteWindow: '0 - 3 min', action: 'Grab essentials: Phone, Wallet, Keys in pocket right now', category: 'essentials', durationMinutes: 3 },
        { minuteWindow: '3 - 6 min', action: 'Slip into shoes & grab jacket/bag', category: 'prep', durationMinutes: 3 },
        { minuteWindow: '6 - 10 min', action: 'Out the door — breathe. You are on your way!', category: 'buffer', durationMinutes: 4 },
      ];
    }

    if (mins <= 20) {
      return [
        { minuteWindow: '0 - 5 min', action: 'Get dressed in easiest clean clothes', category: 'prep', durationMinutes: 5 },
        { minuteWindow: '5 - 9 min', action: 'Pocket essentials check: Keys, Phone, Wallet, Meds/Water', category: 'essentials', durationMinutes: 4 },
        { minuteWindow: '9 - 14 min', action: 'Pack bag with laptop/charger/documents', category: 'pack', durationMinutes: 5 },
        { minuteWindow: '14 - 20 min', action: 'Doorway buffer: Shoes on, walk out the door calmly', category: 'buffer', durationMinutes: 6 },
      ];
    }

    // 25 - 45+ minutes plan
    const prepTime = Math.round(mins * 0.35);
    const packTime = Math.round(mins * 0.2);
    const essentialsTime = Math.round(mins * 0.15);
    const bufferTime = mins - (prepTime + packTime + essentialsTime);

    return [
      { minuteWindow: `0 - ${prepTime} min`, action: 'Get dressed, wash face, quick teeth brush', category: 'prep', durationMinutes: prepTime },
      { minuteWindow: `${prepTime} - ${prepTime + packTime} min`, action: 'Pack work/school bag (laptop, notebook, charger)', category: 'pack', durationMinutes: packTime },
      { minuteWindow: `${prepTime + packTime} - ${prepTime + packTime + essentialsTime} min`, action: 'Pocket launchpad check: Keys, Wallet, Phone, Water bottle', category: 'essentials', durationMinutes: essentialsTime },
      { minuteWindow: `${prepTime + packTime + essentialsTime} - ${mins} min`, action: 'Shoes on + Safe travel buffer. Zero rush!', category: 'buffer', durationMinutes: bufferTime },
    ];
  },

  // "Ask ADHDLY" AI Assistant responses (Section 29)
  askAssistant(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('overwhelm') || q.includes('too much') || q.includes('stressed') || q.includes('panic')) {
      return "Take a slow breath. Your nervous system is in alert mode. Close all other tabs right now. You do not need to solve your entire week today. Click the 'Reset' tab or do 60 seconds of Box Breathing with me, then we'll pick just ONE tiny 2-minute task.";
    }

    if (q.includes('start') || q.includes('paralysis') || q.includes('stuck') || q.includes('cant begin') || q.includes('cannot start')) {
      return "Task paralysis happens when the brain perceives a task as too huge and undefined. Let's make it almost embarrassingly small: Do not finish the task. Just open the tool or document, look at it for 60 seconds, and type one word. Once you start, friction drops by 80%.";
    }

    if (q.includes('distract') || q.includes('lost track') || q.includes('phone') || q.includes('rabbit hole')) {
      return "That is 100% okay! Distraction is just a detour, not a failure. Never scold yourself. Put the phone face down, stretch your neck, and ask: 'What is the very next physical action I can take?' You can restart from here anytime.";
    }

    if (q.includes('time') || q.includes('late') || q.includes('blindness') || q.includes('how long')) {
      return "Time blindness makes 15 minutes feel either like 2 seconds or 4 hours. Use our 'I have 20 minutes' filter or 'I'm Running Late' calculator. Always multiply your initial gut time estimate by 1.5 to give yourself a kind, realistic buffer.";
    }

    if (q.includes('procrastinat') || q.includes('postpon') || q.includes('why do i keep avoiding')) {
      return "You avoid tasks not out of laziness, but because of emotional resistance or ambiguity (fear of perfectionism, unclear instructions, or low dopamine). Try decomposing it into a 2-minute micro-step, or turn on Brown Noise to give your brain stimulation while doing it.";
    }

    return "I am here as your external executive function. Tell me what is on your plate, or hit 'What Should I Do Now?' and I will choose the single lowest-friction action for you to tackle right now.";
  }
};
