/**
 * Export and import progress as a JSON file, so learners can move devices before
 * accounts exist (and so accounts can import it later).
 */

import { APP_CONFIG, STORAGE_CONFIG } from '@/config/app';

import { parseProgress } from './migrate';
import type { Progress } from './types';

const EXPORT_APP = STORAGE_CONFIG.exportMarker;

interface ProgressExport {
  app: typeof EXPORT_APP;
  exportedAt: string;
  progress: Progress;
}

export function serialiseProgress(progress: Progress, exportedAt: string): string {
  const payload: ProgressExport = { app: EXPORT_APP, exportedAt, progress };
  return JSON.stringify(payload, null, 2);
}

/**
 * The largest progress file accepted. A heavy learner's export is tens of KB, so this
 * leaves ample room while refusing a file big enough to stall or crash the tab.
 */
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

/** Throws with a readable message if a file is too big to be a progress export. */
export function assertImportSize(bytes: number): void {
  if (bytes > MAX_IMPORT_BYTES) {
    throw new Error(`That file is too big to be a ${APP_CONFIG.name} progress export.`);
  }
}

/** Throws with a readable message if the file isn't a valid export. */
export function deserialiseProgress(text: string): Progress {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('That file isn’t valid JSON.');
  }
  if (typeof data !== 'object' || data === null || (data as { app?: unknown }).app !== EXPORT_APP) {
    throw new Error(`That file isn’t a ${APP_CONFIG.name} progress export.`);
  }
  return parseProgress((data as { progress?: unknown }).progress);
}
