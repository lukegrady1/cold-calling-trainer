'use client';

import { scriptSteps } from '@/lib/script';
import { GRADES } from '@/lib/constants';
import { totalScore, maxScore, type Action, type State } from '@/lib/reducer';
import type { ObjectionScore, StepScore } from '@/lib/types';
import { StepDetail } from './StepDetail';

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export function EndView({ state, dispatch }: Props) {
  const isPeer = state.mode === 'peer';
  const total = totalScore(state.scores);
  const max = maxScore(state.scores);
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
  const stepScores = state.scores.filter((s): s is StepScore => s.type === 'step');
  const objScores = state.scores.filter((s): s is ObjectionScore => s.type === 'objection');
  const objSolid = objScores.filter((s) => s.grade === 'solid').length;
  const hasScoring = isPeer && max > 0;
  const detailOpen = hasScoring && state.selectedStepId != null;

  let verdict = 'Keep going.';
  let verdictColor = 'text-neutral-400';
  if (pct >= 90) {
    verdict = 'Crushed it.';
    verdictColor = 'text-emerald-400';
  } else if (pct >= 70) {
    verdict = 'Solid call.';
    verdictColor = 'text-emerald-400';
  } else if (pct >= 50) {
    verdict = 'Decent — clean up the rough spots.';
    verdictColor = 'text-amber-400';
  } else if (max > 0) {
    verdict = 'Run it again. Reps fix this.';
    verdictColor = 'text-rose-400';
  }

  const scoreCard = hasScoring ? (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-left">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-xs uppercase tracking-wider text-neutral-500">Final score</div>
        <div className={`${verdictColor} text-sm font-semibold`}>{verdict}</div>
      </div>
      <div className="flex items-end justify-between mb-4">
        <div className="text-5xl font-bold text-emerald-400 chip">
          {total}
          <span className="text-2xl text-neutral-600">/{max}</span>
        </div>
        <div className="text-3xl font-semibold text-neutral-300 chip">{pct}%</div>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        ></div>
      </div>

      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
        Step-by-step <span className="text-neutral-600 normal-case">(tap a box for details)</span>
      </div>
      <div className="grid grid-cols-8 gap-1 mb-4">
        {scriptSteps.map((s, i) => {
          const score = stepScores.find((x) => x.refId === s.id);
          const g = score ? GRADES[score.grade] : null;
          const bg = g ? `bg-${g.color}-600` : 'bg-neutral-800';
          const isSel = state.selectedStepId === s.id;
          const ring = isSel
            ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900'
            : 'hover:ring-2 hover:ring-white/30';
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => dispatch({ type: 'SHOW_STEP_DETAIL', stepId: s.id })}
              className={`aspect-square ${bg} rounded flex items-center justify-center text-[11px] font-bold text-white/90 transition ${ring} cursor-pointer`}
              title={`Step ${i + 1}: ${g ? g.label : 'not graded'}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {objScores.length > 0 && (
        <div className="border-t border-neutral-800 pt-3 flex items-center justify-between text-sm">
          <span className="text-neutral-400">Objections handled</span>
          <span className="text-neutral-200 font-semibold">
            {objSolid} solid / {objScores.length} thrown
          </span>
        </div>
      )}
    </div>
  ) : (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
        Calls practiced today
      </div>
      <div className="text-4xl font-bold text-emerald-400 chip">{state.callsCompleted}</div>
    </div>
  );

  const buttons = (
    <>
      <button
        type="button"
        onClick={() => dispatch({ type: 'START_CALL' })}
        className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold py-4 rounded-xl text-lg transition shadow-lg shadow-emerald-900/30 mb-3"
      >
        Run Again
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: 'GO_TO_START' })}
        className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium py-3 rounded-xl transition border border-neutral-800"
      >
        Back to start
      </button>
    </>
  );

  return (
    <div className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      <div className={`${detailOpen ? 'max-w-5xl' : 'max-w-md'} w-full`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-emerald-400"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Appointment booked.</h2>
          <p className="text-neutral-400">Nice work. Now run it again.</p>
        </div>

        {detailOpen && state.selectedStepId != null ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
              <div className="lg:col-span-2">{scoreCard}</div>
              <div className="lg:col-span-3 animate-slide-up">
                <StepDetail
                  stepId={state.selectedStepId}
                  scores={state.scores}
                  onClose={() => dispatch({ type: 'CLOSE_STEP_DETAIL' })}
                />
              </div>
            </div>
            <div className="max-w-md mx-auto">{buttons}</div>
          </>
        ) : (
          <>
            <div className="mb-6">{scoreCard}</div>
            {buttons}
          </>
        )}
      </div>
    </div>
  );
}
