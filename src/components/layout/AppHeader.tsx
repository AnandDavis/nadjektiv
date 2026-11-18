import Link from 'next/link';

import { DropdownMenu, InfoIcon, MenuIcon, SettingsIcon, Ui } from '@/components/ui';
import { APP_CONFIG } from '@/config/app';
import { COPY } from '@/lib/i18n/copy';

const MENU_ITEMS = [
  { href: '/settings', label: <Ui {...COPY.nav.settings} />, icon: <SettingsIcon /> },
  { href: '/about', label: <Ui {...COPY.header.about} />, icon: <InfoIcon /> },
] as const;

/** The persistent top bar: app name (home link) and the Settings / About menu. */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-canvas/95 pt-safe backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-xl items-center justify-between px-4">
        <Link
          href="/"
          className="-ml-2 flex min-h-11 items-center rounded-xl px-2 font-display text-xl font-bold text-ink"
        >
          {APP_CONFIG.name}
        </Link>
        <DropdownMenu label="Menu" trigger={<MenuIcon />} items={MENU_ITEMS} />
      </div>
    </header>
  );
}
