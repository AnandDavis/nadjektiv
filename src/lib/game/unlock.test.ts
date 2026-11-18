import { describe, expect, it } from 'vitest';

import type { GameMode } from '@/content/types';
import { createEmptyTopicProgress, type TopicProgress } from '@/lib/progress/types';

import { isModeUnlocked } from './unlock';

const MODES: GameMode[] = ['sort', 'gap', 'type', 'build'];

function withRecent(answered: number, recent: (0 | 1)[]): TopicProgress {
  return {
    ...createEmptyTopicProgress(),
    answered,
    correct: recent.filter(Boolean).length,
    recent,
  };
}

describe('isModeUnlocked', () => {
  it('always opens the everyday modes', () => {
    expect(isModeUnlocked('gap', undefined, MODES)).toBe(true);
    expect(isModeUnlocked('grid', undefined, MODES)).toBe(true);
  });

  it('opens Type the answer only once the topic has a medal', () => {
    expect(isModeUnlocked('type', undefined, MODES)).toBe(false);
    expect(isModeUnlocked('type', withRecent(3, [1, 1, 1]), MODES)).toBe(false);
    expect(isModeUnlocked('type', withRecent(10, Array(10).fill(1)), MODES)).toBe(true);
  });
});
