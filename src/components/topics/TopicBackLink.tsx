'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

import { ArrowLeftIcon, Ui } from '@/components/ui';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import {
  ORIGIN_HREFS,
  subscribeTopicOrigin,
  topicOrigin,
  type TopicOrigin,
} from '@/lib/navigation/topic-origin';

const LABELS: Readonly<Record<TopicOrigin, Bilingual>> = {
  progress: COPY.nav.progress,
  revise: COPY.revise.title,
  glossary: COPY.glossary.title,
  verbs: COPY.verbs.title,
};

/** Back to wherever the topic was opened from, or the topic list. */
export function TopicBackLink({ topicId }: { topicId: string }) {
  const origin = useSyncExternalStore(
    subscribeTopicOrigin,
    () => topicOrigin(topicId),
    () => null,
  );
  return (
    <Link
      href={origin ? ORIGIN_HREFS[origin] : '/'}
      className="-ml-2 flex min-h-11 w-fit items-center gap-1 px-2 text-xs font-extrabold tracking-widest text-ink uppercase hover:bg-ink hover:text-canvas"
    >
      <ArrowLeftIcon /> <Ui {...(origin ? LABELS[origin] : COPY.common.allTopics)} />
    </Link>
  );
}
