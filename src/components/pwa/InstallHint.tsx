'use client';

import { useSyncExternalStore } from 'react';

import { Button, CrossIcon, Ui } from '@/components/ui';
import { STORAGE_CONFIG } from '@/config/app';
import { useInstallWay } from '@/hooks/useInstallWay';
import { useProgress } from '@/hooks/useProgress';
import { COPY } from '@/lib/i18n/copy';
import { promptInstall } from '@/lib/pwa/install';
import {
  notifyPreferences,
  readPreference,
  subscribePreferences,
  writePreference,
} from '@/lib/storage/pref-store';

const DISMISSED_KEY = `${STORAGE_CONFIG.keyPrefix}:install-hint-dismissed`;

/**
 * Home: a one-time nudge to install, once the learner has played (so it's tied to real
 * use). Dismissed for good with the cross; never shown once installed.
 */
export function InstallHint() {
  const way = useInstallWay();
  const progress = useProgress();
  const isDismissed = useSyncExternalStore(
    subscribePreferences,
    () => readPreference(DISMISSED_KEY) !== null,
    () => true,
  );
  const hasPlayed = progress !== null && Object.keys(progress.topics).length > 0;
  if (isDismissed || !hasPlayed || (way !== 'prompt' && way !== 'ios')) return null;

  const dismiss = () => {
    writePreference(DISMISSED_KEY, '1');
    notifyPreferences();
  };

  return (
    <div className="flex items-start gap-3 border-2 border-ink bg-surface p-4">
      <div className="flex flex-1 flex-col gap-2">
        <p className="font-black text-ink uppercase">
          <Ui {...COPY.app.installTitle} />
        </p>
        <p className="text-sm text-ink">
          <Ui {...(way === 'ios' ? COPY.app.iosSteps : COPY.app.installHint)} />
        </p>
        {way === 'prompt' && (
          <Button
            className="self-start"
            onClick={() => {
              dismiss();
              promptInstall().catch((error: unknown) => console.warn('Install failed.', error));
            }}
          >
            <Ui {...COPY.app.install} />
          </Button>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center text-ink hover:bg-ink hover:text-canvas"
      >
        <CrossIcon />
        <span className="sr-only">
          <Ui {...COPY.app.dismiss} />
        </span>
      </button>
    </div>
  );
}
