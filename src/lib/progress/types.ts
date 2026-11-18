/**
 * Persisted learner progress. The Zod schema is the source of truth; types are inferred.
 * Bump PROGRESS_VERSION and add a migration in ./migrate.ts when the shape changes.
 */

import { z } from 'zod';

export const PROGRESS_VERSION = 3;

/** How many recent answers per topic feed the mastery accuracy. */
export const RECENT_WINDOW = 40;

const count = z.number().int().nonnegative();

export const questionStatsSchema = z.object({
  seen: count,
  correct: count,
});

export const modeBestSchema = z.object({
  plays: count,
  bestScore: count,
  /** 0–1 */
  bestAccuracy: z.number().min(0).max(1),
  bestCombo: count,
});

export const topicProgressSchema = z.object({
  answered: count,
  correct: count,
  /** Most recent last; 1 = correct, 0 = wrong. Capped at RECENT_WINDOW. */
  recent: z.array(z.union([z.literal(0), z.literal(1)])).max(RECENT_WINDOW),
  modes: z.object({
    sort: modeBestSchema.optional(),
    gap: modeBestSchema.optional(),
    build: modeBestSchema.optional(),
    grid: modeBestSchema.optional(),
    // Added without a version bump: an optional key reads fine in older saves, and an
    // older cached app version drops it instead of rejecting the whole progress.
    type: modeBestSchema.optional(),
  }),
});

/** A question the learner got wrong and hasn't yet answered correctly since. */
export const reviseEntrySchema = z.object({
  topicId: z.string(),
  /** The learner's most recent wrong answer. */
  given: z.string(),
  /** Times missed since it was last answered correctly. */
  misses: count.min(1),
  /** ISO timestamp of the latest miss. */
  lastMissedAt: z.string(),
});

/** Personal bests for one grid-fill table. */
export const gridBestSchema = z.object({
  plays: count,
  /** Most cells solved in one round. */
  bestCells: count,
  /** Fastest complete round, in ms. Undefined until the table has been completed. */
  bestTimeMs: count.optional(),
});

export const progressSchema = z.object({
  version: z.literal(PROGRESS_VERSION),
  xp: count,
  topics: z.record(z.string(), topicProgressSchema),
  questions: z.record(z.string(), questionStatsSchema),
  /** The "to revise" list, keyed by question id. */
  revise: z.record(z.string(), reviseEntrySchema),
  /** Grid-fill bests, keyed by grid id. */
  grids: z.record(z.string(), gridBestSchema),
  /** ISO timestamp of the first session. */
  startedAt: z.string().optional(),
});

export type QuestionStats = z.infer<typeof questionStatsSchema>;
export type ModeBest = z.infer<typeof modeBestSchema>;
export type TopicProgress = z.infer<typeof topicProgressSchema>;
export type ReviseEntry = z.infer<typeof reviseEntrySchema>;
export type GridBest = z.infer<typeof gridBestSchema>;
export type Progress = z.infer<typeof progressSchema>;

export function createEmptyProgress(): Progress {
  return { version: PROGRESS_VERSION, xp: 0, topics: {}, questions: {}, revise: {}, grids: {} };
}

export function createEmptyTopicProgress(): TopicProgress {
  return { answered: 0, correct: 0, recent: [], modes: {} };
}
