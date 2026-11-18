import { describe, expect, it } from 'vitest';

import { CHANGELOG } from '@/content/changelog';

import { changelogDays } from './changelog-days';

const entry = (date: string, title: string) => ({ date, title, description: '' });

describe('changelogDays', () => {
  it('puts entries from the same UTC day under one date, newest first', () => {
    const days = changelogDays([
      entry('2026-11-19T09:00Z', 'c'),
      entry('2026-11-18T19:00Z', 'b'),
      entry('2026-11-18T08:00Z', 'a'),
    ]);
    expect(days.map((d) => [d.day, d.entries.map((e) => e.title)])).toEqual([
      ['2026-11-19', ['c']],
      ['2026-11-18', ['b', 'a']],
    ]);
  });

  it('keeps every real entry', () => {
    const days = changelogDays(CHANGELOG);
    expect(days.flatMap((d) => d.entries)).toEqual(CHANGELOG);
  });
});
