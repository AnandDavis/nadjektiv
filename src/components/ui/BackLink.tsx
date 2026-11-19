import Link from 'next/link';
import type { ReactNode } from 'react';

import { ArrowLeftIcon } from './icons';

/** "‹ Fortschritt": a small uppercase link back to the page above this one. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="-ml-2 flex min-h-11 w-fit items-center gap-1 px-2 text-xs font-extrabold tracking-widest text-ink uppercase hover:bg-ink hover:text-canvas"
    >
      <ArrowLeftIcon /> {children}
    </Link>
  );
}
