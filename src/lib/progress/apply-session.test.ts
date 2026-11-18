import { describe, expect, it } from 'vitest';

import type { SessionResult } from '../game/scoring';
import { applySessionResult } from './apply-session';
import { createEmptyProgress } from './types';

const NOW = '2026-11-18T12:00:00.000Z';
const modes = { t: ['gap' as const] };

function result(
  correct: number,
  wrong: number,
  score = correct * 10,
  bestCombo = correct,
): SessionResult {
  const answers = [
    ...Array.from({ length: correct }, (_, i) => ({
      questionId: `t-gap-${i}`,
      topicId: 't',
      isCorrect: true,
      given: 'right',
    })),
    ...Array.from({ length: wrong }, (_, i) => ({
      questionId: `t-gap-w${i}`,
      topicId: 't',
      isCorrect: false,
      given: 'wrong',
    })),
  ];
  return { topicId: 't', mode: 'gap', answers, score, bestCombo };
}

describe('applySessionResult', () => {
  it('records answers, stats, xp and a first personal best without announcing it', () => {
    const outcome = applySessionResult(createEmptyProgress(), result(8, 2), modes, NOW);
    const topic = outcome.progress.topics.t;
    expect(topic.answered).toBe(10);
    expect(topic.correct).toBe(8);
    expect(topic.recent).toHaveLength(10);
    expect(topic.modes.gap).toEqual({ plays: 1, bestScore: 80, bestAccuracy: 0.8, bestCombo: 8 });
    expect(outcome.progress.questions['t-gap-0']).toEqual({ seen: 1, correct: 1 });
    expect(outcome.progress.questions['t-gap-w0']).toEqual({ seen: 1, correct: 0 });
    expect(outcome.xpGained).toBe(80);
    expect(outcome.newBests).toEqual([]);
    expect(outcome.progress.startedAt).toBe(NOW);
  });

  it('announces beaten personal bests', () => {
    const first = applySessionResult(createEmptyProgress(), result(5, 5), modes, NOW).progress;
    const second = applySessionResult(first, result(9, 1), modes, NOW);
    expect(second.newBests).toEqual(['score', 'accuracy', 'combo']);
    expect(second.progress.topics.t.modes.gap?.plays).toBe(2);
  });

  it('reports level-ups and tier-ups', () => {
    const outcome = applySessionResult(createEmptyProgress(), result(10, 0), modes, NOW);
    expect(outcome.xpGained).toBe(150);
    expect(outcome.levelUp).toEqual({ from: 1, to: 2 });
    expect(outcome.tierUps).toEqual([{ topicId: 't', from: 'new', to: 'bronze' }]);
  });

  it('keeps zero as zero for a round with no correct answers', () => {
    const outcome = applySessionResult(createEmptyProgress(), result(0, 3, 0, 0), modes, NOW);
    expect(outcome.progress.topics.t.modes.gap).toEqual({
      plays: 1,
      bestScore: 0,
      bestAccuracy: 0,
      bestCombo: 0,
    });
  });

  it('does not set personal bests for review sessions', () => {
    const review: SessionResult = { ...result(3, 0), topicId: undefined, mode: 'review' };
    const outcome = applySessionResult(createEmptyProgress(), review, modes, NOW);
    expect(outcome.progress.topics.t.answered).toBe(3);
    expect(outcome.progress.topics.t.modes).toEqual({});
  });

  it('does not mutate the input', () => {
    const before = createEmptyProgress();
    applySessionResult(before, result(3, 0), modes, NOW);
    expect(before).toEqual(createEmptyProgress());
  });

  it('adds missed questions to the revise list', () => {
    const outcome = applySessionResult(createEmptyProgress(), result(1, 2), modes, NOW);
    expect(outcome.progress.revise).toEqual({
      't-gap-w0': { topicId: 't', given: 'wrong', misses: 1, lastMissedAt: NOW },
      't-gap-w1': { topicId: 't', given: 'wrong', misses: 1, lastMissedAt: NOW },
    });
    expect(outcome.addedToRevise).toBe(2);
  });

  it('counts repeat misses and clears an item once it is answered correctly', () => {
    const missTwice = applySessionResult(
      applySessionResult(createEmptyProgress(), result(0, 1), modes, NOW).progress,
      result(0, 1),
      modes,
      NOW,
    );
    expect(missTwice.progress.revise['t-gap-w0'].misses).toBe(2);
    expect(missTwice.addedToRevise).toBe(0);

    const fixed: SessionResult = {
      mode: 'review',
      answers: [{ questionId: 't-gap-w0', topicId: 't', isCorrect: true, given: 'right' }],
      score: 10,
      bestCombo: 1,
    };
    const outcome = applySessionResult(missTwice.progress, fixed, modes, NOW);
    expect(outcome.progress.revise).toEqual({});
    expect(outcome.clearedFromRevise).toBe(1);
  });
});

