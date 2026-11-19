import type { Metadata } from 'next';

import { GameScreen } from '@/components/game/GameScreen';
import { Ui } from '@/components/ui';
import { TOPICS } from '@/content';
import { getTopicSummaries, modesByTopic, topicTitles } from '@/content/summaries';
import { DAILY_LENGTH } from '@/lib/game/daily';
import { COPY, dailyIntro } from '@/lib/i18n/copy';

export const metadata: Metadata = { title: 'Daily mix' };

export default function DailyPage() {
  const summaries = getTopicSummaries();
  return (
    <GameScreen
      mode="daily"
      topics={[...TOPICS]}
      title={<Ui {...COPY.daily.title} />}
      modeName={<Ui {...COPY.daily.title} />}
      description={dailyIntro(DAILY_LENGTH)}
      exitHref="/"
      exitLabel={<Ui {...COPY.common.home} />}
      modesByTopic={modesByTopic(summaries)}
      topicTitles={topicTitles(summaries)}
    />
  );
}
