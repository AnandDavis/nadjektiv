/**
 * Apply a finished game round to progress. Pure: returns a new Progress plus the
 * events worth celebrating (new personal bests, level-ups, tier-ups).
 */

import type { GameMode } from '@/content/types';
import { isMixedMode } from '@/lib/game/modes';

import { examPercent, withExamResult } from '../exam/exam';
import { afterMiss, afterRight } from '../revise/schedule';
import { dailyKey } from '../utils/day';
import { accuracy, runBreakers, xpForSession, type SessionResult } from '../game/scoring';
import { withHistory } from './history';
import { levelForXp } from './level';
import { masteryFor, tierRank, type Tier } from './mastery';
import {
  COMBO_BREAKS_KEPT,
  RECENT_WINDOW,
  createEmptyTopicProgress,
  type GridBest,
  type ModeBest,
  type Progress,
  type TopicProgress,
} from './types';

export type BestKind = 'score' | 'accuracy' | 'combo' | 'time' | 'cells';

export interface SessionOutcome {
  progress: Progress;
  xpGained: number;
  newBests: BestKind[];
  levelUp?: { from: number; to: number };
  tierUps: Array<{ topicId: string; from: Tier; to: Tier }>;
  /** Questions newly put on the "to revise" list by this round. */
  addedToRevise: number;
  /** Questions taken off the list: answered correctly when due at the last gap. */
  clearedFromRevise: number;
  /** Topics that reached Gemeistert for the first time in this round. */
  graduations: string[];
  /** Level tests only: whether this result is the best yet for the level. */
  examBest?: boolean;
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
 * Grid tables are compared with themselves: the most cells solved, and the fastest
 * complete round. A first play sets the baseline without being announced.
 */
function updateGridBest(
  previous: GridBest | undefined,
  result: SessionResult,
): { best: GridBest; newBests: BestKind[] } {
  const cells = result.answers.filter((a) => a.isCorrect).length;
  const newBests: BestKind[] = [];
  if (previous) {
    if (
      result.timeMs !== undefined &&
      (previous.bestTimeMs === undefined || result.timeMs < previous.bestTimeMs)
    ) {
      newBests.push('time');
    } else if (cells > previous.bestCells) {
      newBests.push('cells');
    }
  }
  const times = [previous?.bestTimeMs, result.timeMs].filter((t): t is number => t !== undefined);
  return {
    best: {
      plays: (previous?.plays ?? 0) + 1,
      bestCells: Math.max(previous?.bestCells ?? 0, cells),
      ...(times.length > 0 ? { bestTimeMs: Math.min(...times) } : {}),
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
  const today = dailyKey(new Date(now));

  const resultsByTopic = new Map<string, boolean[]>();
  for (const answer of result.answers) {
    // Mastery and the revise list only count unaided answers. A hinted miss is still a miss.
    if (answer.hinted && answer.isCorrect) continue;
    const list = resultsByTopic.get(answer.topicId) ?? [];
    list.push(answer.isCorrect);
    resultsByTopic.set(answer.topicId, list);
    const stats = questions[answer.questionId] ?? { seen: 0, correct: 0 };
    questions[answer.questionId] = {
      seen: stats.seen + 1,
      correct: stats.correct + (answer.isCorrect ? 1 : 0),
    };

    // A miss goes on the revise list and comes back after spaced gaps; right answers on
    // the days it's due move it along, and one at the last gap takes it off.
    const entry = revise[answer.questionId];
    if (answer.isCorrect) {
      if (entry) {
        const next = afterRight(entry, today);
        if (next) {
          revise[answer.questionId] = next;
        } else {
          delete revise[answer.questionId];
          clearedFromRevise += 1;
        }
      }
    } else {
      if (!entry) addedToRevise += 1;
      revise[answer.questionId] = {
        topicId: answer.topicId,
        given: answer.given,
        misses: (entry?.misses ?? 0) + 1,
        lastMissedAt: now,
        ...afterMiss(today),
      };
    }
  }

  let newBests: BestKind[] = [];
  const grids = { ...progress.grids };
  const tierUps: SessionOutcome['tierUps'] = [];
  const touched = new Set([...resultsByTopic.keys(), ...(result.topicId ? [result.topicId] : [])]);

  for (const topicId of touched) {
    const before = topics[topicId] ?? createEmptyTopicProgress();
    let after = updateTopic(before, resultsByTopic.get(topicId) ?? []);
    if (result.topicId === topicId && !isMixedMode(result.mode)) {
      const key = result.mode === 'sort' && result.untimed ? 'sortUntimed' : result.mode;
      const { best, newBests: bests } = updateBest(before.modes[key], result);
      after = { ...after, modes: { ...after.modes, [key]: best } };
      newBests = bests;
    }
    if (result.topicId === topicId && result.mode === 'grid' && result.gridId) {
      const { best, newBests: gridBests } = updateGridBest(grids[result.gridId], result);
      grids[result.gridId] = best;
      // Scores from different tables aren't comparable; only the table's own bests count.
      newBests = gridBests;
    }
    topics[topicId] = after;

    const modes = modesByTopic[topicId] ?? [];
    const from = masteryFor(before, modes).tier;
    const to = masteryFor(after, modes).tier;
    if (tierRank(to) > tierRank(from)) tierUps.push({ topicId, from, to });
  }

  // Celebrate a topic's first Gemeistert only once, even if it drops and climbs back.
  const graduations = tierUps
    .filter((up) => up.to === 'mastered' && !progress.graduated?.[up.topicId])
    .map((up) => up.topicId);
  const graduated =
    graduations.length > 0
      ? {
          graduated: {
            ...progress.graduated,
            ...Object.fromEntries(graduations.map((id) => [id, now])),
          },
        }
      : {};

  const exam = result.examLevel
    ? withExamResult(progress, result.examLevel, examPercent(result.answers))
    : undefined;

  const xp = progress.xp + xpGained;
  const levelBefore = levelForXp(progress.xp).level;
  const levelAfter = levelForXp(xp).level;

  return {
    progress: {
      ...progress,
      xp,
      topics,
      questions,
      revise,
      grids,
      startedAt: progress.startedAt ?? now,
      ...(result.dailyDate ? { daily: { lastDone: result.dailyDate } } : {}),
      ...withComboBreaks(progress, runBreakers(result.answers), now),
      ...graduated,
      ...(exam ? { exams: exam.exams } : {}),
      history: withHistory(progress.history, today, result.answers),
    },
    xpGained,
    newBests,
    levelUp: levelAfter > levelBefore ? { from: levelBefore, to: levelAfter } : undefined,
    tierUps,
    addedToRevise,
    clearedFromRevise,
    graduations,
    ...(exam ? { examBest: exam.isBest } : {}),
  };
}

/** Keep the latest questions that broke a long run, for the daily mix to lean on. */
function withComboBreaks(progress: Progress, breakers: string[], now: string) {
  if (breakers.length === 0) return {};
  const added = breakers.map((questionId) => ({ questionId, at: now }));
  return { comboBreaks: [...(progress.comboBreaks ?? []), ...added].slice(-COMBO_BREAKS_KEPT) };
}
