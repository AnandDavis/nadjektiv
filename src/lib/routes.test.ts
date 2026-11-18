import { describe, expect, it } from 'vitest';

import { RULES_HEADING_ID, topicBackHref, topicHref, topicRulesHref } from './routes';

describe('routes', () => {
  it('builds topic URLs, and a rules URL that targets the rules heading', () => {
    expect(topicHref('articles')).toBe('/topics/articles');
    expect(topicRulesHref('articles')).toBe(`/topics/articles#${RULES_HEADING_ID}`);
  });
});

describe('topic back links', () => {
  it('return to the progress page when opened from it, else to the topic list', () => {
    expect(topicHref('articles', 'progress')).toBe('/topics/articles?from=progress');
    expect(topicBackHref('progress')).toEqual({ href: '/progress', origin: 'progress' });
    expect(topicBackHref(null)).toEqual({ href: '/' });
    expect(topicBackHref('elsewhere')).toEqual({ href: '/' });
  });
});
