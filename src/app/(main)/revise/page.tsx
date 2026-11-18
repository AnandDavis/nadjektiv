import type { Metadata } from 'next';

import { ReviseView } from '@/components/revise/ReviseView';
import { TOPICS } from '@/content';
import { getTopicSummaries, topicTitles } from '@/content/summaries';

export const metadata: Metadata = { title: 'To revise' };

export default function RevisePage() {
  return <ReviseView topics={[...TOPICS]} topicTitles={topicTitles(getTopicSummaries())} />;
}
