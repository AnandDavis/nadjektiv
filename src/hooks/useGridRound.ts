'use client';

import { useCallback, useRef, useState } from 'react';

import type { GameMode, GridPuzzle } from '@/content/types';
import {
  finishGridRound,
  gridSessionResult,
  startGridRound,
  typeInCell,
  type CellKey,
  type GridRoundState,
} from '@/lib/grid/grid-round';
import { applySessionResult, type SessionOutcome } from '@/lib/progress/apply-session';
import { trackRound } from '@/lib/analytics/track';
import { requestPersistence } from '@/lib/storage/persistence';
import { updateProgress } from '@/lib/storage/progress-client';

interface UseGridRoundOptions {
  topicId: string;
  modesByTopic: Readonly<Record<string, readonly GameMode[]>>;
}

/**
 * Runs one grid-fill round. The result is recorded to progress in the same transition
 * that ends the round (all cells solved, Fertig, or time up), so it's written once.
 */
export function useGridRound({ topicId, modesByTopic }: UseGridRoundOptions) {
  const [grid, setGrid] = useState<GridPuzzle | null>(null);
  const [state, setState] = useState<GridRoundState | null>(null);
  const [outcome, setOutcome] = useState<SessionOutcome | null>(null);
  const stateRef = useRef<GridRoundState | null>(null);
  const gridRef = useRef<GridPuzzle | null>(null);

  const commit = useCallback(
    (next: GridRoundState) => {
      const previous = stateRef.current;
      const currentGrid = gridRef.current;
      if (next === previous || !currentGrid) return;
      stateRef.current = next;
      setState(next);
      if (next.phase === 'finished' && previous?.phase !== 'finished') {
        const result = gridSessionResult(next, currentGrid, topicId);
        const now = new Date().toISOString();
        let recorded: SessionOutcome | null = null;
        updateProgress((progress) => {
          recorded = applySessionResult(progress, result, modesByTopic, now);
          return recorded.progress;
        });
        setOutcome(recorded);
        // A finished round is real use: ask the browser to keep this site's storage.
        void requestPersistence();
        trackRound('grid', topicId);
      }
    },
    [topicId, modesByTopic],
  );

  const start = useCallback((next: GridPuzzle) => {
    const fresh = startGridRound(Date.now());
    gridRef.current = next;
    stateRef.current = fresh;
    setGrid(next);
    setState(fresh);
    setOutcome(null);
  }, []);

  const type = useCallback(
    (key: CellKey, value: string) => {
      const current = stateRef.current;
      const currentGrid = gridRef.current;
      if (!current || !currentGrid) return;
      commit(typeInCell(current, currentGrid, key, value, Date.now()));
    },
    [commit],
  );

  const finish = useCallback(() => {
    const current = stateRef.current;
    if (current) commit(finishGridRound(current, Date.now()));
  }, [commit]);

  const leave = useCallback(() => {
    gridRef.current = null;
    stateRef.current = null;
    setGrid(null);
    setState(null);
    setOutcome(null);
  }, []);

  return { grid, state, outcome, start, type, finish, leave };
}
