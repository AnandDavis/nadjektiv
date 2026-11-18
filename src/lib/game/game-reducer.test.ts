import { describe, expect, it } from 'vitest';

import {
  INITIAL_GAME_STATE,
  currentItem,
  gameReducer,
  toSessionResult,
  type GameState,
} from './game-reducer';
import type { SessionItem } from './session';

const items: SessionItem[] = [1, 2, 3].map((n) => ({
  topicId: 't',
  question: {
    id: `t-gap-${n}`,
    kind: 'gap',
    before: '',
    after: '',
    options: ['a', 'b'],
    answer: 'a',
    translation: '',
    explanation: '',
  },
}));

function play(...actions: Parameters<typeof gameReducer>[1][]): GameState {
  return actions.reduce(gameReducer, INITIAL_GAME_STATE);
}

describe('gameReducer', () => {
  it('starts playing the first item', () => {
    const state = play({ type: 'start', items });
    expect(state.phase).toBe('playing');
    expect(currentItem(state)?.question.id).toBe('t-gap-1');
  });

  it('finishes straight away with no items', () => {
    expect(play({ type: 'start', items: [] }).phase).toBe('finished');
  });

  it('scores a correct answer and moves to feedback', () => {
    const state = play({ type: 'start', items }, { type: 'answer', isCorrect: true, given: 'a' });
    expect(state.phase).toBe('feedback');
    expect(state.score).toBe(10);
    expect(state.combo).toBe(1);
    expect(state.last).toEqual({ isCorrect: true, given: 'a', points: 10 });
  });

  it('records mistakes and resets the combo', () => {
    const state = play(
      { type: 'start', items },
      { type: 'answer', isCorrect: true, given: 'a' },
      { type: 'next' },
      { type: 'answer', isCorrect: false, given: 'b' },
    );
    expect(state.combo).toBe(0);
    expect(state.bestCombo).toBe(1);
    expect(state.mistakes).toEqual([{ item: items[1], given: 'b' }]);
  });

  it('ignores a second answer to the same question', () => {
    const once = play({ type: 'start', items }, { type: 'answer', isCorrect: true, given: 'a' });
    expect(gameReducer(once, { type: 'answer', isCorrect: true, given: 'a' })).toBe(once);
  });

  it('finishes after the last item', () => {
    const state = play(
      { type: 'start', items },
      ...items.flatMap(() => [
        { type: 'answer', isCorrect: true, given: 'a' } as const,
        { type: 'next' } as const,
      ]),
    );
    expect(state.phase).toBe('finished');
    expect(state.answers).toHaveLength(3);
  });

  it('can be finished early by the timer', () => {
    const state = play(
      { type: 'start', items },
      { type: 'answer', isCorrect: true, given: 'a' },
      { type: 'finish' },
    );
    expect(state.phase).toBe('finished');
    expect(toSessionResult(state, 'sort', 't')).toEqual({
      topicId: 't',
      mode: 'sort',
      answers: [{ questionId: 't-gap-1', topicId: 't', isCorrect: true }],
      score: 10,
      bestCombo: 1,
    });
  });
});
