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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>You&apos;re calling · Caller</span>
        </div>
        <div className="text-xs text-neutral-500 chip">
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
