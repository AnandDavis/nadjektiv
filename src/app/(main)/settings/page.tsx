import type { Metadata } from 'next';

import { DataSettings } from '@/components/settings/DataSettings';
import { DisplaySettings } from '@/components/settings/DisplaySettings';
import { Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl leading-none font-black text-ink">
        <Ui {...COPY.nav.settings} />
      </h1>
      <DisplaySettings />
      <DataSettings />
    </div>
  );
}
