'use client';

import { useCallback, useRef, useState } from 'react';

import type { GameMode, Level, RoundMode } from '@/content/types';
import { dailyKey } from '@/lib/game/daily';
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
import { trackRound } from '@/lib/analytics/track';
import { requestPersistence } from '@/lib/storage/persistence';
import { getSnapshot, updateProgress } from '@/lib/storage/progress-client';

interface UseGameSessionOptions {
  mode: RoundMode;
  topicId?: string;
  modesByTopic: Readonly<Record<string, readonly GameMode[]>>;
  /** Builds the round's questions from current progress when the learner presses start. */
  buildItems: (progress: Progress) => SessionItem[];
  /** Blitz without the clock: recorded under its own bests. */
  untimed?: boolean;
  /** Show each question's hint up front. */
  autoHint?: boolean;
  /** Level tests only: the level being tested. */
  examLevel?: Level;
}

/**
 * Runs one game round. The result is recorded to progress in the same transition
 * that ends the round — not in an effect — so it is written exactly once.
 */
export function useGameSession({
  mode,
  topicId,
  modesByTopic,
  buildItems,
  untimed = false,
  autoHint = false,
  examLevel,
}: UseGameSessionOptions) {
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
        const result = {
          ...toSessionResult(next, mode, topicId),
          ...(mode === 'daily' ? { dailyDate: dailyKey(new Date()) } : {}),
          ...(mode === 'sort' && untimed ? { untimed: true } : {}),
          ...(mode === 'exam' && examLevel ? { examLevel } : {}),
        };
        const now = new Date().toISOString();
        let recorded: SessionOutcome | null = null;
        updateProgress((progress) => {
          recorded = applySessionResult(progress, result, modesByTopic, now);
          return recorded.progress;
        });
        setOutcome(recorded);
        // A finished round is real use: ask the browser to keep this site's storage.
        void requestPersistence();
        trackRound(mode, topicId);
      }
    },
    [mode, topicId, modesByTopic, untimed, examLevel],
  );

  const start = useCallback(() => {
    setOutcome(null);
    stateRef.current = INITIAL_GAME_STATE;
    dispatch({ type: 'start', items: buildItems(getSnapshot()), autoHint });
  }, [buildItems, dispatch, autoHint]);

  const answer = useCallback(
    (isCorrect: boolean, given: string) => dispatch({ type: 'answer', isCorrect, given }),
    [dispatch],
  );
  const next = useCallback(() => dispatch({ type: 'next' }), [dispatch]);
  const finish = useCallback(() => dispatch({ type: 'finish' }), [dispatch]);
  const hint = useCallback(() => dispatch({ type: 'hint' }), [dispatch]);

  return { state, outcome, start, answer, next, finish, hint };
}
