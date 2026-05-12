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
