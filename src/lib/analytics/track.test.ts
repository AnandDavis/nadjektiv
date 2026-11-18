import { afterEach, describe, expect, it, vi } from 'vitest';

const track = vi.fn();
vi.mock('@vercel/analytics', () => ({ track: (...args: unknown[]) => track(...args) }));

const { trackRound } = await import('./track');

afterEach(() => track.mockReset());

describe('trackRound', () => {
  it('sends only the game and topic', () => {
    trackRound('gap', 'articles');
    trackRound('daily');
    expect(track.mock.calls).toEqual([
      ['round', { mode: 'gap', topic: 'articles' }],
      ['round', { mode: 'daily', topic: 'daily' }],
    ]);
  });

  it('never throws into a game', () => {
    track.mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => trackRound('sort', 'plurals')).not.toThrow();
  });
});
