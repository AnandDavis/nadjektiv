import type { Topic } from '@/content/types';

import type { ReviseEntry } from '../progress/types';
import { reviseCardFor, type ReviseCard } from './revise-card';
import { isDue } from './schedule';

export interface ReviseItem {
  card: ReviseCard;
  entry: ReviseEntry;
}

/**
 * The revise list as cards: those due today first, then most-missed first; among
 * equals, the most recently missed first. Questions that no longer exist in the
 * content are skipped.
 */
export function reviseList(
  topics: readonly Topic[],
  revise: Readonly<Record<string, ReviseEntry>>,
  today: string,
): ReviseItem[] {
  const items: ReviseItem[] = [];
  for (const [questionId, entry] of Object.entries(revise)) {
    const card = reviseCardFor(topics, entry.topicId, questionId);
    if (card) items.push({ card, entry });
  }
  return items.sort(
    (a, b) =>
      Number(isDue(b.entry, today)) - Number(isDue(a.entry, today)) ||
      b.entry.misses - a.entry.misses ||
      b.entry.lastMissedAt.localeCompare(a.entry.lastMissedAt) ||
      a.card.questionId.localeCompare(b.card.questionId),
  );
}
