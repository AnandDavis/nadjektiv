/**
 * View-transition names: an element with the same name on two screens morphs from one
 * to the other during navigation (React's <ViewTransition>). One per topic.
 */
export function topicTitleTransition(topicId: string): string {
  return `topic-title-${topicId}`;
}
