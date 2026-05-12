'use client';

import { scriptSteps } from '@/lib/script';
import { objections } from '@/lib/objections';
import { GRADES } from '@/lib/constants';
import type { ObjectionScore, Score, StepScore } from '@/lib/types';

type Props = {
  stepId: number;
  scores: Score[];
  onClose: () => void;
};

export function StepDetail({ stepId, scores, onClose }: Props) {
  const step = scriptSteps.find((s) => s.id === stepId);
  if (!step) return null;

  const stepScore = scores.find(
    (s): s is StepScore => s.type === 'step' && s.refId === stepId
  );
  const g = stepScore ? GRADES[stepScore.grade] : null;
  const stepObjections = scores.filter(
    (s): s is ObjectionScore => s.type === 'objection' && s.atStepId === stepId
  );

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-left">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
            Step {stepId} detail
          </div>
          {g ? (
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-${g.color}-600/20 border border-${g.color}-700/40 text-${g.color}-300 text-xs font-semibold`}
            >
              <span>{g.emoji}</span>
              <span>
                {g.label} · {g.points}/2 pts
              </span>
            </div>
          ) : (
            <div className="text-xs text-neutral-500">Not graded</div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-neutral-500 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-800 transition flex-shrink-0"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Prospect said</div>
          <div className="text-neutral-300 leading-relaxed text-[15px]">
            &quot;{step.prospectLine}&quot;
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
            What you were supposed to hit
          </div>
          <div className="text-neutral-100 leading-relaxed">{step.repPrompt}</div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
            {g && g.points < 2 ? 'What you should have said' : 'Example wording'}
          </div>
          <div className="text-neutral-300 leading-relaxed text-[15px] italic">
            &quot;{step.repExample}&quot;
          </div>
        </div>

        {step.notes && g && g.points < 2 && (
          <div className="bg-amber-950/30 border border-amber-900/40 rounded-lg p-3">
            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
              Coach
            </div>
            <div className="text-amber-200/90 text-sm leading-relaxed italic">{step.notes}</div>
          </div>
        )}

        {stepObjections.length > 0 && (
          <div className="border-t border-neutral-800 pt-4">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
              Objections thrown at this step
            </div>
            <div className="space-y-2">
              {stepObjections.map((s, idx) => {
                const obj = objections.find((o) => o.id === s.refId);
                const og = GRADES[s.grade];
                if (!obj) return null;
                return (
                  <div
                    key={`${s.refId}-${idx}`}
                    className="bg-neutral-950/60 border border-neutral-800 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-sm font-medium text-neutral-200 leading-snug">
                        &quot;{obj.prospectLine}&quot;
                      </div>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-${og.color}-600/20 border border-${og.color}-700/40 text-${og.color}-300 text-[11px] font-semibold flex-shrink-0`}
                      >
                        <span>{og.emoji}</span>
                        <span>{og.label}</span>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400 leading-relaxed">
                      <span className="font-semibold text-neutral-300">
                        {og.points < 2 ? 'Should have said' : 'Example response'}:{' '}
                      </span>
                      {obj.correctResponse}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
