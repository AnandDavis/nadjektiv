import { DailyCallout } from '@/components/progress/DailyCallout';
import { InstallHint } from '@/components/pwa/InstallHint';
import { LevelCard } from '@/components/progress/LevelCard';
import { ReviewCallout } from '@/components/progress/ReviewCallout';
import { TopicList } from '@/components/topics/TopicList';
import { getTopicSummaries } from '@/content/summaries';
import { Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';

export default function HomePage() {
  const topics = getTopicSummaries();
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-4xl leading-none font-black text-ink">
          <Ui {...COPY.home.heading} />
        </h1>
      </header>
      <DailyCallout show="pending" />
      <LevelCard />
      <InstallHint />
      <ReviewCallout />
      {/* Once today's mix is done it shrinks to a line above the search, out of the way. */}
      <DailyCallout show="done" />
      <TopicList topics={topics} />
    </div>
  );
}
