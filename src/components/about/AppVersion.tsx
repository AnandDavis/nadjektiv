import { Ui } from '@/components/ui';
import { appVersion } from '@/lib/app-version';
import { COPY } from '@/lib/i18n/copy';

/** The app version, so a learner can say which version they're on. */
export function AppVersion() {
  return (
    <p
      data-testid="app-version"
      className="mt-3 text-xs font-extrabold tracking-widest text-muted uppercase tabular-nums"
    >
      <Ui {...COPY.about.version} /> <span className="text-ink">{appVersion()}</span>
    </p>
  );
}
