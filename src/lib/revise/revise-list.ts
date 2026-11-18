import type { Topic } from '@/content/types';

import type { ReviseEntry } from '../progress/types';
import { reviseCardFor, type ReviseCard } from './revise-card';

export interface ReviseItem {
  card: ReviseCard;
  entry: ReviseEntry;
}

/**
 * The revise list as cards, most-missed first; among equals, the most recently missed
 * first. Questions that no longer exist in the content are skipped.
 */
export function reviseList(
  topics: readonly Topic[],
  revise: Readonly<Record<string, ReviseEntry>>,
): ReviseItem[] {
  const items: ReviseItem[] = [];
  for (const [questionId, entry] of Object.entries(revise)) {
    const card = reviseCardFor(topics, entry.topicId, questionId);
    if (card) items.push({ card, entry });
  }
  return items.sort(
    (a, b) =>
      b.entry.misses - a.entry.misses ||
      b.entry.lastMissedAt.localeCompare(a.entry.lastMissedAt) ||
      a.card.questionId.localeCompare(b.card.questionId),
  );
}

/** Number of revise entries that still point at a real question. */
export function reviseCount(revise: Readonly<Record<string, ReviseEntry>>): number {
  return Object.keys(revise).length;
}
