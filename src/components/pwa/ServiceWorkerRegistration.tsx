'use client';

import { useEffect } from 'react';

import { captureInstallPrompt } from '@/lib/pwa/install';
import { watchForUpdates } from '@/lib/pwa/updates';

/**
 * Production: registers the offline service worker.
 * Development: removes any service worker (and its caches) left on this origin by an
 * earlier production build, so `next dev` is never served stale cached assets.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    captureInstallPrompt();
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      void removeLeftoverServiceWorkers();
      return;
    }

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then(watchForUpdates)
      .catch((error: unknown) => console.warn('Service worker registration failed.', error));
  }, []);
  return null;
}

async function removeLeftoverServiceWorkers(): Promise<void> {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length === 0) return;
    await Promise.all(registrations.map((registration) => registration.unregister()));
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    console.warn(
      `Removed ${registrations.length} production service worker(s) from this dev origin. Reload to load fresh assets.`,
    );
  } catch (error) {
    console.warn('Could not remove leftover service workers.', error);
  }
}
