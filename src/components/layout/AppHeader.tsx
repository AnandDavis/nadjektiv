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

const MENU_ITEMS = [
  { href: '/glossary', label: <Ui {...COPY.glossary.title} />, icon: <BookIcon /> },
  { href: '/verbs', label: <Ui {...COPY.verbs.title} />, icon: <VerbIcon /> },
  { href: '/settings', label: <Ui {...COPY.nav.settings} />, icon: <SettingsIcon /> },
  { href: '/about', label: <Ui {...COPY.header.about} />, icon: <InfoIcon /> },
] as const;

/** The persistent top bar: wordmark (home link), the three shapes, and the menu. */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 bg-ink pt-safe text-canvas">
      <div className="mx-auto flex h-14 w-full max-w-xl items-center gap-3 px-4">
        <Link
          href="/"
          className="-ml-1 flex min-h-11 items-center px-1 text-xl font-black tracking-wider uppercase"
        >
          {APP_CONFIG.name}
        </Link>
        <span className="flex items-center gap-1 text-sm" aria-hidden="true">
          <Shape kind="square" color="blue" />
          <Shape kind="circle" color="red" />
          <Shape kind="triangle" color="yellow" />
        </span>
        <span className="ml-auto">
          <DropdownMenu label="Menu" trigger={<MenuIcon />} items={MENU_ITEMS} />
        </span>
      </div>
    </header>
  );
}
