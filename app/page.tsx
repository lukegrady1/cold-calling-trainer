'use client';

import { useEffect, useReducer, useRef } from 'react';
import { reducer, initialState } from '@/lib/reducer';
import { loadStreak, saveStreak } from '@/lib/streak';
import { StartScreen } from '@/components/StartScreen';
import { CallView } from '@/components/CallView';
import { CallerCallView } from '@/components/CallerCallView';
import { ObjectionView } from '@/components/ObjectionView';
import { EndView } from '@/components/EndView';

export default function TrainerPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydratedRef = useRef(false);

  // Hydrate streak from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const count = loadStreak();
    if (count > 0) dispatch({ type: 'SET_STREAK', count });
  }, []);

  // Persist streak whenever it changes.
  useEffect(() => {
    if (!hydratedRef.current) return;
    saveStreak(state.callsCompleted);
  }, [state.callsCompleted]);

  const isCaller = state.mode === 'peer' && state.role === 'caller';

  return (
    <div className="min-h-screen flex flex-col">
      {state.screen === 'start' && <StartScreen state={state} dispatch={dispatch} />}
      {state.screen === 'call' &&
        (isCaller ? (
          <CallerCallView state={state} dispatch={dispatch} />
        ) : (
          <CallView state={state} dispatch={dispatch} />
        ))}
      {state.screen === 'objection' && <ObjectionView state={state} dispatch={dispatch} />}
      {state.screen === 'end' && <EndView state={state} dispatch={dispatch} />}
    </div>
  );
}
