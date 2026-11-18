import { describe, expect, it } from 'vitest';

import { TOPICS } from '@/content';
import { availableModes } from '@/lib/game/session';

import { hashString, precacheUrls } from './precache';

describe('precacheUrls', () => {
  const urls = precacheUrls();

  it('includes every page and every topic and game route', () => {
    for (const path of ['/', '/revise', '/progress', '/settings', '/about', '/play/review']) {
      expect(urls).toContain(path);
    }
    for (const topic of TOPICS) {
      expect(urls).toContain(`/topics/${topic.id}`);
      for (const mode of availableModes(topic)) expect(urls).toContain(`/play/${topic.id}/${mode}`);
    }
  });

  it('has no duplicates', () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe('hashString', () => {
  it('is stable and changes with its input', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).not.toBe(hashString('abd'));
  });
});
