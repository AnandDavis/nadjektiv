import { afterEach, describe, expect, it, vi } from 'vitest';

import { createEmptyProgress } from '../progress/types';
import { MemoryProgressStore } from './MemoryProgressStore';
import {
  getServerSnapshot,
  getSnapshot,
  resetProgress,
  setProgressStore,
  subscribe,
  updateProgress,
} from './progress-client';
import type { ProgressStore } from './progress-store';

afterEach(() => setProgressStore(new MemoryProgressStore()));

describe('progress client', () => {
  it('has no server snapshot, because progress lives in the browser', () => {
    expect(getServerSnapshot()).toBeNull();
  });

  it('loads once and returns a stable snapshot', () => {
    const store = new MemoryProgressStore({ ...createEmptyProgress(), xp: 7 });
    const load = vi.spyOn(store, 'load');
    setProgressStore(store);
    expect(getSnapshot().xp).toBe(7);
    expect(getSnapshot()).toBe(getSnapshot());
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('saves updates and notifies subscribers', () => {
    const store = new MemoryProgressStore();
    setProgressStore(store);
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);
    updateProgress((p) => ({ ...p, xp: p.xp + 10 }));
    expect(getSnapshot().xp).toBe(10);
    expect(store.load().xp).toBe(10);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    updateProgress((p) => ({ ...p, xp: 20 }));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('resets progress through the store', () => {
    setProgressStore(new MemoryProgressStore({ ...createEmptyProgress(), xp: 99 }));
    resetProgress();
    expect(getSnapshot().xp).toBe(0);
  });

  it('reloads when the store reports a change from another tab', () => {
    let external: (() => void) | undefined;
    let stored = createEmptyProgress();
    const store: ProgressStore = {
      load: () => stored,
      save: (p) => {
        stored = p;
      },
      clear: () => {
        stored = createEmptyProgress();
      },
      onExternalChange: (listener) => {
        external = listener;
        return () => {
          external = undefined;
        };
      },
    };
    setProgressStore(store);
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);
    expect(getSnapshot().xp).toBe(0);

    stored = { ...createEmptyProgress(), xp: 42 };
    external?.();
    expect(listener).toHaveBeenCalled();
    expect(getSnapshot().xp).toBe(42);

    unsubscribe();
    expect(external).toBeUndefined();
  });
});
