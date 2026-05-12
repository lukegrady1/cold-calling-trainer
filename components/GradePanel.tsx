'use client';

import { GRADES } from '@/lib/constants';
import type { GradeKey } from '@/lib/types';

type Props = {
  label: string;
  graded: GradeKey | null;
  onGrade: (g: GradeKey) => void;
};

export function GradePanel({ label, graded, onGrade }: Props) {
  return (
    <div
      className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 mb-4 animate-slide-up"
      style={{ animationDelay: '0.05s' }}
    >
      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-3 text-center">
        {graded ? 'Graded' : label}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(GRADES) as [GradeKey, (typeof GRADES)[GradeKey]][]).map(([key, g]) => {
          const active = graded === key;
          const base = active
            ? `bg-${g.color}-600 text-white border-${g.color}-500 shadow-lg shadow-${g.color}-900/30`
            : `bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-${g.color}-700 hover:text-white`;
          const dim = graded && !active ? 'opacity-40' : '';
          return (
            <button
              key={key}
              type="button"
              onClick={() => onGrade(key)}
              disabled={!!graded}
              className={`border rounded-xl py-3 px-2 transition flex flex-col items-center gap-1 ${base} ${dim} ${graded ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="text-2xl leading-none">{g.emoji}</div>
              <div className="text-xs font-semibold">{g.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
