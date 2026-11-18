import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PlayScreen } from '@/components/game/PlayScreen';
import { Ui } from '@/components/ui';
import { TOPICS } from '@/content';
import { getTopicSummaries, modesByTopic, topicTitles } from '@/content/summaries';
import { EXAM_LENGTH, EXAM_LEVELS, levelFromParam } from '@/lib/exam/exam';
import { COPY, examHint, examTitle } from '@/lib/i18n/copy';

export function generateStaticParams() {
  return EXAM_LEVELS.map((level) => ({ level: level.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: PageProps<'/play/exam/[level]'>): Promise<Metadata> {
  const level = levelFromParam((await params).level);
  return level ? { title: examTitle(level).en } : {};
}

export default async function ExamPage({ params }: PageProps<'/play/exam/[level]'>) {
  const level = levelFromParam((await params).level);
  if (!level) notFound();
  const summaries = getTopicSummaries();
  const title = examTitle(level);
  return (
    <PlayScreen
      game={{
        mode: 'exam',
        examLevel: level,
        topics: TOPICS.filter((topic) => topic.level === level),
        title: <Ui {...title} />,
        modeName: <Ui {...title} />,
        description: examHint(level, EXAM_LENGTH).en,
        exitHref: '/',
        exitLabel: <Ui {...COPY.common.home} />,
        modesByTopic: modesByTopic(summaries),
        topicTitles: topicTitles(summaries),
      }}
    />
  );
}
