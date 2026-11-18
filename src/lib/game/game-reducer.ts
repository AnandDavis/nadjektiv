/**
 * State machine for one game round: intro → playing ⇄ feedback → finished.
 */

import type { GameMode } from '@/content/types';

import {
  pointsForCorrect,
  pointsForHinted,
  type AnswerRecord,
  type SessionResult,
} from './scoring';
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
  /** A hint has been shown for the current question. */
  hinted: boolean;
  last?: LastAnswer;
}

export type GameAction =
  | { type: 'start'; items: SessionItem[] }
  | { type: 'answer'; isCorrect: boolean; given: string }
  | { type: 'hint' }
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
  hinted: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start':
      return {
        ...INITIAL_GAME_STATE,
        items: action.items,
        phase: action.items.length > 0 ? 'playing' : 'finished',
      };

    case 'hint':
      if (state.phase !== 'playing' || state.hinted) return state;
      return { ...state, hinted: true };

    case 'answer': {
      if (state.phase !== 'playing') return state;
      const item = state.items[state.index];
      const { hinted } = state;
      // A hinted right answer earns part of the points and holds the combo where it is.
      const points = !action.isCorrect
        ? 0
        : hinted
          ? pointsForHinted(state.combo)
          : pointsForCorrect(state.combo);
      const combo = !action.isCorrect ? 0 : hinted ? state.combo : state.combo + 1;
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
            ...(hinted ? { hinted: true } : {}),
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
      return { ...state, index, phase: 'playing', hinted: false, last: undefined };
    }

    case 'finish':
      if (state.phase === 'intro' || state.phase === 'finished') return state;
      return { ...state, phase: 'finished' };

    /* v8 ignore next 4 -- exhaustive: the type system proves this is unreachable */
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
