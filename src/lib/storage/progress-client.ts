/**
 * The single in-browser source of progress for React. Wraps a ProgressStore with a
 * cached snapshot and listeners so components can use useSyncExternalStore.
 */

import type { Progress } from '../progress/types';
import { LocalStorageProgressStore } from './LocalStorageProgressStore';
import { MemoryProgressStore } from './MemoryProgressStore';
import type { ProgressStore } from './progress-store';

type Listener = () => void;

let store: ProgressStore | null = null;
let snapshot: Progress | null = null;
let detachExternal: (() => void) | null = null;
const listeners = new Set<Listener>();

function createDefaultStore(): ProgressStore {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return new LocalStorageProgressStore(window.localStorage);
    }
  } catch {
    // Accessing localStorage throws when storage is blocked; fall through.
  }
  return new MemoryProgressStore();
}

function getStore(): ProgressStore {
  store ??= createDefaultStore();
  return store;
}

function emit(): void {
  for (const listener of listeners) listener();
}

/** Swap the backing store (tests, or a future signed-in remote store). */
export function setProgressStore(next: ProgressStore): void {
  detachExternal?.();
  detachExternal = null;
  store = next;
  snapshot = null;
  if (listeners.size > 0) attachExternal();
  emit();
}

function attachExternal(): void {
  detachExternal =
    getStore().onExternalChange?.(() => {
      snapshot = null;
      emit();
    }) ?? null;
}

export function subscribe(listener: Listener): () => void {
  if (listeners.size === 0) attachExternal();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      detachExternal?.();
      detachExternal = null;
    }
  };
}

export function getSnapshot(): Progress {
  snapshot ??= getStore().load();
  return snapshot;
}

/** Progress is browser-only; the server renders the "not loaded yet" state. */
export function getServerSnapshot(): null {
  return null;
}

export function updateProgress(update: (current: Progress) => Progress): Progress {
  const next = update(getSnapshot());
  snapshot = next;
  getStore().save(next);
  emit();
  return next;
}

export function resetProgress(): void {
  getStore().clear();
  snapshot = null;
  emit();
}
