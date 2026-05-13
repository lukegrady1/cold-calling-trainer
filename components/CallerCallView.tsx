'use client';

import { scriptSteps } from '@/lib/script';
import type { Action, State } from '@/lib/reducer';

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export function CallerCallView({ state, dispatch }: Props) {
  const step = scriptSteps[state.stepIndex];
  const isLast = state.stepIndex === scriptSteps.length - 1;
  const total = scriptSteps.length;
  const progress = ((state.stepIndex + 1) / total) * 100;

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6 gap-2">
        <div className="flex items-center gap-1 min-w-0">
          <button
            type="button"
            onClick={() => dispatch({ type: 'GO_TO_START' })}
            className="p-2 -ml-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            aria-label="Back to start"
            title="Back to start"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'BACK' })}
            disabled={state.stepIndex === 0}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:text-neutral-700 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
            aria-label="Previous step"
            title={state.stepIndex === 0 ? 'Already on first step' : 'Previous step'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-2 text-sm text-neutral-400 ml-1 min-w-0">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></span>
            <span className="truncate">You&apos;re calling · Caller</span>
          </div>
        </div>
        <div className="text-xs text-neutral-500 chip flex-shrink-0">
          Step {state.stepIndex + 1} / {total}
        </div>
      </div>

      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-gradient-to-br from-blue-950/40 to-neutral-900 border border-blue-900/50 rounded-2xl p-6 sm:p-8 mb-4 animate-slide-up">
        <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-4">
          Your cue
        </div>
        <div className="text-2xl sm:text-3xl font-semibold text-neutral-100 leading-snug mb-4">
          {step.repPrompt}
        </div>
        {step.notes && (
          <div className="border-t border-neutral-800 pt-4 mt-4">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Coach note</div>
            <div className="text-sm text-amber-400/80 italic leading-relaxed">{step.notes}</div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-neutral-500 mb-2 italic">
        Listen for the prospect&apos;s line, then deliver your move from memory.
      </div>

      <div className="flex-1"></div>

      <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent">
        <button
          type="button"
          onClick={() => dispatch({ type: 'NEXT' })}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
        >
          <span>{isLast ? 'End Call' : 'Next cue'}</span>
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
    </div>
  );
}
