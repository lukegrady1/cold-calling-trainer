import type { Grade, GradeKey, Difficulty, DifficultyKey } from './types';

export const GRADES: Record<GradeKey, Grade> = {
  solid: { label: 'Solid', emoji: '👍', points: 2, color: 'emerald' },
  okay: { label: 'Okay', emoji: '😐', points: 1, color: 'amber' },
  missed: { label: 'Missed', emoji: '👎', points: 0, color: 'rose' },
};

export const DIFFICULTY: Record<DifficultyKey, Difficulty> = {
  low: { label: 'Easy', chance: 0.1 },
  medium: { label: 'Medium', chance: 0.35 },
  high: { label: 'Hard', chance: 0.6 },
};

// Per-step multiplier on the difficulty's base chance.
// Objections happen way more often early/mid call than during the close.
export const STEP_OBJECTION_WEIGHT: Record<number, number> = {
  1: 1.6, // after rep's intro — "how'd you get my number", "I'm busy"
  2: 1.5, // after referral brush-off
  3: 1.8, // after "you don't have a website right?" — peak objection territory
  4: 1.6, // after the pitch — "don't need it", "word of mouth", "send email"
  5: 1.0, // after the price quote — "too expensive", "send email"
  6: 0.3, // already closing
  7: 0.1, // basically done
  8: 0, // soft close — never
};
