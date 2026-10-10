export const SEO_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://adhdly.app/#webapp",
      "name": "ADHDLY",
      "url": "https://adhdly.app",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "All (Web, Windows, macOS, iOS, Android)",
      "description": "ADHDLY is an external executive function system designed for neurodivergent individuals and ADHD brains experiencing task paralysis, time blindness, and executive dysfunction. Replaces 50-item lists with 1 effortless 2-minute micro-step.",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "softwareVersion": "1.0.0",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "What Should I Do Right Now: 1-Action Decision Engine based on brain battery",
        "2-Minute Micro-Step Task Decomposer to eliminate activation energy friction",
        "Emergency Overwhelm Rescue with 60-Second Box Breathing and single action isolate",
        "Procedural Synthesized Brown Noise & Focus Soundscapes with zero copyright loop",
        "Universal Voice Typing for rapid thought capture and task input",
        "Doorway Launchpad & Running Late departure countdown timer",
        "100% Local-First Data Vault with zero tracking or remote telemetry"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1280",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://adhdly.app/#organization",
      "name": "ADHDLY",
      "url": "https://adhdly.app",
      "logo": "https://adhdly.app/icon.svg",
      "sameAs": [
        "https://github.com/hakalakk81718-collab/ADHDLY"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hakalakk81718@gmail.com",
        "contactType": "Customer Support"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://adhdly.app/#website",
      "url": "https://adhdly.app",
      "name": "ADHDLY — External Executive Function",
      "publisher": {
        "@id": "https://adhdly.app/#organization"
      },
      "description": "Don't organize your entire life. Make the next step easier. External executive function companion for ADHD task paralysis."
    },
    {
      "@type": "FAQPage",
      "@id": "https://adhdly.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is ADHDLY and how does it help ADHD task paralysis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ADHDLY is an external executive function tool built specifically for individuals struggling with ADHD task initiation paralysis and executive dysfunction. Instead of confronting you with overwhelming 50-item to-do lists, ADHDLY assesses your current mental battery (High, Good, Low, Tired, Overwhelmed, Hyperfocused) and recommends exactly ONE frictionless 2-minute micro-step to start right now."
          }
        },
        {
          "@type": "Question",
          "name": "What is an external executive function?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An external executive function is an external system or tool that acts as a surrogate prefrontal cortex. In ADHD, working memory deficits and dopamine dysregulation make prioritizing and initiating tasks internally exhausting. An external executive function holds working memory outside your head, automates micro-decisions, and breaks physical inertia without mental resistance."
          }
        },
        {
          "@type": "Question",
          "name": "Why do traditional to-do lists like Todoist or Notion fail for ADHD?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Traditional to-do apps rely on high executive function to manage (tagging, due dates, organizing, and prioritizing). When an ADHD brain sees 30 pending tasks, working memory overloads into 'freeze mode' (ADHD paralysis), causing guilt spirals. ADHDLY removes decision fatigue by showing only one single 2-minute step at a time."
          }
        },
        {
          "@type": "Question",
          "name": "How does procedural brown noise help ADHD focus?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Brown noise has a deeper, low-frequency 1/f² spectral slope that mimics natural heavy waterfalls and wind. Cognitive studies suggest brown noise dampens intrusive auditory thoughts, masks background sensory triggers, and provides gentle acoustic stimulation that satisfies dopamine-seeking neurodivergent focus."
          }
        },
        {
          "@type": "Question",
          "name": "Does ADHDLY store or share my personal data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. ADHDLY is built with a local-first privacy architecture. All tasks, routines, brain dumps, and settings reside directly in your browser's local storage. There is zero remote tracking, no advertising telemetry, and your data never leaves your device without your explicit export."
          }
        },
        {
          "@type": "Question",
          "name": "Is ADHDLY clinically approved?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ADHDLY is not clinically checked or evaluated by medical doctors. It is built entirely from lived neurodivergent experiences, ADHD community feedback, and cognitive behavioral research on executive dysfunction. It serves as an empathetic everyday productivity companion, not a medical treatment."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://adhdly.app/#howto",
      "name": "How to Overcome ADHD Task Initiation Paralysis with ADHDLY",
      "description": "Follow this 4-step psychological momentum protocol to break through ADHD freeze mode in under 2 minutes.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Assess Brain Battery",
          "text": "Select your current energy level (High, Good, Low, Tired, Overwhelmed) and available minutes (5m to 45m)."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Receive 1 Frictionless Micro-Step",
          "text": "Let ADHDLY's decision engine choose exactly ONE step that takes under 2 minutes (e.g., 'Pick up 1 dirty mug')."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Trigger Procedural Focus Noise",
          "text": "Click 'Start This Step Right Now' to launch the focus chamber with automatic brown noise to drown out distraction."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Claim Win & Build Momentum",
          "text": "Mark the 2-minute step done to trigger dopamine reinforcement and effortlessly cascade into the next action."
        }
      ]
    }
  ]
};
