/**
 * Persisted learner progress. The Zod schema is the source of truth; types are inferred.
 * Bump PROGRESS_VERSION and add a migration in ./migrate.ts when existing saves no
 * longer fit the shape. New optional fields need no bump (CLAUDE.md rule 5): they are
 * marked "added without a version bump" below.
 */

// zod/mini: the same validation as zod in a fraction of the JavaScript, which every
// page that reads progress downloads.
import * as z from 'zod/mini';

export const PROGRESS_VERSION = 3;

/** How many recent answers per topic feed the mastery accuracy. */
export const RECENT_WINDOW = 40;

const count = z.int().check(z.gte(0));

export const questionStatsSchema = z.object({
  seen: count,
  correct: count,
});

export const modeBestSchema = z.object({
  plays: count,
  bestScore: count,
  /** 0–1 */
  bestAccuracy: z.number().check(z.gte(0), z.lte(1)),
  bestCombo: count,
});

export const topicProgressSchema = z.object({
  answered: count,
  correct: count,
  /** Most recent last; 1 = correct, 0 = wrong. Capped at RECENT_WINDOW. */
  recent: z.array(z.union([z.literal(0), z.literal(1)])).check(z.maxLength(RECENT_WINDOW)),
  modes: z.object({
    sort: z.optional(modeBestSchema),
    gap: z.optional(modeBestSchema),
    build: z.optional(modeBestSchema),
    grid: z.optional(modeBestSchema),
    // type and sortUntimed: added without a version bump (optional).
    type: z.optional(modeBestSchema),
    /** Untimed Blitz (an option), kept apart: a round without the clock isn't comparable. */
    sortUntimed: z.optional(modeBestSchema),
  }),
});

/** A question the learner got wrong and hasn't yet answered correctly since. */
export const reviseEntrySchema = z.object({
  topicId: z.string(),
  /** The learner's most recent wrong answer. */
  given: z.string(),
  /** Times missed since it was last answered correctly. */
  misses: z.int().check(z.gte(1)),
  /** ISO timestamp of the latest miss. */
  lastMissedAt: z.string(),
  /**
   * Spaced repetition: right answers given since the last miss, each on a day it was
   * due. Added without a version bump (optional): older entries count as step 0, due now.
   */
  step: z.optional(count),
  /** The learner's day ("2026-11-18") the entry is next due. Added without a version bump. */
  dueOn: z.optional(z.string()),
});

/** Personal bests for one grid-fill table. */
export const gridBestSchema = z.object({
  plays: count,
  /** Most cells solved in one round. */
  bestCells: count,
  /** Fastest complete round, in ms. Undefined until the table has been completed. */
  bestTimeMs: z.optional(count),
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
  startedAt: z.optional(z.string()),
  /** The daily mix, for its "done today" mark. Added without a version bump (optional). */
  daily: z.optional(z.object({ lastDone: z.string() })),
  /**
   * Today's daily mix as built when first opened, so it stays the same all day. Added
   * without a version bump (optional).
   */
  dailyMix: z.optional(z.object({ day: z.string(), ids: z.array(z.string()) })),
  /**
   * The questions that broke a long run of right answers (newest last), which the
   * daily mix leans towards. Added without a version bump (optional).
   */
  comboBreaks: z.optional(z.array(z.object({ questionId: z.string(), at: z.string() }))),
  /**
   * When each topic first reached Gemeistert, so its celebration shows once. Added
   * without a version bump (optional).
   */
  graduated: z.optional(z.record(z.string(), z.string())),
  /**
   * Nouns already introduced on a "new word" card, so each is shown once. Added
   * without a version bump (optional).
   */
  seenNouns: z.optional(z.array(z.string())),
});

export const COMBO_BREAKS_KEPT = 10;
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
