import { afterEach, describe, expect, it, vi } from 'vitest';

import { readPersistence, requestPersistence } from './persistence';

function setStorage(storage: Partial<StorageManager> | undefined) {
  Object.defineProperty(navigator, 'storage', { configurable: true, value: storage });
}

afterEach(() => setStorage(undefined));

describe('persistence', () => {
  it('reports unsupported browsers', async () => {
    setStorage(undefined);
    expect(await readPersistence()).toBe('unsupported');
    expect(await requestPersistence()).toBe('unsupported');
  });

  it('asks only when not already persistent, and reports the answer', async () => {
    const persist = vi.fn().mockResolvedValue(true);
    setStorage({ persisted: vi.fn().mockResolvedValue(false), persist });
    expect(await readPersistence()).toBe('not-persisted');
    expect(await requestPersistence()).toBe('persisted');
    expect(persist).toHaveBeenCalledOnce();

    setStorage({ persisted: vi.fn().mockResolvedValue(true), persist });
    expect(await requestPersistence()).toBe('persisted');
    expect(persist).toHaveBeenCalledOnce();
  });

  it('treats a refusal or an error as not persisted', async () => {
    setStorage({
      persisted: vi.fn().mockResolvedValue(false),
      persist: vi.fn().mockResolvedValue(false),
    });
    expect(await requestPersistence()).toBe('not-persisted');
    setStorage({ persisted: vi.fn().mockRejectedValue(new Error('no')), persist: vi.fn() });
    expect(await requestPersistence()).toBe('not-persisted');
  });
});
