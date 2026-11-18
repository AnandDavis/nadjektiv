/**
 * Apply a finished game round to progress. Pure: returns a new Progress plus the
 * events worth celebrating (new personal bests, level-ups, tier-ups).
 */

import type { GameMode } from '@/content/types';

import { accuracy, xpForSession, type SessionResult } from '../game/scoring';
import { levelForXp } from './level';
import { masteryFor, tierRank, type Tier } from './mastery';
import {
  RECENT_WINDOW,
  createEmptyTopicProgress,
  type ModeBest,
  type Progress,
  type TopicProgress,
} from './types';

export type BestKind = 'score' | 'accuracy' | 'combo';

export interface SessionOutcome {
  progress: Progress;
  xpGained: number;
  newBests: BestKind[];
  levelUp?: { from: number; to: number };
  tierUps: Array<{ topicId: string; from: Tier; to: Tier }>;
  /** Questions newly put on the "to revise" list by this round. */
  addedToRevise: number;
  /** Questions taken off the list because they were answered correctly. */
  clearedFromRevise: number;
}

function updateTopic(topic: TopicProgress, results: readonly boolean[]): TopicProgress {
  const recent = [...topic.recent, ...results.map((r) => (r ? 1 : 0) as 0 | 1)].slice(
    -RECENT_WINDOW,
  );
  return {
    ...topic,
    answered: topic.answered + results.length,
    correct: topic.correct + results.filter(Boolean).length,
    recent,
  };
}

function updateBest(
  previous: ModeBest | undefined,
  result: SessionResult,
): { best: ModeBest; newBests: BestKind[] } {
  const acc = accuracy(result.answers);
  const newBests: BestKind[] = [];
  // A first play sets the baseline; it isn't announced as a "new best".
  if (previous) {
    if (result.score > previous.bestScore) newBests.push('score');
    if (acc > previous.bestAccuracy) newBests.push('accuracy');
    if (result.bestCombo > previous.bestCombo) newBests.push('combo');
  }
  return {
    best: {
      plays: (previous?.plays ?? 0) + 1,
      bestScore: Math.max(previous?.bestScore ?? 0, result.score),
      bestAccuracy: Math.max(previous?.bestAccuracy ?? 0, acc),
      bestCombo: Math.max(previous?.bestCombo ?? 0, result.bestCombo),
    },
    newBests,
  };
}

/**
 * @param modesByTopic available game modes per topic, used for tier requirements
 * @param now ISO timestamp, injected for testability
 */
export function applySessionResult(
  progress: Progress,
  result: SessionResult,
  modesByTopic: Readonly<Record<string, readonly GameMode[]>>,
  now: string,
): SessionOutcome {
  const xpGained = xpForSession(result);
  const topics = { ...progress.topics };
  const questions = { ...progress.questions };
  const revise = { ...progress.revise };
  let addedToRevise = 0;
  let clearedFromRevise = 0;

  const resultsByTopic = new Map<string, boolean[]>();
  for (const answer of result.answers) {
    const list = resultsByTopic.get(answer.topicId) ?? [];
    list.push(answer.isCorrect);
    resultsByTopic.set(answer.topicId, list);
    const stats = questions[answer.questionId] ?? { seen: 0, correct: 0 };
    questions[answer.questionId] = {
      seen: stats.seen + 1,
      correct: stats.correct + (answer.isCorrect ? 1 : 0),
    };

    // A miss goes on the revise list; a correct answer later takes it off.
    const entry = revise[answer.questionId];
    if (answer.isCorrect) {
      if (entry) {
        delete revise[answer.questionId];
        clearedFromRevise += 1;
      }
    } else {
      if (!entry) addedToRevise += 1;
      revise[answer.questionId] = {
        topicId: answer.topicId,
        given: answer.given,
        misses: (entry?.misses ?? 0) + 1,
        lastMissedAt: now,
      };
    }
  }

  let newBests: BestKind[] = [];
  const tierUps: SessionOutcome['tierUps'] = [];
  const touched = new Set([...resultsByTopic.keys(), ...(result.topicId ? [result.topicId] : [])]);

  for (const topicId of touched) {
    const before = topics[topicId] ?? createEmptyTopicProgress();
    let after = updateTopic(before, resultsByTopic.get(topicId) ?? []);
    if (result.topicId === topicId && result.mode !== 'review') {
      const { best, newBests: bests } = updateBest(before.modes[result.mode], result);
      after = { ...after, modes: { ...after.modes, [result.mode]: best } };
      newBests = bests;
    }
    topics[topicId] = after;

    const modes = modesByTopic[topicId] ?? [];
    const from = masteryFor(before, modes).tier;
    const to = masteryFor(after, modes).tier;
    if (tierRank(to) > tierRank(from)) tierUps.push({ topicId, from, to });
  }

  const xp = progress.xp + xpGained;
  const levelBefore = levelForXp(progress.xp).level;
  const levelAfter = levelForXp(xp).level;

  return {
    progress: { ...progress, xp, topics, questions, revise, startedAt: progress.startedAt ?? now },
    xpGained,
    newBests,
    levelUp: levelAfter > levelBefore ? { from: levelBefore, to: levelAfter } : undefined,
    tierUps,
    addedToRevise,
    clearedFromRevise,
  };
}
