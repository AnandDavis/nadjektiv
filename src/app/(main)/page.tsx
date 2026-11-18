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
        <h1 className="font-display text-3xl font-bold text-ink">
          <Ui {...COPY.home.heading} />
        </h1>
      </header>
      <LevelCard />
      <ReviewCallout />
      <TopicList topics={topics} />
    </div>
  );
}
