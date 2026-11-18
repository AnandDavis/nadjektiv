import { describe, expect, it } from 'vitest';

import { formatUtcTimestamp } from './format-date';

describe('formatUtcTimestamp', () => {
  it('formats in UTC regardless of the local time zone', () => {
    expect(formatUtcTimestamp('2026-11-18T13:02Z')).toBe('18 Nov 2026, 13:02 UTC');
    expect(formatUtcTimestamp('2026-01-05T09:07:00+02:00')).toBe('5 Jan 2026, 07:07 UTC');
  });

  it('rejects invalid timestamps', () => {
    expect(() => formatUtcTimestamp('yesterday')).toThrow(/Invalid timestamp/);
  });
});
