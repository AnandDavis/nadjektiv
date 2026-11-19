import { describe, expect, it } from 'vitest';

import { orderOptions } from './option-order';
import { createRng } from './rng';

describe('orderOptions', () => {
  it('always puts der, die, das in that order', () => {
    for (let seed = 1; seed < 20; seed++) {
      expect(orderOptions(['das', 'der', 'die'], createRng(seed))).toEqual(['der', 'die', 'das']);
    }
  });

  it('orders the case forms after the nominative ones, ignoring case', () => {
    expect(orderOptions(['dem', 'Des', 'den', 'Die'], createRng(3))).toEqual([
      'Die',
      'den',
      'dem',
      'Des',
    ]);
  });

  it('sorts noun pairs by their article and keeps both plurals', () => {
    const options = [
      'die Tisch, die Tische',
      'der Tisch, die Tischen',
      'der Tisch, die Tische',
      'die Tisch, die Tischen',
    ];
    const ordered = orderOptions(options, createRng(5));
    expect(ordered.map((o) => o.split(' ')[0])).toEqual(['der', 'der', 'die', 'die']);
    expect([...ordered].sort()).toEqual([...options].sort());
  });

  it('shuffles options that are not all articles', () => {
    const options = ['der', 'ein', 'die'];
    const orders = new Set(
      Array.from({ length: 20 }, (_, seed) => orderOptions(options, createRng(seed)).join()),
    );
    expect(orders.size).toBeGreaterThan(1);
  });
});
