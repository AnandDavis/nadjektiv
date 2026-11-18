'use client';

import { useSyncExternalStore } from 'react';

import { getServerSnapshot, getSnapshot, subscribe } from '@/lib/storage/progress-client';
import type { Progress } from '@/lib/progress/types';

/** Current learner progress, or null until the browser store has loaded. */
export function useProgress(): Progress | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
