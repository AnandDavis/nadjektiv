/**
 * State machine for one game round: intro → playing ⇄ feedback → finished.
 */

import type { GameMode } from '@/content/types';

import { pointsForCorrect, type AnswerRecord, type SessionResult } from './scoring';
import type { SessionItem } from './session';

export type GamePhase = 'intro' | 'playing' | 'feedback' | 'finished';

export interface LastAnswer {
  isCorrect: boolean;
  /** What the learner chose: a bin, an option, or the built sentence. */
  given: string;
  points: number;
}

export interface Mistake {
  item: SessionItem;
  given: string;
}

export interface GameState {
  phase: GamePhase;
  items: SessionItem[];
  index: number;
  answers: AnswerRecord[];
  mistakes: Mistake[];
  score: number;
  combo: number;
  bestCombo: number;
  last?: LastAnswer;
}

export type GameAction =
  | { type: 'start'; items: SessionItem[] }
  | { type: 'answer'; isCorrect: boolean; given: string }
  | { type: 'next' }
  | { type: 'finish' };

export const INITIAL_GAME_STATE: GameState = {
  phase: 'intro',
  items: [],
  index: 0,
  answers: [],
  mistakes: [],
  score: 0,
  combo: 0,
  bestCombo: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start':
      return {
        ...INITIAL_GAME_STATE,
        items: action.items,
        phase: action.items.length > 0 ? 'playing' : 'finished',
      };

    case 'answer': {
      if (state.phase !== 'playing') return state;
      const item = state.items[state.index];
      const points = action.isCorrect ? pointsForCorrect(state.combo) : 0;
      const combo = action.isCorrect ? state.combo + 1 : 0;
      return {
        ...state,
        phase: 'feedback',
        answers: [
          ...state.answers,
          {
            questionId: item.question.id,
            topicId: item.topicId,
            isCorrect: action.isCorrect,
            given: action.given,
          },
        ],
        mistakes: action.isCorrect
          ? state.mistakes
          : [...state.mistakes, { item, given: action.given }],
        score: state.score + points,
        combo,
        bestCombo: Math.max(state.bestCombo, combo),
        last: { isCorrect: action.isCorrect, given: action.given, points },
      };
    }

    case 'next': {
      if (state.phase !== 'feedback') return state;
      const index = state.index + 1;
      if (index >= state.items.length) return { ...state, phase: 'finished' };
      return { ...state, index, phase: 'playing', last: undefined };
    }

    case 'finish':
      if (state.phase === 'intro' || state.phase === 'finished') return state;
      return { ...state, phase: 'finished' };

    default: {
      const exhaustive: never = action;
      throw new Error(`Unknown game action: ${JSON.stringify(exhaustive)}`);
    }
  }
}

export function currentItem(state: GameState): SessionItem | undefined {
  return state.phase === 'playing' || state.phase === 'feedback'
    ? state.items[state.index]
    : undefined;
}

export function toSessionResult(
  state: GameState,
  mode: GameMode | 'review',
  topicId?: string,
): SessionResult {
  return { topicId, mode, answers: state.answers, score: state.score, bestCombo: state.bestCombo };
}
