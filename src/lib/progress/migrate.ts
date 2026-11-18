/**
 * Bring stored progress of any known version up to the current shape.
 * Add a step here whenever PROGRESS_VERSION is bumped; never drop learner data.
 */

import { progressSchema, type Progress } from './types';

type Migration = (data: Record<string, unknown>) => Record<string, unknown>;

/** MIGRATIONS[n] upgrades version n to version n + 1. */
const MIGRATIONS: Record<number, Migration> = {
  // v2 adds the "to revise" list. Earlier misses weren't recorded, so it starts empty.
  1: (data) => ({ ...data, version: 2, revise: {} }),
  // v3 adds grid-fill bests. No grid has been played before, so it starts empty.
  2: (data) => ({ ...data, version: 3, grids: {} }),
};

export class ProgressParseError extends Error {}

export function parseProgress(raw: unknown): Progress {
  if (typeof raw !== 'object' || raw === null) {
    throw new ProgressParseError('Stored progress is not an object');
  }
  let data = raw as Record<string, unknown>;
  let version = typeof data.version === 'number' ? data.version : 0;
  while (MIGRATIONS[version]) {
    data = MIGRATIONS[version](data);
    version += 1;
  }
  const parsed = progressSchema.safeParse(data);
  if (!parsed.success) {
    throw new ProgressParseError(`Stored progress is invalid: ${parsed.error.message}`);
  }
  return parsed.data;
}
