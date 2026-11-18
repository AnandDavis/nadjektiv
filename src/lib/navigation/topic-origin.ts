/**
 * Where the learner opened a topic from, so the topic's back link returns there. Kept
 * in memory for the session: links into a topic record their page, playing a round
 * leaves it alone, and a full reload (or arriving from elsewhere) falls back to the
 * topic list.
 */

export type TopicOrigin = 'progress' | 'revise' | 'glossary' | 'verbs';

export const ORIGIN_HREFS: Readonly<Record<TopicOrigin, string>> = {
  progress: '/progress',
  revise: '/revise',
  glossary: '/glossary',
  verbs: '/verbs',
};

let current: { topicId: string; origin: TopicOrigin } | null = null;
const listeners = new Set<() => void>();

export function subscribeTopicOrigin(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Record that `topicId` was opened from `origin`, or from the topic list (null). */
export function setTopicOrigin(topicId: string, origin: TopicOrigin | null): void {
  current = origin ? { topicId, origin } : null;
  for (const listener of listeners) listener();
}

/** Where this topic was opened from, if it is the one last opened. */
export function topicOrigin(topicId: string): TopicOrigin | null {
  return current?.topicId === topicId ? current.origin : null;
}
