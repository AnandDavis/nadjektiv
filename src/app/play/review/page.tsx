import type { Metadata } from 'next';

import { ReviewScreen } from '@/components/game/ReviewScreen';
import { Ui } from '@/components/ui';
import { TOPICS } from '@/content';
import { getTopicSummaries, modesByTopic, topicTitles } from '@/content/summaries';
import { REVIEW_LENGTH } from '@/lib/game/session';
import { COPY, reviewIntro } from '@/lib/i18n/copy';

export const metadata: Metadata = { title: 'Mixed review' };

export default function ReviewPage() {
  const summaries = getTopicSummaries();
  return (
    <ReviewScreen
      topics={[...TOPICS]}
      title={<Ui {...COPY.home.review} />}
      modeName={<Ui {...COPY.game.mixedReview} />}
      description={reviewIntro(REVIEW_LENGTH)}
      exitHref="/"
      exitLabel={<Ui {...COPY.common.home} />}
      modesByTopic={modesByTopic(summaries)}
      topicTitles={topicTitles(summaries)}
    />
  );
}
