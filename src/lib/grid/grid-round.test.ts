import { describe, expect, it } from 'vitest';

import type { GridPuzzle } from '@/content/types';

import {
  blankCells,
  cellId,
  finishGridRound,
  gridSessionResult,
  isGridComplete,
  parseCellId,
  startGridRound,
  typeInCell,
} from './grid-round';

const grid: GridPuzzle = {
  id: 't-grid-1',
  title: 'T',
  titleDe: 'T',
  rowHeader: 'Fall',
  columns: ['M', 'F'],
  seconds: 60,
  explanation: 'Masculine changes in the accusative.',
  rows: [
    {
      label: 'Nom',
      cells: [
        { answer: 'der', given: true },
        { answer: 'die', given: true },
      ],
    },
    { label: 'Akk', cells: [{ answer: 'den' }, { answer: 'die' }] },
  ],
};

describe('cell ids', () => {
  it('round-trips grid, row and column', () => {
    expect(parseCellId(cellId('t-grid-1', 1, 0))).toEqual({ gridId: 't-grid-1', row: 1, col: 0 });
    expect(parseCellId('t-gap-1')).toBeUndefined();
  });

  it('lists only the cells to type, in reading order', () => {
    expect(blankCells(grid)).toEqual(['1:0', '1:1']);
  });
});

describe('a grid round', () => {
  it('locks a cell once it is right and ignores further typing in it', () => {
    let state = startGridRound(1000);
    state = typeInCell(state, grid, '1:0', 'de', 1100);
    expect(state.solved).toEqual([]);
    state = typeInCell(state, grid, '1:0', 'den', 1200);
    expect(state.solved).toEqual(['1:0']);
    expect(typeInCell(state, grid, '1:0', 'x', 1300)).toBe(state);
  });

  it('cannot type into given cells', () => {
    const state = startGridRound(0);
    expect(typeInCell(state, grid, '0:0', 'der', 10)).toBe(state);
  });

  it('finishes by itself when every cell is solved, with the time taken', () => {
    let state = startGridRound(1000);
    state = typeInCell(state, grid, '1:0', 'den', 2000);
    state = typeInCell(state, grid, '1:1', 'DIE', 5000);
    expect(state.phase).toBe('finished');
    expect(isGridComplete(state, grid)).toBe(true);
    expect(gridSessionResult(state, grid, 't')).toMatchObject({
      mode: 'grid',
      gridId: 't-grid-1',
      score: 20,
      timeMs: 4000,
      answers: [
        { questionId: 't-grid-1:1:0', isCorrect: true, given: 'den' },
        { questionId: 't-grid-1:1:1', isCorrect: true, given: 'DIE' },
      ],
    });
  });

  it('counts unsolved cells as wrong when finished early, with no time', () => {
    let state = startGridRound(0);
    state = typeInCell(state, grid, '1:0', 'den', 10);
    state = typeInCell(state, grid, '1:1', 'der', 20);
    state = finishGridRound(state, 30);
    const result = gridSessionResult(state, grid, 't');
    expect(result.timeMs).toBeUndefined();
    expect(result.answers.map((a) => a.isCorrect)).toEqual([true, false]);
    expect(result.answers[1].given).toBe('der');
    expect(typeInCell(state, grid, '1:1', 'die', 40)).toBe(state);
  });
});
