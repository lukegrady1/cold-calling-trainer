'use client';

import { DIFFICULTY } from '@/lib/constants';
import { basePath } from '@/lib/basePath';
import type { Action, State } from '@/lib/reducer';
import type { DifficultyKey, Mode, Role } from '@/lib/types';

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export function StartScreen({ state, dispatch }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden shadow-lg shadow-blue-900/40 mb-6">
          <img
            src={`${basePath}/logo.png`}
            alt="GD logo"
            className="w-full h-full object-cover"
            width={80}
            height={80}
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Cold Calling Trainer</h1>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          Walk the script. Hear what the prospect says. Practice your line out loud. Get hit with objections to stay sharp.
        </p>

        <div className="mb-5">
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Mode</div>
          <div className="grid grid-cols-2 gap-2">
            {(['solo', 'peer'] as Mode[]).map((m) => {
              const active = state.mode === m;
              const labels: Record<Mode, { title: string; sub: string }> = {
                solo: { title: 'Solo', sub: 'Random objections' },
                peer: { title: 'Peer (graded)', sub: 'Partner grades + throws curveballs' },
              };
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => dispatch({ type: 'SET_MODE', mode: m })}
                  className={`px-4 py-3 rounded-lg border text-left transition ${
                    active
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <div className="font-semibold text-sm">{labels[m].title}</div>
                  <div className="text-xs opacity-70 mt-0.5">{labels[m].sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {state.mode === 'solo' ? (
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Difficulty</div>
            <div className="inline-flex rounded-lg bg-neutral-900 border border-neutral-800 p-1">
              {(Object.entries(DIFFICULTY) as [DifficultyKey, (typeof DIFFICULTY)[DifficultyKey]][]).map(
                ([key, d]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_DIFFICULTY', difficulty: key })}
                    className={`px-4 py-1.5 text-sm rounded-md transition ${
                      state.difficulty === key
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                )
              )}
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              ~{Math.round(DIFFICULTY[state.difficulty].chance * 100)}% objection chance per step
              {state.difficulty === 'high' && (
                <span className="block text-amber-500/80 mt-1">
                  Hard mode can chain back-to-back objections.
                </span>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Your role</div>
              <div className="grid grid-cols-2 gap-2">
                {(['grader', 'caller'] as Role[]).map((r) => {
                  const active = state.role === r;
                  const labels: Record<Role, { title: string; sub: string; activeClass: string }> = {
                    grader: {
                      title: "I'm the Grader",
                      sub: 'Play the prospect on the phone',
                      activeClass: 'bg-amber-600/20 border-amber-500 text-white',
                    },
                    caller: {
                      title: "I'm the Caller",
                      sub: 'Make the call, follow your cues',
                      activeClass: 'bg-blue-600/20 border-blue-500 text-white',
                    },
                  };
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => dispatch({ type: 'SET_ROLE', role: r })}
                      className={`px-4 py-3 rounded-lg border text-left transition ${
                        active
                          ? labels[r].activeClass
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-semibold text-sm">{labels[r].title}</div>
                      <div className="text-xs opacity-70 mt-0.5">{labels[r].sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {state.role === 'grader' ? (
              <div className="mb-6 p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg text-left">
                <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
                  You&apos;re the grader
                </div>
                <ul className="text-sm text-neutral-300 space-y-1.5 leading-relaxed">
                  <li>
                    <span className="text-amber-400">•</span> Each step shows the prospect line —{' '}
                    <span className="font-semibold text-white">read it out loud</span> to the caller.
                  </li>
                  <li>
                    <span className="text-amber-400">•</span> Their expected response sits below it so you can grade against it.
                  </li>
                  <li>
                    <span className="text-amber-400">•</span> Pick 👍 / 😐 / 👎 based on how they delivered it.
                  </li>
                  <li>
                    <span className="text-amber-400">•</span> Hit{' '}
                    <span className="text-amber-400 font-semibold">Throw Objection</span> to read a contextual curveball aloud, then grade their handling.
                  </li>
                  <li>
                    <span className="text-amber-400">•</span> Final score appears at the end.
                  </li>
                </ul>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg text-left">
                <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-2">
                  You&apos;re the caller
                </div>
                <ul className="text-sm text-neutral-300 space-y-1.5 leading-relaxed">
                  <li>
                    <span className="text-blue-400">•</span> Your screen shows the{' '}
                    <span className="font-semibold text-white">cue</span> for each step — what you&apos;re supposed to convey.
                  </li>
                  <li>
                    <span className="text-blue-400">•</span> Make the call. Listen to the grader (the prospect) on the phone and respond from the cue.
                  </li>
                  <li>
                    <span className="text-blue-400">•</span> No prospect lines or example wording on your screen — pull it from memory.
                  </li>
                  <li>
                    <span className="text-blue-400">•</span> Hit Next to move to your next cue whenever you&apos;ve delivered your line.
                  </li>
                </ul>
              </div>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => dispatch({ type: 'START_CALL' })}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition shadow-lg shadow-blue-900/30"
        >
          Start Call
        </button>

        {state.callsCompleted > 0 && (
          <div className="mt-6 text-sm text-neutral-500">
            <span className="text-blue-400 font-semibold">{state.callsCompleted}</span> call
            {state.callsCompleted === 1 ? '' : 's'} practiced today
          </div>
        )}
      </div>
    </div>
  );
}
