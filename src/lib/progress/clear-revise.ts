import type { Progress } from './types';

/**
 * Empty the "to revise" list and nothing else: stats, medals, XP and bests stay.
 * Answer history is untouched, so the list refills only as new mistakes are made.
 */
export function clearReviseList(progress: Progress): Progress {
  return { ...progress, revise: {} };
}
