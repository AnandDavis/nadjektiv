'use client';

import { useSyncExternalStore } from 'react';

import { Button, Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';
import { applyUpdate, subscribeUpdate, waitingUpdate } from '@/lib/pwa/updates';

/**
 * "A new version is available" with a reload button. Lives in the main layout only, so
 * it never appears during a round: games and the intro are outside that layout.
 */
export function UpdateBar() {
  const hasUpdate = useSyncExternalStore(
    subscribeUpdate,
    () => waitingUpdate() !== null,
    () => false,
  );
  if (!hasUpdate) return null;
  return (
    <div role="status" className="border-b-2 border-ink bg-blue text-on-blue">
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-2">
        <p className="flex-1 text-sm font-bold">
          <Ui {...COPY.app.updateAvailable} />
        </p>
        <Button size="md" className="bg-on-yellow text-yellow" onClick={applyUpdate}>
          <Ui {...COPY.app.reload} />
        </Button>
      </div>
    </div>
  );
}
