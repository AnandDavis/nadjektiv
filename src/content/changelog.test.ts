import { describe, expect, it } from 'vitest';

import { CHANGELOG } from './changelog';
import { FEATURES } from './features';

describe('change log', () => {
  it('has valid UTC timestamps, newest first', () => {
    for (const entry of CHANGELOG) {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/);
      expect(Number.isNaN(Date.parse(entry.date))).toBe(false);
    }
    const times = CHANGELOG.map((e) => Date.parse(e.date));
    expect([...times].sort((a, b) => b - a)).toEqual(times);
  });

  it('has a title and description for every entry and feature', () => {
    for (const item of [...CHANGELOG, ...FEATURES]) {
      expect(item.title.trim()).not.toBe('');
      expect(item.description.trim().length).toBeGreaterThan(20);
    }
  });
});
