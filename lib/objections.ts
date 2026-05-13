import type { Objection } from './types';

// `validSteps` = the step ID the rep just delivered when this objection can plausibly come back.
// e.g. "Too expensive" only makes sense AFTER the rep has quoted the price (step 5).
// "How did you get my number?" only makes sense EARLY, after the intro (step 1-2).
export const objections: Objection[] = [
  {
    id: 1,
    prospectLine: "We don't need a website — we already have enough business.",
    correctResponse:
      "I totally understand, I hear that all the time. The reason this still works is it lets you charge MORE for the same service. If you're already turning away business, you can quote the overflow at a higher price — if they say yes, you just made money you wouldn't have. If no, you're in the exact same spot you were.",
    framing:
      "AGREE FIRST. Then reframe — it's not about more leads, it's about charging more for the leads you already turn away.",
    validSteps: [3, 4],
  },
  {
    id: 2,
    prospectLine: 'Sounds too expensive.',
    correctResponse:
      "Totally hear you. Quick question — what do you usually charge for a job? [Let them answer, usually $4-10k for contractors.] Okay so I'm only $97 a month. If this gets you ONE job a year, that's a 4x return minimum. If I can't get you at least one job a year I'd probably just go play in traffic.",
    framing:
      "5th grade math. Make it feel impossible they wouldn't ROI. End with the 'play in traffic' joke to keep it light.",
    validSteps: [5],
  },
  {
    id: 3,
    prospectLine: 'We already have a website.',
    correctResponse:
      "Cool, when's the last time it got you a job? [Or:] Got it, but you don't have a Google Business Profile set up right? That's actually where most of the leads come from these days.",
    framing:
      "Pivot to whichever piece they're missing. Or open the conversation about whether their current site is actually performing.",
    validSteps: [3],
  },
  {
    id: 4,
    prospectLine: "Just send me an email and I'll look at it.",
    correctResponse:
      "Yeah for sure, I can do that. But real quick — what's the best time? Tomorrow at 10 or 2? It'll only take 10 minutes and you'll get way more out of it than reading an email.",
    framing: "Soft brush-off. Don't accept it. Pivot back to booking a specific time.",
    validSteps: [4, 5],
  },
  {
    id: 5,
    prospectLine: 'How did you get my number?',
    correctResponse:
      "Honestly? Found you on Google. You've got great reviews — that's actually why I'm calling. Figured a business that's clearly doing good work deserves to be found by more people.",
    framing: 'Stay calm. Be honest. Flip it into a compliment.',
    validSteps: [1, 2],
    // Rep already explained the source (Google reviews), so don't snap back
    // to the Julie Becker brush-off — jump straight to "so what's this about?"
    continueAtStep: 3,
  },
  {
    id: 6,
    prospectLine: "I'm not interested.",
    correctResponse:
      "Totally fair, appreciate you being upfront. Can I ask what specifically — is it the timing, the cost, or just not a fit right now? Just trying to learn so my next call goes better.",
    framing:
      "Don't argue. Don't push. Ask what's underneath it — the answer tells you whether to follow up later or move on.",
    validSteps: [3, 4, 5],
  },
  {
    id: 7,
    prospectLine: "All my business comes from word of mouth, I don't need that internet stuff.",
    correctResponse:
      "That's awesome, honestly — word of mouth is the best marketing there is. Quick question though, when someone refers you, what do you think they do before calling? They Google you. If you don't show up or you've got no reviews, you've probably already lost some of those referrals without ever knowing.",
    framing:
      'Agree with them. Then show that even word-of-mouth leads check you out online before calling.',
    validSteps: [3, 4],
  },
  {
    id: 8,
    prospectLine: "I'm busy right now, can you call me back?",
    correctResponse:
      "Totally, won't keep you. When's a good time — later today around 3, or tomorrow morning? I'll only need 5 minutes.",
    framing:
      "Don't say 'sure I'll call back'. Pin them to a specific time right now or you'll never reach them again.",
    validSteps: [1, 2],
  },
];
