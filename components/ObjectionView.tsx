'use client';

import { scriptSteps } from '@/lib/script';
import { totalScore, maxScore, type Action, type State } from '@/lib/reducer';
import { GradePanel } from './GradePanel';

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export function ObjectionView({ state, dispatch }: Props) {
  const obj = state.currentObjection;
  if (!obj) return null;

  const isPeer = state.mode === 'peer';
  const score = totalScore(state.scores);
  const max = maxScore(state.scores);

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6 sm:py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <span className="font-semibold uppercase tracking-wider text-xs">Objection incoming</span>
        </div>
        <div className="text-xs text-neutral-500 chip">
          Step {state.stepIndex + 1} / {scriptSteps.length}
          {isPeer ? ` · ${score}/${max} pts` : ''}
        </div>
      </div>

      <div className="flex items-start gap-3 mb-6 animate-slide-up">
        <div className="w-10 h-10 rounded-full bg-amber-900/40 border border-amber-700/50 flex items-center justify-center text-sm font-semibold text-amber-300 flex-shrink-0">
          P
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-amber-500/80 mb-1">
            {isPeer ? 'Throw this at the caller (read aloud)' : 'Prospect (objection)'}
          </div>
          <div
            className={`bg-amber-950/40 border border-amber-900/50 rounded-2xl rounded-tl-sm px-4 py-3 text-neutral-100 leading-relaxed ${isPeer ? 'text-lg' : 'text-[15px]'}`}
          >
            {obj.prospectLine}
          </div>
        </div>
      </div>

      {isPeer ? (
        <>
          <div
            className="bg-gradient-to-br from-amber-950/30 to-neutral-900 border border-amber-900/40 rounded-2xl p-5 mb-4 animate-slide-up"
            style={{ animationDelay: '0.05s' }}
          >
            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
              Framing
            </div>
            <div className="text-neutral-200 leading-relaxed mb-5">{obj.framing}</div>
            <div className="border-t border-neutral-800 pt-4">
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                Expected response (grade against this)
              </div>
              <div className="text-neutral-300 leading-relaxed text-[15px]">{obj.correctResponse}</div>
            </div>
          </div>
          <GradePanel
            label="Grader: how did the caller handle it?"
            graded={state.objectionGraded}
            onGrade={(grade) => dispatch({ type: 'GRADE_OBJECTION', grade })}
          />
        </>
      ) : !state.revealed ? (
        <div
          className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 text-center animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="text-neutral-400 mb-1 text-sm">Think it through first.</div>
          <div className="text-neutral-200 font-medium mb-5">How would you respond?</div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'REVEAL' })}
            className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-900/30"
          >
            Show me the response
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-950/30 to-neutral-900 border border-amber-900/40 rounded-2xl p-5 mb-4 animate-slide-up">
          <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
            Framing
          </div>
          <div className="text-neutral-200 leading-relaxed mb-5">{obj.framing}</div>
          <div className="border-t border-neutral-800 pt-4">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
              Example response
            </div>
            <div className="text-neutral-300 leading-relaxed text-[15px]">{obj.correctResponse}</div>
          </div>
        </div>
      )}

      <div className="flex-1"></div>

      {state.revealed && (
        <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent">
          <button
            type="button"
            onClick={() => dispatch({ type: 'CONTINUE_AFTER_OBJECTION' })}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold py-4 rounded-xl text-lg transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
          >
            <span>{isPeer ? 'Back to call' : 'Continue'}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
