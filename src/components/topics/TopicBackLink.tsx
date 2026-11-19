'use client';

import { useSyncExternalStore } from 'react';

import { BackLink, Ui } from '@/components/ui';
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
    <BackLink href={origin ? ORIGIN_HREFS[origin] : '/'}>
      <Ui {...(origin ? LABELS[origin] : COPY.common.allTopics)} />
    </BackLink>
  );
}
