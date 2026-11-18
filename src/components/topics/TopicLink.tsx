'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

import { setTopicOrigin, type TopicOrigin } from '@/lib/navigation/topic-origin';
import { topicHref } from '@/lib/routes';

type TopicLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  topicId: string;
  /** The page this link is on; omitted for the topic list, the default way back. */
  origin?: TopicOrigin;
  /** Defaults to the topic page; e.g. its rules section. */
  href?: string;
};

/** A link into a topic that tells the topic page where to go back to. */
export function TopicLink({ topicId, origin, href, onClick, ...props }: TopicLinkProps) {
  return (
    <Link
      href={href ?? topicHref(topicId)}
      onClick={(event) => {
        setTopicOrigin(topicId, origin ?? null);
        onClick?.(event);
      }}
      {...props}
    />
  );
}
