import { LevelCard } from '@/components/progress/LevelCard';
import { ReviewCallout } from '@/components/progress/ReviewCallout';
import { TopicList } from '@/components/topics/TopicList';
import { getTopicSummaries } from '@/content/summaries';

export default function HomePage() {
  const topics = getTopicSummaries();
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm font-bold tracking-wide text-brand-strong uppercase">
          Grammatik Games
        </p>
        <h1 className="font-display text-3xl font-bold text-ink">Was üben wir heute?</h1>
      </header>
      <LevelCard />
      <ReviewCallout />
      <TopicList topics={topics} />
    </div>
  );
}
