/**
 * A new version of the app waiting to take over (its service worker is installed and
 * waiting). The update bar offers to switch; switching tells the worker to take over,
 * and the page reloads once it has.
 */

let waiting: ServiceWorker | null = null;
const listeners = new Set<() => void>();

export function subscribeUpdate(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function waitingUpdate(): ServiceWorker | null {
  return waiting;
}

export function setWaitingUpdate(worker: ServiceWorker | null): void {
  waiting = worker;
  for (const listener of listeners) listener();
}

/** Track a registration's waiting worker, now and whenever a new one finishes installing. */
export function watchForUpdates(registration: ServiceWorkerRegistration): void {
  // Only an update needs offering: with no controller this is the first install.
  const offer = () => {
    if (registration.waiting && navigator.serviceWorker.controller) {
      setWaitingUpdate(registration.waiting);
    }
  };
  offer();
  registration.addEventListener('updatefound', () => {
    const installing = registration.installing;
    installing?.addEventListener('statechange', () => {
      if (installing.state === 'installed') offer();
    });
  });
}

/** Switch to the waiting version, reloading once it controls the page. */
export function applyUpdate(): void {
  const worker = waiting;
  if (!worker) return;
  navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), {
    once: true,
  });
  worker.postMessage({ type: 'SKIP_WAITING' });
}
