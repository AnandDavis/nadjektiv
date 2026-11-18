import type { Metadata } from 'next';

import { ReviewScreen } from '@/components/game/ReviewScreen';
import { TOPICS } from '@/content';
import { getTopicSummaries, modesByTopic, topicTitles } from '@/content/summaries';
import { REVIEW_LENGTH } from '@/lib/game/session';

export const metadata: Metadata = { title: 'Mixed review' };

export default function ReviewPage() {
  const summaries = getTopicSummaries();
  return (
    <ReviewScreen
      topics={[...TOPICS]}
      title="Gemischte Wiederholung"
      modeName="Mixed review"
      description={`${REVIEW_LENGTH} questions from the topics you've played, weighted towards the ones you miss.`}
      exitHref="/"
      exitLabel="Home"
      modesByTopic={modesByTopic(summaries)}
      topicTitles={topicTitles(summaries)}
    />
  );
}
