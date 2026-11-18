import { describe, expect, it } from 'vitest';

import { formatUtcDate } from './format-date';

describe('formatUtcDate', () => {
  it('gives the UTC calendar day, regardless of the local time zone', () => {
    expect(formatUtcDate('2026-11-18T13:02Z')).toBe('18 Nov 2026');
    expect(formatUtcDate('2026-01-05T01:07:00+02:00')).toBe('4 Jan 2026');
  });

  it('rejects invalid timestamps', () => {
    expect(() => formatUtcDate('yesterday')).toThrow(/Invalid timestamp/);
  });
});
