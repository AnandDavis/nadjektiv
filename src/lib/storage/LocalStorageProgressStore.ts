import { parseProgress } from '../progress/migrate';
import { createEmptyProgress, type Progress } from '../progress/types';
import { BACKUP_KEY_PREFIX, PROGRESS_KEY } from './keys';
import type { ProgressStore } from './progress-store';

export { BACKUP_KEY_PREFIX, PROGRESS_KEY };

/**
 * localStorage adapter. Validates and migrates on load; if stored data is corrupt it
 * keeps a backup copy before starting fresh, so nothing is silently lost.
 */
export class LocalStorageProgressStore implements ProgressStore {
  constructor(private readonly storage: Storage) {}

  load(): Progress {
    let raw: string | null;
    try {
      raw = this.storage.getItem(PROGRESS_KEY);
    } catch (error) {
      console.warn('Progress storage is unavailable; continuing in memory.', error);
      return createEmptyProgress();
    }
    if (raw === null) return createEmptyProgress();
    try {
      return parseProgress(JSON.parse(raw));
    } catch (error) {
      console.warn('Stored progress could not be read; backing it up and starting fresh.', error);
      this.backup(raw);
      return createEmptyProgress();
    }
  }

  save(progress: Progress): void {
    try {
      this.storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('Could not save progress (storage full or blocked).', error);
    }
  }

  clear(): void {
    try {
      this.storage.removeItem(PROGRESS_KEY);
    } catch (error) {
      console.warn('Could not clear progress.', error);
    }
  }

  onExternalChange(listener: () => void): () => void {
    const handler = (event: StorageEvent) => {
      if (event.key === PROGRESS_KEY || event.key === null) listener();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  private backup(raw: string): void {
    try {
      this.storage.setItem(`${BACKUP_KEY_PREFIX}${Date.now()}`, raw);
    } catch (error) {
      console.warn('Could not back up unreadable progress.', error);
    }
  }
}
