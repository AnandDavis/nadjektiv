'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { readOption, writeOption, type OptionDef } from '@/lib/storage/options';
import { subscribePreferences } from '@/lib/storage/pref-store';

/** One of the learner's options, live: the default until the browser has read it. */
export function useOption<T extends string>(def: OptionDef<T>): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    subscribePreferences,
    () => readOption(def),
    () => def.fallback,
  );
  const set = useCallback((next: T) => writeOption(def, next), [def]);
  return [value, set];
}
