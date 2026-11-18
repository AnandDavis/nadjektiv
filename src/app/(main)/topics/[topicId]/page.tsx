import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RuleCards } from '@/components/topics/RuleCards';
import { TopicHeader } from '@/components/topics/TopicHeader';
import { TopicModes } from '@/components/topics/TopicModes';
import { TOPICS, getTopic } from '@/content';
import { availableModes } from '@/lib/game/session';

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ topicId: topic.id }));
}

export async function generateMetadata({
  params,
}: PageProps<'/topics/[topicId]'>): Promise<Metadata> {
  const { topicId } = await params;
  const topic = getTopic(topicId);
  return topic ? { title: topic.title, description: topic.tagline } : {};
}

export default async function TopicPage({ params }: PageProps<'/topics/[topicId]'>) {
  const { topicId } = await params;
  const topic = getTopic(topicId);
  if (!topic) notFound();
  const modes = availableModes(topic);

  return (
    <div className="flex flex-col gap-6">
      <TopicHeader
        topicId={topic.id}
        title={topic.title}
        titleDe={topic.titleDe}
        level={topic.level}
        tagline={topic.tagline}
        modes={modes}
      />
      <TopicModes topicId={topic.id} modes={modes} />
      <RuleCards rules={topic.rules} />
    </div>
  );
}
