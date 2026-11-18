/**
 * Gameplay tuning in one place: round lengths, the Blitz clock, points and levels.
 * Mastery tier thresholds live with their rules in src/lib/progress/mastery.ts.
 */
export const GAME_CONFIG = {
  /** Questions per round. Blitz is timed, so its value is the size of the queue. */
  sessionLength: { sort: 60, gap: 10, build: 8, type: 10 },
  /** Length of a Blitz round. */
  sortRoundSeconds: 60,
  /** Prompts in an untimed Blitz round (an option in Settings), each asked once. */
  untimedSortLength: 20,
  /** With "move on after a right answer", how long the right answer shows first. */
  autoAdvanceMs: 900,
  /** Questions in a mixed review round. */
  reviewLength: 12,
  /** Questions in the daily mix. */
  dailyLength: 10,
  /** How many of the learner's weakest started topics the daily mix draws from. */
  dailyWeakTopics: 3,
  /** With nothing played yet, the daily mix comes from this many first topics. */
  dailyStarterTopics: 3,
  /** Daily mix weight on questions like one that recently broke a long run. */
  dailyBreakBoost: 3,
  /**
   * Spaced repetition for the revise list: a missed question comes back after the first
   * gap in days; each right answer when it's due moves it to the next gap, and a right
   * answer at the last one takes it off the list. A miss starts it again.
   */
  reviseIntervalsDays: [1, 3, 7],
  /** Questions in a level test (Prüfung), spread across every topic of the level. */
  examLength: 20,
  /** Lowest percentage for each grade, as on the Goethe-Zertifikat; below the last, not passed. */
  examGrades: { sehrGut: 90, gut: 80, befriedigend: 70, ausreichend: 60 },
  /** Days of answer history kept for the Progress charts. */
  historyDays: 120,
  /** Days in the answers-per-day chart, and weeks in the accuracy chart. */
  chartDays: 14,
  chartWeeks: 8,
  points: {
    perCorrect: 10,
    /** Every comboStep correct answers in a row raises the multiplier by one. */
    comboStep: 5,
    maxMultiplier: 3,
    perfectBonusXp: 50,
    /** A right answer after a hint scores this share of its points, and keeps the combo. */
    hintFactor: 0.5,
  },
  /** Each level needs this much more XP than the last (100 → 300 → 600 …). */
  xpPerLevelStep: 100,
} as const;
