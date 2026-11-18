import { describe, expect, it } from 'vitest';

import { formatClock, formatDuration } from './format-duration';

describe('formatClock', () => {
  it('formats minutes and zero-padded seconds', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(240)).toBe('4:00');
  });

  it('rounds down and never goes negative', () => {
    expect(formatClock(59.9)).toBe('0:59');
    expect(formatClock(-3)).toBe('0:00');
    expect(formatDuration(83_999)).toBe('1:23');
  });
});
