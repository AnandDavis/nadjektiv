'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChartIcon, HomeIcon, RepeatIcon, Ui } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { COPY } from '@/lib/i18n/copy';
import { dueCount } from '@/lib/revise/schedule';
import { dailyKey } from '@/lib/utils/day';
import { cn } from '@/lib/utils/cn';

const LINKS = [
  { href: '/', label: COPY.nav.learn, icon: HomeIcon },
  { href: '/revise', label: COPY.revise.navLabel, icon: RepeatIcon },
  { href: '/progress', label: COPY.nav.progress, icon: ChartIcon },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === '/'
    ? pathname === '/' || pathname.startsWith('/topics')
    : pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();
  const progress = useProgress();
  const toRevise = progress ? dueCount(progress.revise, dailyKey(new Date())) : 0;
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-10 bg-ink pb-safe text-canvas">
      <ul className="mx-auto grid max-w-xl grid-cols-3">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          const count = href === '/revise' ? toRevise : 0;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-extrabold tracking-wider uppercase transition-colors',
                  active ? 'bg-red text-on-red' : 'hover:bg-canvas hover:text-ink',
                )}
              >
                <span className="relative">
                  <Icon className="text-xl" />
                  {count > 0 && (
                    <span className="absolute -top-1.5 left-3.5 min-w-5 bg-yellow px-1 text-center text-xs leading-5 font-black text-on-yellow tabular-nums">
                      {count}
                      <span className="sr-only"> due to revise</span>
                    </span>
                  )}
                </span>
                <span>
                  <Ui {...label} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
