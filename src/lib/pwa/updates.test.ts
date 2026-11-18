import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyUpdate,
  setWaitingUpdate,
  subscribeUpdate,
  waitingUpdate,
  watchForUpdates,
} from './updates';

function fakeRegistration(waiting: unknown) {
  const listeners: Record<string, () => void> = {};
  return {
    waiting,
    installing: null as null | {
      state: string;
      addEventListener: (t: string, f: () => void) => void;
    },
    addEventListener: (type: string, listener: () => void) => (listeners[type] = listener),
    fire: (type: string) => listeners[type]?.(),
  };
}

function setController(controller: unknown) {
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: { controller, addEventListener: vi.fn() },
  });
}

afterEach(() => setWaitingUpdate(null));

describe('updates', () => {
  it('offers a waiting worker only when a version already controls the page', () => {
    const worker = { postMessage: vi.fn() };
    setController(null);
    watchForUpdates(fakeRegistration(worker) as unknown as ServiceWorkerRegistration);
    expect(waitingUpdate()).toBeNull();

    setController({});
    const listener = vi.fn();
    const unsubscribe = subscribeUpdate(listener);
    watchForUpdates(fakeRegistration(worker) as unknown as ServiceWorkerRegistration);
    expect(waitingUpdate()).toBe(worker);
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it('offers a worker that finishes installing later', () => {
    setController({});
    const registration = fakeRegistration(null);
    watchForUpdates(registration as unknown as ServiceWorkerRegistration);
    expect(waitingUpdate()).toBeNull();

    const stateListeners: Array<() => void> = [];
    const worker = { postMessage: vi.fn() };
    registration.installing = {
      state: 'installing',
      addEventListener: (_t, f) => stateListeners.push(f),
    };
    registration.fire('updatefound');
    registration.installing.state = 'installed';
    registration.waiting = worker;
    stateListeners.forEach((f) => f());
    expect(waitingUpdate()).toBe(worker);
  });

  it('applies an update by telling the waiting worker to take over', () => {
    setController({});
    applyUpdate();
    const worker = { postMessage: vi.fn() };
    setWaitingUpdate(worker as unknown as ServiceWorker);
    applyUpdate();
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
  });
});
