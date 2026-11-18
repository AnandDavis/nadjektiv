'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChartIcon, HomeIcon, SettingsIcon, Ui } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { COPY } from '@/lib/i18n/copy';

const LINKS = [
  { href: '/', label: COPY.nav.learn, icon: HomeIcon },
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
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface pb-safe"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-3">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
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
                <Icon className={cn('text-xl', active && 'text-brand-strong')} />
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
