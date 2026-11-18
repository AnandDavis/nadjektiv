import { describe, expect, it } from 'vitest';

import { highlightParts } from './highlight';

describe('highlightParts', () => {
  it('splits around each phrase, in order, as whole words', () => {
    expect(highlightParts('Der Zug kommt um neun Uhr an.', ['kommt', 'an'])).toEqual([
      { text: 'Der Zug ', isHighlight: false },
      { text: 'kommt', isHighlight: true },
      { text: ' um neun Uhr ', isHighlight: false },
      { text: 'an', isHighlight: true },
      { text: '.', isHighlight: false },
    ]);
  });

  it('returns null when a phrase is missing', () => {
    expect(highlightParts('Ich helfe meiner Mutter.', ['meinem Vater'])).toBeNull();
    expect(highlightParts('Kanal', ['an'])).toBeNull();
  });
});
