import { describe, expect, it } from 'vitest';

import { topicTitleTransition } from './transitions';

describe('topicTitleTransition', () => {
  it('names each topic title uniquely, as a valid CSS identifier', () => {
    expect(topicTitleTransition('two-way-prepositions')).toBe('topic-title-two-way-prepositions');
    expect(topicTitleTransition('a')).not.toBe(topicTitleTransition('b'));
  });
});
