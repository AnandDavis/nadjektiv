'use client';

import { useSyncExternalStore } from 'react';

import { OPTIONS, readOption } from '@/lib/storage/options';
import { subscribePreferences } from '@/lib/storage/pref-store';

const TOUCH = '(pointer: coarse)';

function subscribe(listener: () => void): () => void {
  const query = window.matchMedia(TOUCH);
  query.addEventListener('change', listener);
  const unsubscribe = subscribePreferences(listener);
  return () => {
    query.removeEventListener('change', listener);
    unsubscribe();
  };
}

function shouldUseAppKeyboard(): boolean {
  return readOption(OPTIONS.keyboard) === 'app' && window.matchMedia(TOUCH).matches;
}

/**
 * Whether Tippen and Tabelle show the app's own keyboard: on touch screens, unless the
 * learner chose the device keyboard. With a mouse or trackpad, the physical keyboard
 * is used. False until known in the browser.
 */
export function useAppKeyboard(): boolean {
  return useSyncExternalStore(subscribe, shouldUseAppKeyboard, () => false);
}