describe('applySessionResult edge cases', () => {
  it('handles a topic with no registered modes', () => {
    const outcome = applySessionResult(createEmptyProgress(), result(10, 0), {}, NOW);
    expect(outcome.progress.topics.t.answered).toBe(10);
    expect(outcome.tierUps).toEqual([{ topicId: 't', from: 'new', to: 'bronze' }]);
  });

  it('records the personal best for a topic round even with no answers in it', () => {
    const empty: SessionResult = { topicId: 't', mode: 'gap', answers: [], score: 0, bestCombo: 0 };
    const outcome = applySessionResult(createEmptyProgress(), empty, modes, NOW);
    expect(outcome.progress.topics.t.modes.gap?.plays).toBe(1);
    expect(outcome.progress.topics.t.answered).toBe(0);
  });
});

describe('grid rounds', () => {
  const cell = (n: number, isCorrect: boolean) => ({
    questionId: `t-grid-1:1:${n}`,
    topicId: 't',
    isCorrect,
    given: isCorrect ? 'den' : '',
  });
  const grid = (correct: number, total: number, timeMs?: number): SessionResult => ({
    topicId: 't',
    mode: 'grid',
    gridId: 't-grid-1',
    answers: Array.from({ length: total }, (_, i) => cell(i, i < correct)),
    score: correct * 10,
    bestCombo: 0,
    ...(timeMs === undefined ? {} : { timeMs }),
  });
  const gridModes = { t: ['gap' as const, 'grid' as const] };

  it('records per-table bests and puts missed cells on the revise list', () => {
    const outcome = applySessionResult(createEmptyProgress(), grid(3, 4), gridModes, NOW);
    expect(outcome.progress.grids['t-grid-1']).toEqual({ plays: 1, bestCells: 3 });
    expect(Object.keys(outcome.progress.revise)).toEqual(['t-grid-1:1:3']);
    expect(outcome.progress.topics.t.modes.grid?.plays).toBe(1);
  });

  it('announces a first complete time and then faster times', () => {
    let progress = applySessionResult(createEmptyProgress(), grid(3, 4), gridModes, NOW).progress;
    let outcome = applySessionResult(progress, grid(4, 4, 50_000), gridModes, NOW);
    expect(outcome.newBests).toEqual(['time']);
    expect(outcome.progress.grids['t-grid-1'].bestTimeMs).toBe(50_000);
    progress = outcome.progress;
    outcome = applySessionResult(progress, grid(4, 4, 60_000), gridModes, NOW);
    expect(outcome.newBests).toEqual([]);
    expect(outcome.progress.grids['t-grid-1'].bestTimeMs).toBe(50_000);
    outcome = applySessionResult(progress, grid(4, 4, 40_000), gridModes, NOW);
    expect(outcome.newBests).toEqual(['time']);
  });

  it('announces more cells solved when the table is not completed', () => {
    const progress = applySessionResult(createEmptyProgress(), grid(1, 4), gridModes, NOW).progress;
    expect(applySessionResult(progress, grid(2, 4), gridModes, NOW).newBests).toEqual(['cells']);
  });
});
