import { createEmptyProgress, type Progress } from '../progress/types';
import type { ProgressStore } from './progress-store';

/** In-memory store for tests, SSR, and browsers where storage is unavailable. */
export class MemoryProgressStore implements ProgressStore {
  private progress: Progress;

  constructor(initial: Progress = createEmptyProgress()) {
    this.progress = initial;
  }

  load(): Progress {
    return this.progress;
  }

  save(progress: Progress): void {
    this.progress = progress;
  }

  clear(): void {
    this.progress = createEmptyProgress();
  }
}
