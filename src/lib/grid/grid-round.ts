/**
 * State of one grid-fill round, Sporcle style: each cell locks as soon as it's typed
 * correctly; wrong attempts cost nothing until the round ends. The round ends when
 * every cell is solved, the learner taps Fertig, or the clock runs out.
 */

import type { GridPuzzle } from '@/content/types';

import { POINTS_PER_CORRECT, type SessionResult } from '../game/scoring';
import { isCellCorrect } from './check-cell';

/** `row:col` within one grid. */
export type CellKey = `${number}:${number}`;

export function cellKey(row: number, col: number): CellKey {
  return `${row}:${col}`;
}

/** Globally unique id stored in progress and the revise list: `<grid-id>:<row>:<col>`. */
export function cellId(gridId: string, row: number, col: number): string {
  return `${gridId}:${row}:${col}`;
}

/** Parse a cell id back into its grid and position, or undefined if it isn't one. */
export function parseCellId(id: string): { gridId: string; row: number; col: number } | undefined {
  const match = /^(.+):(\d+):(\d+)$/.exec(id);
  if (!match) return undefined;
  return { gridId: match[1], row: Number(match[2]), col: Number(match[3]) };
}

/** Cells the learner has to type, in reading order. */
export function blankCells(grid: GridPuzzle): CellKey[] {
  return grid.rows.flatMap((row, r) =>
    row.cells.flatMap((cell, c) => (cell.given ? [] : [cellKey(r, c)])),
  );
}

export type GridPhase = 'playing' | 'finished';

export interface GridRoundState {
  phase: GridPhase;
  entries: Partial<Record<CellKey, string>>;
  solved: CellKey[];
  startedAt: number;
  finishedAt?: number;
}

export function startGridRound(now: number): GridRoundState {
  return { phase: 'playing', entries: {}, solved: [], startedAt: now };
}

function cellAt(grid: GridPuzzle, key: CellKey) {
  const [r, c] = key.split(':').map(Number);
  return grid.rows[r]?.cells[c];
}

/** Record what the learner typed in a cell; a correct entry locks it. Finishes when all are solved. */
export function typeInCell(
  state: GridRoundState,
  grid: GridPuzzle,
  key: CellKey,
  value: string,
  now: number,
): GridRoundState {
  if (state.phase !== 'playing' || state.solved.includes(key)) return state;
  const cell = cellAt(grid, key);
  if (!cell || cell.given) return state;
  const entries = { ...state.entries, [key]: value };
  if (!isCellCorrect(cell, value)) return { ...state, entries };
  const solved = [...state.solved, key];
  const isDone = solved.length === blankCells(grid).length;
  return {
    ...state,
    entries,
    solved,
    ...(isDone ? { phase: 'finished' as const, finishedAt: now } : {}),
  };
}

export function finishGridRound(state: GridRoundState, now: number): GridRoundState {
  if (state.phase === 'finished') return state;
  return { ...state, phase: 'finished', finishedAt: now };
}

export function isGridComplete(state: GridRoundState, grid: GridPuzzle): boolean {
  return state.solved.length === blankCells(grid).length;
}

/** The finished round as a session result: one answer per blank cell. */
export function gridSessionResult(
  state: GridRoundState,
  grid: GridPuzzle,
  topicId: string,
): SessionResult {
  const answers = blankCells(grid).map((key) => {
    const [r, c] = key.split(':').map(Number);
    return {
      questionId: cellId(grid.id, r, c),
      topicId,
      isCorrect: state.solved.includes(key),
      given: state.entries[key]?.trim() ?? '',
    };
  });
  const complete = isGridComplete(state, grid);
  return {
    topicId,
    mode: 'grid',
    gridId: grid.id,
    answers,
    score: state.solved.length * POINTS_PER_CORRECT,
    bestCombo: 0,
    ...(complete && state.finishedAt !== undefined
      ? { timeMs: state.finishedAt - state.startedAt }
      : {}),
  };
}
