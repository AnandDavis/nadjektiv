/**
 * App URLs in one place, so links and the elements they point at can't drift apart.
 */

/** The id of the rules heading on a topic page; also its URL fragment. */
export const RULES_HEADING_ID = 'rules-heading';

/** Pages that link into a topic and should be the topic page's way back. */
export type TopicOrigin = 'progress';

export const TOPIC_ORIGIN_PARAM = 'from';

/** A topic page; `from` makes its back link return there instead of to the topic list. */
export function topicHref(topicId: string, from?: TopicOrigin): string {
  return from ? `/topics/${topicId}?${TOPIC_ORIGIN_PARAM}=${from}` : `/topics/${topicId}`;
}

/** Where a topic page's back link goes, given its `from` parameter. */
export function topicBackHref(from: string | null): { href: string; origin?: TopicOrigin } {
  return from === 'progress' ? { href: '/progress', origin: 'progress' } : { href: '/' };
}

/** A topic page opened at its rules section. */
export function topicRulesHref(topicId: string): string {
  return `${topicHref(topicId)}#${RULES_HEADING_ID}`;
}
