import { describe, expect, it } from 'vitest';

import { TOPICS } from '@/content';
import { createEmptyProgress, createEmptyTopicProgress, type Progress } from '@/lib/progress/types';

import { DAILY_LENGTH, buildDailySession, dailyKey, isDailyDone } from './daily';

const DAY = '2026-11-18';
const ids = (progress: Progress, key = DAY) =>
  buildDailySession(TOPICS, progress, key).map((item) => item.question.id);

/** Started topics with the given recent accuracy (1 = all right). */
function played(accuracy: Record<string, number>): Progress {
  const progress = createEmptyProgress();
  for (const [id, acc] of Object.entries(accuracy)) {
    const recent = Array.from({ length: 20 }, (_, i) => (i < acc * 20 ? 1 : 0) as 0 | 1);
    progress.topics[id] = { ...createEmptyTopicProgress(), answered: 20, recent };
  }
  return progress;
}

describe('dailyKey', () => {
  it('is the local calendar day', () => {
    expect(dailyKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('buildDailySession', () => {
  it('is the same all day, different the next, and never repeats a question', () => {
    const progress = played({ articles: 0.5, cases: 0.9 });
    expect(ids(progress)).toEqual(ids(progress));
    expect(ids(progress)).not.toEqual(ids(progress, '2026-11-19'));
    expect(new Set(ids(progress)).size).toBe(DAILY_LENGTH);
  });

  it('starts a new learner on the first topics', () => {
    const round = buildDailySession(TOPICS, createEmptyProgress(), DAY);
    expect(round).toHaveLength(DAILY_LENGTH);
    const first = new Set(TOPICS.slice(0, 3).map((t) => t.id));
    expect(round.every((item) => first.has(item.topicId))).toBe(true);
  });

  it('takes up to half from the revise list, and the rest from the weakest topics', () => {
    const progress = played({
      'noun-gender': 1,
      plurals: 1,
      articles: 0.3,
      cases: 0.4,
      pronouns: 0.5,
    });
    const missed = TOPICS.find((t) => t.id === 'noun-gender')!.gap!.slice(0, 8);
    for (const q of missed) {
      progress.revise[q.id] = { topicId: 'noun-gender', given: 'x', misses: 1, lastMissedAt: DAY };
    }
    const round = buildDailySession(TOPICS, progress, DAY);
    expect(round.filter((item) => progress.revise[item.question.id])).toHaveLength(5);
    const weak = new Set(['articles', 'cases', 'pronouns']);
    expect(round.filter((item) => weak.has(item.topicId))).toHaveLength(5);
    expect(round.some((item) => item.typed)).toBe(false);
  });

  it('tops up from every started topic when the weakest run short', () => {
    const tiny = TOPICS.filter((t) => t.id === 'noun-gender');
    const round = buildDailySession(tiny, played({ 'noun-gender': 0.5 }), DAY);
    expect(round).toHaveLength(DAILY_LENGTH);
  });
});

describe('isDailyDone', () => {
  it('is true only for the day it was finished', () => {
    const progress = { ...createEmptyProgress(), daily: { lastDone: DAY } };
    expect(isDailyDone(progress, DAY)).toBe(true);
    expect(isDailyDone(progress, '2026-11-19')).toBe(false);
    expect(isDailyDone(createEmptyProgress(), DAY)).toBe(false);
  });
});

describe('todaysMix', () => {
  it('keeps the day’s questions once built, even after progress changes', async () => {
    const { todaysMix, withDailyMix } = await import('./daily');
    const progress = played({ articles: 0.5, cases: 0.9 });
    const first = todaysMix(TOPICS, progress, DAY);
    expect(first.isNew).toBe(true);
    const saved = withDailyMix(progress, DAY, first.items);

    // Play changes stats and the revise list, which would change a fresh draw.
    const after = played({ articles: 1, cases: 0.1, plurals: 0.2 });
    const reopened = todaysMix(TOPICS, { ...after, dailyMix: saved.dailyMix }, DAY);
    expect(reopened.isNew).toBe(false);
    expect(reopened.items.map((i) => i.question.id)).toEqual(first.items.map((i) => i.question.id));

    // A new day builds a new mix.
    expect(todaysMix(TOPICS, saved, '2026-11-19').isNew).toBe(true);
  });

  it('skips saved questions that no longer exist, and rebuilds if none are left', async () => {
    const { todaysMix } = await import('./daily');
    const progress = { ...played({ articles: 0.5 }), dailyMix: { day: DAY, ids: ['gone-1'] } };
    expect(todaysMix(TOPICS, progress, DAY).isNew).toBe(true);
  });
});
