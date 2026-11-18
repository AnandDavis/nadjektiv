import { describe, expect, it } from 'vitest';

import { MODE_INFO } from '@/lib/game/modes';

import { GROUP_LABELS } from './groups';
import { GAME_MODES, TOPICS, getTopic, isGameMode } from './index';

describe('labels', () => {
  it('has a group label for every topic group in use', () => {
    for (const topic of TOPICS) expect(GROUP_LABELS[topic.group]).toBeTruthy();
  });

  it('describes every game mode', () => {
    for (const mode of GAME_MODES) {
      expect(MODE_INFO[mode].name).toBeTruthy();
      expect(MODE_INFO[mode].english).toBeTruthy();
      expect(MODE_INFO[mode].description.length).toBeGreaterThan(10);
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
