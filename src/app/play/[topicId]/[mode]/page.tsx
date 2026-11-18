import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PlayScreen } from '@/components/game/PlayScreen';
import { TOPICS, getTopic, isGameMode } from '@/content';
import { getTopicSummaries, modesByTopic, topicTitles } from '@/content/summaries';
import { MODE_INFO } from '@/lib/game/modes';
import { topicHref } from '@/lib/routes';
import { availableModes } from '@/lib/game/session';
import { Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';

export function generateStaticParams() {
  return TOPICS.flatMap((topic) =>
    availableModes(topic).map((mode) => ({ topicId: topic.id, mode })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<'/play/[topicId]/[mode]'>): Promise<Metadata> {
  const { topicId, mode } = await params;
  const topic = getTopic(topicId);
  if (!topic || !isGameMode(mode)) return {};
  return { title: `${MODE_INFO[mode].name} · ${topic.title}` };
}

export default async function PlayPage({ params }: PageProps<'/play/[topicId]/[mode]'>) {
  const { topicId, mode } = await params;
  const topic = getTopic(topicId);
  if (!topic || !isGameMode(mode) || !availableModes(topic).includes(mode)) notFound();
  const summaries = getTopicSummaries();
  const info = MODE_INFO[mode];

  if (mode === 'grid') {
    return (
      <PlayScreen
        grid={{
          topic,
          title: <Ui de={topic.titleDe} en={topic.title} />,
          exitHref: topicHref(topic.id),
          exitLabel: <Ui {...COPY.common.topic} />,
          modesByTopic: modesByTopic(summaries),
          topicTitles: topicTitles(summaries),
        }}
      />
    );
  }

  return (
    <PlayScreen
      game={{
        mode,
        topics: [topic],
        title: <Ui de={topic.titleDe} en={topic.title} />,
        modeName: `${info.name} · ${info.english}`,
        description: info.description,
        exitHref: topicHref(topic.id),
        exitLabel: <Ui {...COPY.common.topic} />,
        modesByTopic: modesByTopic(summaries),
        topicTitles: topicTitles(summaries),
      }}
    />
  );
}
