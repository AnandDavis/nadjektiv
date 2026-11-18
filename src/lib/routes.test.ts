import { describe, expect, it } from 'vitest';

import { RULES_HEADING_ID, topicHref, topicRulesHref } from './routes';

describe('routes', () => {
  it('builds topic URLs, and a rules URL that targets the rules heading', () => {
    expect(topicHref('articles')).toBe('/topics/articles');
    expect(topicRulesHref('articles')).toBe(`/topics/articles#${RULES_HEADING_ID}`);
  });
});
