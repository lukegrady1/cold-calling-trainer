export type Step = {
  id: number;
  prospectLine: string;
  repPrompt: string;
  repExample: string;
  notes?: string;
};

export type Objection = {
  id: number;
  prospectLine: string;
  correctResponse: string;
  framing: string;
  validSteps: number[];
  // If set, the conversation jumps to this step's prospectLine after the
  // objection resolves (instead of advancing one step). Use when the rep's
  // response moves the call past one or more scripted lines.
  continueAtStep?: number;
  // Only thrown when difficulty is 'high'. Used for aggressive / hostile
  // prospect variants that would feel out of place in easy/medium mode.
  hardOnly?: boolean;
};

export type GradeKey = 'solid' | 'okay' | 'missed';

export type Grade = {
  label: string;
  emoji: string;
  points: number;
  color: 'emerald' | 'amber' | 'rose';
};

export type Mode = 'solo' | 'peer';
export type Role = 'grader' | 'caller';
export type Screen = 'start' | 'call' | 'objection' | 'end';
export type DifficultyKey = 'low' | 'medium' | 'high';

export type Difficulty = {
  label: string;
  chance: number;
};

export type StepScore = {
  type: 'step';
  refId: number;
  grade: GradeKey;
  points: number;
};

export type ObjectionScore = {
  type: 'objection';
  refId: number;
  atStepId: number;
  grade: GradeKey;
  points: number;
};

export type Score = StepScore | ObjectionScore;
