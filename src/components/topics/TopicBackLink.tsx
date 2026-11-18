'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { ArrowLeftIcon, Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';
import { TOPIC_ORIGIN_PARAM, topicBackHref } from '@/lib/routes';

const CLASS =
  '-ml-2 flex min-h-11 w-fit items-center gap-1 px-2 text-xs font-extrabold tracking-widest text-ink uppercase hover:bg-ink hover:text-canvas';

function BackLink({ from }: { from: string | null }) {
  const back = topicBackHref(from);
  return (
    <Link href={back.href} className={CLASS}>
      <ArrowLeftIcon />{' '}
      <Ui {...(back.origin === 'progress' ? COPY.nav.progress : COPY.common.allTopics)} />
    </Link>
  );
}

function BackLinkFromParams() {
  return <BackLink from={useSearchParams().get(TOPIC_ORIGIN_PARAM)} />;
}

/**
 * Back to wherever the topic was opened from: the progress page if it says so in the
 * URL, otherwise the topic list. The page itself stays static: the URL is read in the
 * browser, with the topic-list link as the fallback until then.
 */
export function TopicBackLink() {
  return (
    <Suspense fallback={<BackLink from={null} />}>
      <BackLinkFromParams />
    </Suspense>
  );
}
