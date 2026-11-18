import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('lets a later class override a conflicting one', () => {
    expect(cn('border-2 border-ink bg-surface p-4', 'p-0')).toBe(
      'border-2 border-ink bg-surface p-0',
    );
    expect(cn('bg-surface', 'bg-yellow')).toBe('bg-yellow');
  });

  it('keeps token colours and font sizes apart', () => {
    expect(cn('text-xs text-ink', 'text-muted')).toBe('text-xs text-muted');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b');
  });
});
