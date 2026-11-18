import { afterEach, describe, expect, it, vi } from 'vitest';

import { setTopicOrigin, subscribeTopicOrigin, topicOrigin } from './topic-origin';

afterEach(() => setTopicOrigin('x', null));

describe('topic origin', () => {
  it('remembers where the last-opened topic came from, for that topic only', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeTopicOrigin(listener);
    setTopicOrigin('articles', 'progress');
    expect(listener).toHaveBeenCalled();
    expect(topicOrigin('articles')).toBe('progress');
    expect(topicOrigin('cases')).toBeNull();
    unsubscribe();
  });

  it('forgets it when a topic is opened from the topic list', () => {
    setTopicOrigin('articles', 'glossary');
    setTopicOrigin('articles', null);
    expect(topicOrigin('articles')).toBeNull();
  });
});
