import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface SectionHeadingProps {
  id: string;
  children: ReactNode;
  /** Optional mark (icon or shape) before the text. */
  mark?: ReactNode;
  className?: string;
}

/** Section title: heavy uppercase type on a thick ink rule. */
export function SectionHeading({ id, children, mark, className }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className={cn(
        // scroll-mt clears the sticky app header when a link targets this heading.
        'mb-3 flex scroll-mt-20 items-center gap-2 border-b-4 border-ink pb-1 text-2xl font-black tracking-wide text-ink uppercase',
        className,
      )}
    >
      {mark}
      {children}
    </h2>
  );
}
