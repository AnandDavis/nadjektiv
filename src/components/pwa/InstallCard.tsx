'use client';

import { Button, Card, Ui } from '@/components/ui';
import { useInstallWay } from '@/hooks/useInstallWay';
import { COPY } from '@/lib/i18n/copy';
import { promptInstall } from '@/lib/pwa/install';

/** Settings: install the app, or how to on iPhone. Hidden once installed or if impossible. */
export function InstallCard() {
  const way = useInstallWay();
  if (way !== 'prompt' && way !== 'ios') return null;
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-xs font-extrabold tracking-widest text-ink uppercase">
        <Ui {...COPY.app.installTitle} />
      </h2>
      <p className="text-sm text-muted">
        <Ui {...COPY.app.installHint} />
      </p>
      {way === 'prompt' ? (
        <Button
          onClick={() => {
            promptInstall().catch((error: unknown) => console.warn('Install failed.', error));
          }}
        >
          <Ui {...COPY.app.install} />
        </Button>
      ) : (
        <p className="font-semibold text-ink">
          <Ui {...COPY.app.iosSteps} />
        </p>
      )}
    </Card>
  );
}
