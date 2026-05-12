import type {
  Screen,
  Mode,
  Role,
  DifficultyKey,
  GradeKey,
  Objection,
  Score,
} from './types';
import { scriptSteps } from './script';
import { objections as allObjections } from './objections';
import { DIFFICULTY, GRADES, STEP_OBJECTION_WEIGHT } from './constants';

export type State = {
  screen: Screen;
  mode: Mode;
  role: Role;
  stepIndex: number;
  currentObjection: Objection | null;
  revealed: boolean;
  graded: GradeKey | null;
  objectionGraded: GradeKey | null;
  scores: Score[];
  callsCompleted: number;
  difficulty: DifficultyKey;
  seenObjectionIds: number[];
  selectedStepId: number | null;
};

export const initialState: State = {
  screen: 'start',
  mode: 'solo',
  role: 'grader',
  stepIndex: 0,
  currentObjection: null,
  revealed: false,
  graded: null,
  objectionGraded: null,
  scores: [],
  callsCompleted: 0,
  difficulty: 'medium',
  seenObjectionIds: [],
  selectedStepId: null,
};

export type Action =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_ROLE'; role: Role }
  | { type: 'SET_DIFFICULTY'; difficulty: DifficultyKey }
  | { type: 'SET_STREAK'; count: number }
  | { type: 'START_CALL' }
  | { type: 'NEXT' }
  | { type: 'REVEAL' }
  | { type: 'GRADE_STEP'; grade: GradeKey }
  | { type: 'GRADE_OBJECTION'; grade: GradeKey }
  | { type: 'THROW_OBJECTION' }
  | { type: 'CONTINUE_AFTER_OBJECTION' }
  | { type: 'GO_TO_START' }
  | { type: 'SHOW_STEP_DETAIL'; stepId: number }
  | { type: 'CLOSE_STEP_DETAIL' };

export function validObjectionsForStep(stepId: number | undefined | null): Objection[] {
  if (stepId == null) return [];
  return allObjections.filter((o) => o.validSteps.includes(stepId));
}

function pickObjection(state: State): { objection: Objection; seenObjectionIds: number[] } {
  const currentStepId = scriptSteps[state.stepIndex].id;
  let pool = allObjections.filter(
    (o) => o.validSteps.includes(currentStepId) && !state.seenObjectionIds.includes(o.id)
  );
  if (pool.length === 0) {
    pool = allObjections.filter((o) => o.validSteps.includes(currentStepId));
  }
  if (pool.length === 0) {
    pool = allObjections.filter((o) => !state.seenObjectionIds.includes(o.id));
  }
  if (pool.length === 0) {
    pool = allObjections;
  }
  const objection = pool[Math.floor(Math.random() * pool.length)];
  return {
    objection,
    seenObjectionIds: [...state.seenObjectionIds, objection.id],
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'SET_ROLE':
      return { ...state, role: action.role };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty };
    case 'SET_STREAK':
      return { ...state, callsCompleted: action.count };
    case 'GO_TO_START':
      return { ...state, screen: 'start' };
    case 'SHOW_STEP_DETAIL':
      return { ...state, selectedStepId: action.stepId };
    case 'CLOSE_STEP_DETAIL':
      return { ...state, selectedStepId: null };
    case 'START_CALL':
      return {
        ...state,
        screen: 'call',
        stepIndex: 0,
        currentObjection: null,
        revealed: false,
        graded: null,
        objectionGraded: null,
        scores: [],
        seenObjectionIds: [],
        selectedStepId: null,
      };
    case 'REVEAL':
      return { ...state, revealed: true };
    case 'GRADE_STEP': {
      if (state.graded) return state;
      const stepId = scriptSteps[state.stepIndex].id;
      return {
        ...state,
        graded: action.grade,
        scores: [
          ...state.scores,
          { type: 'step', refId: stepId, grade: action.grade, points: GRADES[action.grade].points },
        ],
      };
    }
    case 'GRADE_OBJECTION': {
      if (state.objectionGraded || !state.currentObjection) return state;
      const stepId = scriptSteps[state.stepIndex].id;
      return {
        ...state,
        objectionGraded: action.grade,
        revealed: true,
        scores: [
          ...state.scores,
          {
            type: 'objection',
            refId: state.currentObjection.id,
            atStepId: stepId,
            grade: action.grade,
            points: GRADES[action.grade].points,
          },
        ],
      };
    }
    case 'THROW_OBJECTION': {
      const { objection, seenObjectionIds } = pickObjection(state);
      return {
        ...state,
        currentObjection: objection,
        seenObjectionIds,
        revealed: false,
        objectionGraded: null,
        screen: 'objection',
      };
    }
    case 'CONTINUE_AFTER_OBJECTION': {
      const baseReset = {
        ...state,
        currentObjection: null,
        revealed: false,
        objectionGraded: null,
      };
      if (state.mode === 'peer') {
        // peer: objection was a curveball during a step — return to the same step
        return { ...baseReset, screen: 'call' };
      }
      // solo: objection replaced a step transition, so advance
      if (state.stepIndex === scriptSteps.length - 1) {
        const next = state.callsCompleted + 1;
        return { ...baseReset, callsCompleted: next, screen: 'end' };
      }
      return { ...baseReset, stepIndex: state.stepIndex + 1, screen: 'call' };
    }
    case 'NEXT': {
      const isLast = state.stepIndex === scriptSteps.length - 1;

      if (state.mode === 'peer') {
        if (state.role === 'caller') {
          if (isLast) {
            return { ...state, screen: 'end', callsCompleted: state.callsCompleted + 1 };
          }
          return { ...state, stepIndex: state.stepIndex + 1 };
        }
        // grader
        if (isLast) {
          return { ...state, screen: 'end', callsCompleted: state.callsCompleted + 1 };
        }
        return {
          ...state,
          stepIndex: state.stepIndex + 1,
          graded: null,
        };
      }

      // solo
      const currentStepId = scriptSteps[state.stepIndex].id;
      const weight = STEP_OBJECTION_WEIGHT[currentStepId] ?? 0;
      const chance = Math.min(0.9, DIFFICULTY[state.difficulty].chance * weight);
      const hasContextualObjections = validObjectionsForStep(currentStepId).length > 0;
      const shouldThrow = !isLast && hasContextualObjections && Math.random() < chance;

      if (shouldThrow) {
        const { objection, seenObjectionIds } = pickObjection(state);
        return {
          ...state,
          currentObjection: objection,
          seenObjectionIds,
          revealed: false,
          objectionGraded: null,
          screen: 'objection',
        };
      }
      if (isLast) {
        return { ...state, screen: 'end', callsCompleted: state.callsCompleted + 1 };
      }
      return { ...state, stepIndex: state.stepIndex + 1 };
    }
    default:
      return state;
  }
}

export function totalScore(scores: Score[]): number {
  return scores.reduce((sum, s) => sum + s.points, 0);
}

export function maxScore(scores: Score[]): number {
  return scores.length * 2;
}
