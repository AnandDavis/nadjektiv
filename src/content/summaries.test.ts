import { describe, expect, it } from 'vitest';

import { TOPICS } from './index';
import { getTopicSummaries, modesByTopic, topicTitles } from './summaries';

describe('topic summaries', () => {
  const summaries = getTopicSummaries();

  it('summarises every topic in learning order without the question banks', () => {
    expect(summaries.map((s) => s.id)).toEqual(TOPICS.map((t) => t.id));
    for (const summary of summaries) {
      expect(summary).not.toHaveProperty('gap');
      expect(summary.questionCount).toBeGreaterThan(0);
      expect(summary.modes.length).toBeGreaterThan(0);
    }
  });

  it('builds lookup maps for modes and titles', () => {
    expect(modesByTopic(summaries)['noun-gender']).toEqual(['sort', 'gap', 'type']);
    expect(topicTitles(summaries)['noun-gender']).toEqual({
      de: 'der, die oder das?',
      en: 'Noun gender',
    });
  });
});
