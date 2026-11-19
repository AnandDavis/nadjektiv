import Link from 'next/link';

import {
  BookIcon,
  DropdownMenu,
  InfoIcon,
  MenuIcon,
  SettingsIcon,
  Shape,
  Ui,
  VerbIcon,
} from '@/components/ui';
import { APP_CONFIG } from '@/config/app';
import { COPY } from '@/lib/i18n/copy';
import { staggerDelay } from '@/lib/ui/motion';

const MENU_ITEMS = [
  { href: '/glossary', label: <Ui {...COPY.glossary.title} />, icon: <BookIcon /> },
  { href: '/verbs', label: <Ui {...COPY.verbs.title} />, icon: <VerbIcon /> },
  { href: '/settings', label: <Ui {...COPY.nav.settings} />, icon: <SettingsIcon /> },
  { href: '/about', label: <Ui {...COPY.header.about} />, icon: <InfoIcon /> },
] as const;

const SHAPES = [
  { kind: 'square', color: 'blue' },
  { kind: 'circle', color: 'red' },
  { kind: 'triangle', color: 'yellow' },
] as const;

/**
 * The persistent top bar: wordmark (home link), the three shapes, and the menu.
 * `celebrate` makes the shapes hop once, one after another, when a round ends.
 */
export function AppHeader({ celebrate = false }: { celebrate?: boolean }) {
  return (
    <header
      className="sticky top-0 z-10 bg-ink pt-safe text-canvas"
      // Stays put while the page under it cross-fades (globals.css).
      style={{ viewTransitionName: 'app-header' }}
    >
      <div className="mx-auto flex h-14 w-full max-w-xl items-center gap-3 px-4">
        <Link
          href="/"
          className="-ml-1 flex min-h-11 items-center px-1 text-xl font-black tracking-wider uppercase"
        >
          {APP_CONFIG.name}
        </Link>
        <span className="flex items-center gap-1 text-sm" aria-hidden="true">
          {SHAPES.map(({ kind, color }, index) => (
            <Shape
              key={kind}
              kind={kind}
              color={color}
              className={celebrate ? 'motion-safe:animate-nudge' : undefined}
              style={celebrate ? { animationDelay: `${staggerDelay(index)}ms` } : undefined}
            />
          ))}
        </span>
        <span className="ml-auto">
          <DropdownMenu label="Menu" trigger={<MenuIcon />} items={MENU_ITEMS} />
        </span>
      </div>
    </header>
  );
}
