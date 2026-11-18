'use client';

import { useSyncExternalStore } from 'react';

import {
  readTheme,
  subscribePreferences,
  writeTheme,
  type ThemePreference,
} from '@/lib/storage/preferences';

export function useTheme(): [ThemePreference, (theme: ThemePreference) => void] {
  const theme = useSyncExternalStore(subscribePreferences, readTheme, () => 'system' as const);
  return [theme, writeTheme];
}
