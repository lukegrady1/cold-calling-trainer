# Cold Calling Trainer — Build Instructions

## Project Overview

Build a simple, no-AI, click-through cold calling trainer. The rep walks through the script one step at a time, sees what the prospect "would say" at each stage, practices their response out loud, and clicks "next" to continue. Along the way, random objections get thrown in to keep them sharp.

The goal: a rep can run this 10-20 times in a sitting to internalize the flow, build muscle memory, and not freeze when an objection comes.

**No AI. No API keys. No backend. Just a static site with hardcoded script data and randomization.**

---

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript — or even plainer, just a single HTML file with Tailwind CDN if you want zero setup
- **Styling:** Tailwind CSS + shadcn/ui (if using Next.js)
- **State:** React `useState` only. No database, no localStorage required (optional for streak tracking)
- **Deployment:** Vercel (or open the HTML file locally — really doesn't matter)

If you want the absolute simplest version: **one `index.html` file with embedded JS**. No build step, no npm install. Drag it into the browser and go. Pick whichever vibe fits — I'll spec the Next.js version below but the same logic works either way.

---

## How It Works (User Flow)

1. Rep lands on the page, clicks **"Start Call"**
2. App shows the first prospect line in a chat-style bubble: *"Hello?"*
3. Below it, the script tells the rep what to say next, like flashcard prompts
4. Rep practices the line out loud (or in their head)
5. Rep clicks **"Next"** → next prospect line appears → next rep prompt appears
6. At random points (roughly 30-40% chance per step after the opener), an **objection card** pops up instead of the normal next line. The rep has to remember the correct response, then click "Show Response" to see the answer
7. Rep clicks **"Continue"** to go back to the main flow
8. Flow ends with the appointment booked + a "Run Again" button
9. Optional: small streak counter showing "X calls practiced today"

---

## The Script Data (Hardcoded)

This is the actual data file. Just a TypeScript array of steps. The whole "trainer" is rendering these one at a time.

```ts
// lib/script.ts

export type Step = {
  id: number;
  prospectLine: string;       // what the "prospect" says
  repPrompt: string;          // what the rep should say back (the cue)
  repExample: string;         // the example script line for reference
  notes?: string;             // optional coaching note
};

export const scriptSteps: Step[] = [
  {
    id: 1,
    prospectLine: "Hello?",
    repPrompt: "Confirm you've got the right person + drop the referral hook.",
    repExample:
      "Hey is this [their name / business name]? Hey what's up [name], my mom's friend Julie Becker referred me to you guys, she said you did super high quality work — the [niche] right?",
    notes: "Sound casual, not scripted. The Julie Becker line is a pattern interrupt — don't deliver it like a teleprompter.",
  },
  {
    id: 2,
    prospectLine: "Yeah that's right... wait, who's Julie Becker?",
    repPrompt: "Brush it off naturally — she's your mom's friend, you've never met her.",
    repExample:
      "Oh yeah she's just a friend of my mom's, I've actually never met her — she just gave me a list of people to call.",
    notes: "Don't get flustered. This is a normal, expected question.",
  },
  {
    id: 3,
    prospectLine: "Ok, so what's this about?",
    repPrompt: "Open the conversation about your offer (assume they don't have it).",
    repExample:
      "Sweet, yeah she told me to give you guys a call, said you guys don't have a website or a Google page or anything like that?",
    notes: "Either they agree, or they say they have a Google page — then you pivot to 'but you don't have a website right?' Either way, you're in conversation.",
  },
  {
    id: 4,
    prospectLine: "Yeah we don't have a website.",
    repPrompt: "Make the pitch sound low-pressure and self-deprecating. Ask permission to build something.",
    repExample:
      "Ok cool, well I don't want to waste your time. I just graduated college and I've started a little [agency type]. I've done [services] for a long time but I thought I'd finally make a business out of it. Right now I'm doing it super cheap with the hopes I might get a testimonial from you saying I did a good job. Do you mind if I build something out for you to take a look at?",
    notes: "This framing lowers their guard — you're not 'selling', you're asking for a chance to prove yourself.",
  },
  {
    id: 5,
    prospectLine: "Yeah maybe, how much do you usually charge?",
    repPrompt: "Anchor the price low. Frame it as covering hosting + domain. Offer the call.",
    repExample:
      "So I cover the cost of monthly hosting and the domain. Right now I'm just charging between $97-$497 depending on how crazy you want to get with it. If you have like 10 minutes today or tomorrow I could walk you through some of the work I've done and give you a little free audit of your business. All I'd need is for you to fill out a basic form with some info about your business.",
    notes: "The 'free audit' + 'basic form' framing makes it feel like a no-brainer.",
  },
  {
    id: 6,
    prospectLine: "Ok yeah why not, call me back later today or tomorrow.",
    repPrompt: "Don't accept the brush-off. Lock in a specific time on your calendar — give two options.",
    repExample:
      "Sweet! Even better than a call back, let me just schedule into my calendar, give me one sec. How's 2pm today, or I also have 10am open tomorrow — what works better for you?",
    notes: "Two specific times, never 'when are you free'. Reduces decision fatigue.",
  },
  {
    id: 7,
    prospectLine: "Tomorrow at 10 should work.",
    repPrompt: "Get commitment to reduce no-shows. Use the zombie apocalypse line or your own version.",
    repExample:
      "Sweet. Besides the off chance there's a zombie apocalypse at 10am tomorrow, any reason you wouldn't show up?",
    notes: "The joke gets a laugh AND a commitment. The more commitment you extract, the lower your no-show rate.",
  },
  {
    id: 8,
    prospectLine: "Haha, should be fine.",
    repPrompt: "Soft close. Reframe the call as value-for-them, not a sales pitch. Wrap warmly.",
    repExample:
      "Sweet, well at the very least you can learn a little about your business from an advertising perspective and see what some of your competitors are doing. Appreciate your time [name], talk to you tomorrow at 10!",
    notes: "Last impression matters. Sound like a friend, not a salesperson.",
  },
];
```

---

## The Objection Bank (Hardcoded)

These get randomly injected. Each one has the objection, the correct response framing, and a note.

```ts
// lib/objections.ts

export type Objection = {
  id: number;
  prospectLine: string;
  correctResponse: string;
  framing: string;
};

export const objections: Objection[] = [
  {
    id: 1,
    prospectLine: "We don't need a website — we already have enough business.",
    correctResponse:
      "I totally understand, I hear that all the time. The reason this still works is it lets you charge MORE for the same service. If you're already turning away business, you can quote the overflow at a higher price — if they say yes, you just made money you wouldn't have. If no, you're in the exact same spot you were.",
    framing: "AGREE FIRST. Then reframe — it's not about more leads, it's about charging more for the leads you already turn away.",
  },
  {
    id: 2,
    prospectLine: "Sounds too expensive.",
    correctResponse:
      "Totally hear you. Quick question — what do you usually charge for a job? [Let them answer, usually $4-10k for contractors.] Okay so I'm only $97 a month. If this gets you ONE job a year, that's a 4x return minimum. If I can't get you at least one job a year I'd probably just go play in traffic.",
    framing: "5th grade math. Make it feel impossible they wouldn't ROI. End with the 'play in traffic' joke to keep it light.",
  },
  {
    id: 3,
    prospectLine: "We already have a website.",
    correctResponse:
      "Cool, when's the last time it got you a job? [Or:] Got it, but you don't have a Google Business Profile set up right? That's actually where most of the leads come from these days.",
    framing: "Pivot to whichever piece they're missing. Or open the conversation about whether their current site is actually performing.",
  },
  {
    id: 4,
    prospectLine: "Just send me an email and I'll look at it.",
    correctResponse:
      "Yeah for sure, I can do that. But real quick — what's the best time? Tomorrow at 10 or 2? It'll only take 10 minutes and you'll get way more out of it than reading an email.",
    framing: "Soft brush-off. Don't accept it. Pivot back to booking a specific time.",
  },
  {
    id: 5,
    prospectLine: "How did you get my number?",
    correctResponse:
      "Honestly? Found you on Google. You've got great reviews — that's actually why I'm calling. Figured a business that's clearly doing good work deserves to be found by more people.",
    framing: "Stay calm. Be honest. Flip it into a compliment.",
  },
  {
    id: 6,
    prospectLine: "I'm not interested.",
    correctResponse:
      "Totally fair, appreciate you being upfront. Can I ask what specifically — is it the timing, the cost, or just not a fit right now? Just trying to learn so my next call goes better.",
    framing: "Don't argue. Don't push. Ask what's underneath it — the answer tells you whether to follow up later or move on.",
  },
  {
    id: 7,
    prospectLine: "All my business comes from word of mouth, I don't need that internet stuff.",
    correctResponse:
      "That's awesome, honestly — word of mouth is the best marketing there is. Quick question though, when someone refers you, what do you think they do before calling? They Google you. If you don't show up or you've got no reviews, you've probably already lost some of those referrals without ever knowing.",
    framing: "Agree with them. Then show that even word-of-mouth leads check you out online before calling.",
  },
  {
    id: 8,
    prospectLine: "I'm busy right now, can you call me back?",
    correctResponse:
      "Totally, won't keep you. When's a good time — later today around 3, or tomorrow morning? I'll only need 5 minutes.",
    framing: "Don't say 'sure I'll call back'. Pin them to a specific time right now or you'll never reach them again.",
  },
];
```

---

## Component Structure

Keep it dead simple. Four components total.

```
app/
├── page.tsx              # The whole trainer (single page)
components/
├── ProspectBubble.tsx    # The chat bubble showing what the prospect said
├── RepPrompt.tsx         # The card showing the rep's cue + example
├── ObjectionCard.tsx     # The objection drill card (with reveal button)
└── EndScreen.tsx         # "Call booked! Run again?" screen
```

---

## Main Page Logic (Pseudocode)

```tsx
// app/page.tsx

"use client";
import { useState } from "react";
import { scriptSteps } from "@/lib/script";
import { objections } from "@/lib/objections";

export default function TrainerPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [showingObjection, setShowingObjection] = useState<Objection | null>(null);
  const [revealResponse, setRevealResponse] = useState(false);
  const [callsCompleted, setCallsCompleted] = useState(0);

  const currentStep = scriptSteps[stepIndex];
  const isLastStep = stepIndex === scriptSteps.length - 1;

  function handleNext() {
    // After the opener (step 1+), there's a 35% chance an objection pops up
    // before moving to the next script step
    const shouldThrowObjection =
      stepIndex >= 1 &&
      !isLastStep &&
      Math.random() < 0.35;

    if (shouldThrowObjection) {
      const randomObj = objections[Math.floor(Math.random() * objections.length)];
      setShowingObjection(randomObj);
      setRevealResponse(false);
    } else {
      if (isLastStep) {
        // call ended
        setCallsCompleted((c) => c + 1);
        setStepIndex(-1); // sentinel for "end screen"
      } else {
        setStepIndex((i) => i + 1);
      }
    }
  }

  function handleObjectionDone() {
    setShowingObjection(null);
    setRevealResponse(false);
    if (isLastStep) {
      setCallsCompleted((c) => c + 1);
      setStepIndex(-1);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function handleRestart() {
    setStepIndex(0);
    setShowingObjection(null);
  }

  if (stepIndex === -1) {
    return <EndScreen callsCompleted={callsCompleted} onRestart={handleRestart} />;
  }

  if (showingObjection) {
    return (
      <ObjectionCard
        objection={showingObjection}
        revealed={revealResponse}
        onReveal={() => setRevealResponse(true)}
        onContinue={handleObjectionDone}
      />
    );
  }

  return (
    <div>
      <ProspectBubble line={currentStep.prospectLine} />
      <RepPrompt
        prompt={currentStep.repPrompt}
        example={currentStep.repExample}
        notes={currentStep.notes}
      />
      <button onClick={handleNext}>
        {isLastStep ? "End Call" : "Next"}
      </button>
      <div className="text-xs text-gray-500 mt-4">
        Step {stepIndex + 1} of {scriptSteps.length} · {callsCompleted} calls today
      </div>
    </div>
  );
}
```

---

## UI Notes

- **Look:** dark mode, clean, looks like an actual phone call interface. Chat-style bubbles — prospect on the left, rep's prompt card below.
- **Prospect bubble:** gray background, left-aligned, small avatar circle with initials
- **Rep prompt card:** highlighted box, shows the cue at the top (what to do), then a smaller "Example wording" section, then optional coaching note at the bottom in italics
- **Objection card:** different color (red/orange tint) to signal "alert!" — shows the objection, then a big "Show me the response" button, then reveals the framing + example
- **Big "Next" button** at the bottom right, always in the same place — muscle memory matters
- **Tiny progress bar or step counter** at the bottom so they know where they are in the call

---

## Optional Phase 2 Additions (Only If You Want Them)

- **localStorage streak counter** — tracks how many calls they practice per day, shows a streak
- **"Objection-only mode"** — a separate route that just fires objections back to back, no script flow
- **Difficulty toggle** — low (10% objection chance), medium (35%), high (60%)
- **Custom script editor** — let the rep edit the script data in the UI so they can adapt it to their niche
- **Print/export the script** as a one-page PDF cheat sheet

---

## Definition of Done

- [ ] Rep clicks "Start Call" and walks through 8 script steps
- [ ] At each step, they see what the prospect said + what they should say back
- [ ] Random objections fire ~35% of the time between steps
- [ ] Objection cards have a "reveal" button so they're forced to think first
- [ ] End screen shows "Call booked!" + "Run Again" button
- [ ] Counter shows how many calls have been practiced in the session
- [ ] Works on desktop and mobile
- [ ] Zero AI calls, zero API keys, zero backend

---

## Notes for Implementation

- Keep the random objection logic dead simple — `Math.random() < 0.35`. Don't overthink it.
- The script and objections live in plain TS files. Edit them directly when the script evolves.
- If using shadcn, the `Card`, `Button`, and `Badge` components are all you need.
- The whole thing should be buildable in under a day. If it's taking longer, you're overcomplicating it.