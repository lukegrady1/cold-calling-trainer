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
  | { type: 'BACK' }
  | { type: 'REVEAL' }
  | { type: 'GRADE_STEP'; grade: GradeKey }
  | { type: 'GRADE_OBJECTION'; grade: GradeKey }
  | { type: 'THROW_OBJECTION' }
  | { type: 'DISMISS_OBJECTION' }
  | { type: 'CONTINUE_AFTER_OBJECTION' }
  | { type: 'GO_TO_START' }
  | { type: 'SHOW_STEP_DETAIL'; stepId: number }
  | { type: 'CLOSE_STEP_DETAIL' };

export function validObjectionsForStep(stepId: number | undefined | null): Objection[] {
  if (stepId == null) return [];
  return allObjections.filter((o) => o.validSteps.includes(stepId));
}

function allowedByDifficulty(o: Objection, difficulty: DifficultyKey): boolean {
  if (o.hardOnly && difficulty !== 'high') return false;
  return true;
}

function pickObjection(
  state: State,
  opts?: { stepId?: number; excludeId?: number }
): { objection: Objection; seenObjectionIds: number[] } {
  const currentStepId = opts?.stepId ?? scriptSteps[state.stepIndex].id;
  const excludeId = opts?.excludeId;
  const tries: ((o: Objection) => boolean)[] = [
    (o) =>
      o.validSteps.includes(currentStepId) &&
      !state.seenObjectionIds.includes(o.id) &&
      o.id !== excludeId &&
      allowedByDifficulty(o, state.difficulty),
    (o) =>
      o.validSteps.includes(currentStepId) &&
      o.id !== excludeId &&
      allowedByDifficulty(o, state.difficulty),
    (o) =>
      !state.seenObjectionIds.includes(o.id) &&
      o.id !== excludeId &&
      allowedByDifficulty(o, state.difficulty),
    (o) => allowedByDifficulty(o, state.difficulty),
  ];
  let pool: Objection[] = [];
  for (const filter of tries) {
    pool = allObjections.filter(filter);
    if (pool.length > 0) break;
  }
  if (pool.length === 0) pool = allObjections;
  const objection = pool[Math.floor(Math.random() * pool.length)];
  return {
    objection,
    seenObjectionIds: [...state.seenObjectionIds, objection.id],
  };
}

// Hard-mode chance to immediately follow one objection with another.
const BACK_TO_BACK_CHANCE = 0.35;

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
      const stepId = scriptSteps[state.stepIndex].id;
      // Replace any prior grade for this step so going back-and-forward
      // doesn't double-count.
      const without = state.scores.filter(
        (s) => !(s.type === 'step' && s.refId === stepId)
      );
      return {
        ...state,
        graded: action.grade,
        scores: [
          ...without,
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
    case 'DISMISS_OBJECTION': {
      return {
        ...state,
        currentObjection: null,
        revealed: false,
        objectionGraded: null,
        screen: 'call',
      };
    }
    case 'BACK': {
      if (state.stepIndex === 0) return state;
      const prevStepIndex = state.stepIndex - 1;
      const prevStepId = scriptSteps[prevStepIndex].id;
      // Restore the graded marker for the step we're returning to (peer mode)
      // so the UI reflects whether it was already graded.
      const prevStepScore = state.scores.find(
        (s) => s.type === 'step' && s.refId === prevStepId
      );
      return {
        ...state,
        stepIndex: prevStepIndex,
        graded: prevStepScore?.grade ?? null,
        // Drop any lingering objection state — back navigates from a step view.
        currentObjection: null,
        revealed: false,
        objectionGraded: null,
        screen: 'call',
      };
    }
    case 'CONTINUE_AFTER_OBJECTION': {
      const justResolved = state.currentObjection;
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
      // solo: pick the step we resume at. If the objection specified a
      // continueAtStep, jump there (the rep's response moved the call past
      // one or more scripted lines). Otherwise advance by one.
      let nextIndex = state.stepIndex + 1;
      if (justResolved?.continueAtStep != null) {
        const targetIdx = scriptSteps.findIndex((s) => s.id === justResolved.continueAtStep);
        if (targetIdx > state.stepIndex) {
          nextIndex = targetIdx;
        }
      }
      if (nextIndex >= scriptSteps.length) {
        const next = state.callsCompleted + 1;
        return { ...baseReset, callsCompleted: next, screen: 'end' };
      }
      // Hard mode: chance to immediately throw a second objection at the new step
      if (state.difficulty === 'high' && Math.random() < BACK_TO_BACK_CHANCE) {
        const nextStepId = scriptSteps[nextIndex].id;
        const advanced: State = { ...baseReset, stepIndex: nextIndex };
        const { objection, seenObjectionIds } = pickObjection(advanced, {
          stepId: nextStepId,
          excludeId: justResolved?.id,
        });
        if (objection.validSteps.includes(nextStepId)) {
          return {
            ...advanced,
            currentObjection: objection,
            seenObjectionIds,
            screen: 'objection',
          };
        }
      }
      return { ...baseReset, stepIndex: nextIndex, screen: 'call' };
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
