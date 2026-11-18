import { GROUP_LABELS } from '@/content/groups';
import type { TopicSummary } from '@/content/summaries';
import type { TopicGroup } from '@/content/types';

interface GroupedTopics {
  group: TopicGroup;
  label: string;
  items: TopicSummary[];
}

/** Group topics in first-appearance order, keeping the registry's learning order within each. */
export function groupTopics(topics: readonly TopicSummary[]): GroupedTopics[] {
  const groups: GroupedTopics[] = [];
  for (const topic of topics) {
    let entry = groups.find((g) => g.group === topic.group);
    if (!entry) {
      entry = { group: topic.group, label: GROUP_LABELS[topic.group], items: [] };
      groups.push(entry);
    }
    entry.items.push(topic);
  }
  return groups;
}
