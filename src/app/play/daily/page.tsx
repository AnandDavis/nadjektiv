import type { Metadata } from 'next';

import { GameScreen } from '@/components/game/GameScreen';
import { Ui } from '@/components/ui';
import { TOPICS } from '@/content';
import { getTopicSummaries, modesByTopic, topicTitles } from '@/content/summaries';
import { DAILY_LENGTH } from '@/lib/game/daily';
import { COPY } from '@/lib/i18n/copy';

export const metadata: Metadata = { title: 'Daily mix' };

export default function DailyPage() {
  const summaries = getTopicSummaries();
  return (
    <GameScreen
      mode="daily"
      topics={[...TOPICS]}
      title={<Ui {...COPY.daily.title} />}
      modeName={<Ui {...COPY.daily.title} />}
      description={`${DAILY_LENGTH} questions from your revise list and your weakest topics. The same mix all day, and a new one tomorrow.`}
      exitHref="/"
      exitLabel={<Ui {...COPY.common.home} />}
      modesByTopic={modesByTopic(summaries)}
      topicTitles={topicTitles(summaries)}
    />
  );
}
