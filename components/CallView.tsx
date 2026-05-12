'use client';

import { scriptSteps } from '@/lib/script';
import { totalScore, maxScore, validObjectionsForStep, type Action, type State } from '@/lib/reducer';
import { GradePanel } from './GradePanel';

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export function CallView({ state, dispatch }: Props) {
  const step = scriptSteps[state.stepIndex];
  const isLast = state.stepIndex === scriptSteps.length - 1;
  const total = scriptSteps.length;
  const progress = ((state.stepIndex + 1) / total) * 100;
  const isPeer = state.mode === 'peer';
  const graded = !!state.graded;
  const objAvailable = validObjectionsForStep(step.id).length > 0;
  const score = totalScore(state.scores);
  const max = maxScore(state.scores);

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span
            className={`w-2 h-2 rounded-full ${isPeer ? 'bg-amber-500' : 'bg-blue-500'} animate-pulse`}
          ></span>
          <span>{isPeer ? "Grader · You're the prospect" : 'Live call'}</span>
        </div>
        <div className="text-xs text-neutral-500 chip">
          Step {state.stepIndex + 1} / {total}
          {isPeer ? ` · ${score}/${max} pts` : ` · ${state.callsCompleted} today`}
        </div>
      </div>

      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-start gap-3 mb-6 animate-slide-up">
        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-semibold text-neutral-300 flex-shrink-0">
          P
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-neutral-500 mb-1">
            {isPeer ? 'Say this out loud to the caller' : 'Prospect'}
          </div>
          <div
            className={`bg-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 text-neutral-100 leading-relaxed ${isPeer ? 'text-lg' : ''}`}
          >
            {step.prospectLine}
          </div>
        </div>
      </div>

      <div
        className="bg-gradient-to-br from-blue-950/40 to-neutral-900 border border-blue-900/50 rounded-2xl p-5 mb-4 animate-slide-up"
        style={{ animationDelay: '0.1s' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
            {isPeer ? 'What the caller should hit' : 'Your move'}
          </div>
        </div>
        <div className="text-lg font-medium text-neutral-100 mb-4 leading-snug">{step.repPrompt}</div>
        <div className="border-t border-neutral-800 pt-4">
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
            {isPeer ? 'Expected response (grade against this)' : 'Example wording'}
          </div>
          <div className="text-neutral-300 leading-relaxed text-[15px]">{step.repExample}</div>
        </div>
        {step.notes && (
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <div className="text-xs text-amber-400/80 italic leading-relaxed">
              <span className="not-italic font-semibold">Coach: </span>
              {step.notes}
            </div>
          </div>
        )}
      </div>

      {isPeer && (
        <GradePanel
          label="Grader: how did the rep do?"
          graded={state.graded}
          onGrade={(grade) => dispatch({ type: 'GRADE_STEP', grade })}
        />
      )}

      <div className="flex-1"></div>

      <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent">
        {isPeer ? (
          <>
            <div className="grid grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: 'THROW_OBJECTION' })}
                disabled={!objAvailable}
                className={`col-span-2 ${
                  objAvailable
                    ? 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 shadow-lg shadow-amber-900/30 cursor-pointer'
                    : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                } text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-2`}
                title={objAvailable ? 'Throw a contextual objection at the rep' : 'No objections fit at this step'}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
                <span>Throw Objection</span>
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'NEXT' })}
                disabled={!graded}
                className={`col-span-3 ${
                  graded
                    ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-lg shadow-blue-900/30'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                } text-white font-semibold py-4 rounded-xl text-lg transition flex items-center justify-center gap-2`}
              >
                <span>{isLast ? 'End Call' : 'Next'}</span>
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
            {!graded && (
              <div className="text-center text-xs text-neutral-500 mt-2">
                Grade the step before moving on.
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => dispatch({ type: 'NEXT' })}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
          >
            <span>{isLast ? 'End Call' : 'Next'}</span>
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
        )}
      </div>
    </div>
  );
}
