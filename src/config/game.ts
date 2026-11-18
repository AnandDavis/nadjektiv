/**
 * Gameplay tuning in one place: round lengths, the Blitz clock, points and levels.
 * Mastery tier thresholds live with their rules in src/lib/progress/mastery.ts.
 */
export const GAME_CONFIG = {
  /** Questions per round. Blitz is timed, so its value is the size of the queue. */
  sessionLength: { sort: 60, gap: 10, build: 8 },
  /** Length of a Blitz round. */
  sortRoundSeconds: 60,
  /** Questions in a mixed review round. */
  reviewLength: 12,
  points: {
    perCorrect: 10,
    /** Every comboStep correct answers in a row raises the multiplier by one. */
    comboStep: 5,
    maxMultiplier: 3,
    perfectBonusXp: 50,
  },
  /** Each level needs this much more XP than the last (100 → 300 → 600 …). */
  xpPerLevelStep: 100,
} as const;
