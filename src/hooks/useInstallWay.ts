'use client';

import { useSyncExternalStore } from 'react';

import { installWay, subscribeInstall, type InstallWay } from '@/lib/pwa/install';

/** How this browser can install the app; 'none' until known in the browser. */
export function useInstallWay(): InstallWay {
  return useSyncExternalStore(subscribeInstall, installWay, () => 'none');
}
