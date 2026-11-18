'use client';

import { useSyncExternalStore } from 'react';

import {
  DEFAULT_UI_LANGUAGE,
  readUiLanguage,
  subscribePreferences,
  writeUiLanguage,
  type UiLanguage,
} from '@/lib/storage/preferences';

export function useUiLanguage(): [UiLanguage, (language: UiLanguage) => void] {
  const language = useSyncExternalStore(
    subscribePreferences,
    readUiLanguage,
    () => DEFAULT_UI_LANGUAGE,
  );
  return [language, writeUiLanguage];
}
