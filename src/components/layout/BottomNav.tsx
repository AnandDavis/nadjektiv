'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChartIcon, HomeIcon, RepeatIcon, SettingsIcon, Ui } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { COPY } from '@/lib/i18n/copy';
import { reviseCount } from '@/lib/revise/revise-groups';
import { cn } from '@/lib/utils/cn';

const LINKS = [
  { href: '/', label: COPY.nav.learn, icon: HomeIcon },
  { href: '/revise', label: COPY.revise.navLabel, icon: RepeatIcon },
  { href: '/progress', label: COPY.nav.progress, icon: ChartIcon },
  { href: '/settings', label: COPY.nav.settings, icon: SettingsIcon },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === '/'
    ? pathname === '/' || pathname.startsWith('/topics')
    : pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();
  const progress = useProgress();
  const toRevise = progress ? reviseCount(progress.revise) : 0;
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface pb-safe"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          const count = href === '/revise' ? toRevise : 0;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold',
                  active ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                <span className="relative">
                  <Icon className={cn('text-xl', active && 'text-brand-strong')} />
                  {count > 0 && (
                    <span className="absolute -top-1.5 left-3.5 min-w-5 rounded-full bg-wrong px-1 text-center text-xs leading-5 font-bold text-surface tabular-nums">
                      {count}
                      <span className="sr-only"> to revise</span>
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
