'use client';

import { useSyncExternalStore } from 'react';

import {
  readTheme,
  subscribeTheme,
  writeTheme,
  type ThemePreference,
} from '@/lib/storage/theme-store';

export function useTheme(): [ThemePreference, (theme: ThemePreference) => void] {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'system' as const);
  return [theme, writeTheme];
}
