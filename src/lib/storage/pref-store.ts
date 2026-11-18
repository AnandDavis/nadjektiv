/**
 * Reading and writing preferences in localStorage, with change notification. Shared
 * by the theme and language (preferences.ts) and the learner's options (options.ts).
 */

const listeners = new Set<() => void>();

export function subscribePreferences(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyPreferences(): void {
  for (const listener of listeners) listener();
}

export function readPreference(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Stores `value`, or removes the key for null (the default). */
export function writePreference(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Could not save preference ${key}.`, error);
  }
}
