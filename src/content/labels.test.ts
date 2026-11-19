import { describe, expect, it } from 'vitest';

import { MODE_INFO } from '@/lib/game/modes';

import { GROUP_LABELS } from './groups';
import { GAME_MODES, TOPICS, getTopic, isGameMode } from './index';

describe('labels', () => {
  it('keeps each level’s groups together, so topic numbers count up down the home page', () => {
    const runs = TOPICS.map((t) => `${t.level}/${t.group}`).filter(
      (key, i, keys) => i === 0 || keys[i - 1] !== key,
    );
    expect(new Set(runs).size).toBe(runs.length);
  });

  it('has a group label for every topic group in use', () => {
    for (const topic of TOPICS) expect(GROUP_LABELS[topic.group]).toBeTruthy();
  });

  it('describes every game mode', () => {
    for (const mode of GAME_MODES) {
      expect(MODE_INFO[mode].name).toBeTruthy();
      for (const lang of ['de', 'en'] as const) {
        expect(MODE_INFO[mode].subtitle[lang]).toBeTruthy();
        expect(MODE_INFO[mode].description[lang].length).toBeGreaterThan(10);
      }
    }
  });
});

describe('registry lookups', () => {
  it('recognises game modes from URL segments', () => {
    expect(isGameMode('sort')).toBe(true);
    expect(isGameMode('quiz')).toBe(false);
  });

  it('finds topics by id', () => {
    expect(getTopic('articles')?.title).toBeTruthy();
    expect(getTopic('nope')).toBeUndefined();
  });
});
