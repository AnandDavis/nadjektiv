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
    })),
    ...Array.from({ length: wrong }, (_, i) => ({
      questionId: `t-gap-w${i}`,
      topicId: 't',
      isCorrect: false,
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
});
