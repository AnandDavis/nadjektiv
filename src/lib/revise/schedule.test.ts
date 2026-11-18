import { describe, expect, it } from 'vitest';

import { addDays, daysBetween } from '@/lib/utils/day';

import type { ReviseEntry } from '../progress/types';
import { afterMiss, afterRight, daysUntilDue, dueCount, isDue, stepsLeft } from './schedule';

const base: ReviseEntry = { topicId: 't', given: 'x', misses: 1, lastMissedAt: '' };

describe('day keys', () => {
  it('adds days across month and year ends', () => {
    expect(addDays('2026-11-29', 3)).toBe('2026-12-02');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(daysBetween('2026-11-29', '2026-12-06')).toBe(7);
  });
});

describe('revise schedule', () => {
  it('treats older entries without a date as due now, needing every step', () => {
    expect(isDue(base, '2026-11-18')).toBe(true);
    expect(stepsLeft(base)).toBe(3);
    expect(daysUntilDue(base, '2026-11-18')).toBe(0);
  });

  it('brings a miss back the next day', () => {
    expect(afterMiss('2026-11-18')).toEqual({ step: 0, dueOn: '2026-11-19' });
  });

  it('moves a due entry along 1, 3 then 7 days and clears it at the end', () => {
    const one = afterRight({ ...base, step: 0, dueOn: '2026-11-19' }, '2026-11-19')!;
    expect(one).toMatchObject({ step: 1, dueOn: '2026-11-22' });
    expect(daysUntilDue(one, '2026-11-19')).toBe(3);
    expect(stepsLeft(one)).toBe(2);
    expect(afterRight(one, '2026-11-20')).toBe(one);
    const two = afterRight(one, '2026-11-22')!;
    expect(two).toMatchObject({ step: 2, dueOn: '2026-11-29' });
    expect(afterRight(two, '2026-12-01')).toBeNull();
  });

  it('counts the entries due today', () => {
    expect(
      dueCount(
        { a: base, b: { ...base, dueOn: '2026-11-18' }, c: { ...base, dueOn: '2026-11-19' } },
        '2026-11-18',
      ),
    ).toBe(2);
  });
});
