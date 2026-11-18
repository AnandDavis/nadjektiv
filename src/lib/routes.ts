/**
 * App URLs in one place, so links and the elements they point at can't drift apart.
 */

/** The id of the rules heading on a topic page; also its URL fragment. */
export const RULES_HEADING_ID = 'rules-heading';

export function topicHref(topicId: string): string {
  return `/topics/${topicId}`;
}

/** A topic page opened at its rules section. */
export function topicRulesHref(topicId: string): string {
  return `${topicHref(topicId)}#${RULES_HEADING_ID}`;
}
