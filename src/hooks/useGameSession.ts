'use client';

import { useCallback, useRef, useState } from 'react';

import type { GameMode, QuestionMode } from '@/content/types';
import {
  INITIAL_GAME_STATE,
  gameReducer,
  toSessionResult,
  type GameAction,
  type GameState,
} from '@/lib/game/game-reducer';
import type { SessionItem } from '@/lib/game/session';
import { applySessionResult, type SessionOutcome } from '@/lib/progress/apply-session';
import type { Progress } from '@/lib/progress/types';
import { getSnapshot, updateProgress } from '@/lib/storage/progress-client';

interface UseGameSessionOptions {
  mode: QuestionMode | 'review';
  topicId?: string;
  modesByTopic: Readonly<Record<string, readonly GameMode[]>>;
  /** Builds the round's questions from current progress when the learner presses start. */
  buildItems: (progress: Progress) => SessionItem[];
}

/**
 * Runs one game round. The result is recorded to progress in the same transition
 * that ends the round — not in an effect — so it is written exactly once.
 */
export function useGameSession({ mode, topicId, modesByTopic, buildItems }: UseGameSessionOptions) {
  const [state, setState] = useState<GameState>(INITIAL_GAME_STATE);
  const [outcome, setOutcome] = useState<SessionOutcome | null>(null);
  const stateRef = useRef<GameState>(INITIAL_GAME_STATE);

  const dispatch = useCallback(
    (action: GameAction) => {
      const previous = stateRef.current;
      const next = gameReducer(previous, action);
      if (next === previous) return;
      stateRef.current = next;
      setState(next);

      if (next.phase === 'finished' && previous.phase !== 'finished' && next.answers.length > 0) {
        const result = toSessionResult(next, mode, topicId);
        const now = new Date().toISOString();
        let recorded: SessionOutcome | null = null;
        updateProgress((progress) => {
          recorded = applySessionResult(progress, result, modesByTopic, now);
          return recorded.progress;
        });
        setOutcome(recorded);
      }
    },
    [mode, topicId, modesByTopic],
  );

  const start = useCallback(() => {
    setOutcome(null);
    stateRef.current = INITIAL_GAME_STATE;
    dispatch({ type: 'start', items: buildItems(getSnapshot()) });
  }, [buildItems, dispatch]);

  const answer = useCallback(
    (isCorrect: boolean, given: string) => dispatch({ type: 'answer', isCorrect, given }),
    [dispatch],
  );
  const next = useCallback(() => dispatch({ type: 'next' }), [dispatch]);
  const finish = useCallback(() => dispatch({ type: 'finish' }), [dispatch]);
  const hint = useCallback(() => dispatch({ type: 'hint' }), [dispatch]);

  return { state, outcome, start, answer, next, finish, hint };
}
