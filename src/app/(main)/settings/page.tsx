import type { Metadata } from 'next';

import { DataSettings } from '@/components/settings/DataSettings';
import { ThemeSettings } from '@/components/settings/ThemeSettings';

export const metadata: Metadata = { title: 'Einstellungen' };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-bold text-ink">Einstellungen</h1>
      <ThemeSettings />
      <DataSettings />
    </div>
  );
}
