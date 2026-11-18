import type { Topic } from '@/content/types';

import type { ReviseEntry } from '../progress/types';
import { reviseCardFor, type ReviseCard } from './revise-card';

export interface ReviseGroup {
  topicId: string;
  items: Array<{ card: ReviseCard; entry: ReviseEntry }>;
}

/**
 * The revise list as cards grouped by topic, in learning order; within a topic the
 * most-missed come first, then the most recent. Retired questions are skipped.
 */
export function reviseGroups(
  topics: readonly Topic[],
  revise: Readonly<Record<string, ReviseEntry>>,
): ReviseGroup[] {
  const byTopic = new Map<string, ReviseGroup['items']>();
  for (const [questionId, entry] of Object.entries(revise)) {
    const card = reviseCardFor(topics, entry.topicId, questionId);
    if (!card) continue;
    const items = byTopic.get(entry.topicId) ?? [];
    items.push({ card, entry });
    byTopic.set(entry.topicId, items);
  }
  return topics
    .filter((topic) => byTopic.has(topic.id))
    .map((topic) => ({
      topicId: topic.id,
      items: byTopic
        .get(topic.id)!
        .sort(
          (a, b) =>
            b.entry.misses - a.entry.misses ||
            b.entry.lastMissedAt.localeCompare(a.entry.lastMissedAt),
        ),
    }));
}

/** Number of revise entries that still point at a real question. */
export function reviseCount(revise: Readonly<Record<string, ReviseEntry>>): number {
  return Object.keys(revise).length;
}
