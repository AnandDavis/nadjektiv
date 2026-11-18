import type { Progress } from '../progress/types';

/**
 * Port for persisting learner progress. Today: localStorage. Later: a server-backed
 * store per signed-in user. UI and domain code depend only on this interface.
 */
export interface ProgressStore {
  load(): Progress;
  save(progress: Progress): void;
  clear(): void;
  /** Notified when progress changes outside this tab (e.g. another tab). */
  onExternalChange?(listener: () => void): () => void;
}
