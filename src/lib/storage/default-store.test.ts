import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('default progress store', () => {
  it('uses localStorage when it is available', async () => {
    window.localStorage.setItem(
      'grammatik:progress',
      JSON.stringify({ version: 2, xp: 33, topics: {}, questions: {}, revise: {} }),
    );
    const client = await import('./progress-client');
    expect(client.getSnapshot().xp).toBe(33);
  });

  it('falls back to memory when localStorage is blocked', async () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const client = await import('./progress-client');
    client.updateProgress((p) => ({ ...p, xp: 5 }));
    expect(client.getSnapshot().xp).toBe(5);
  });
});
