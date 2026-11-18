import { Ui } from '@/components/ui';
import { APP_CONFIG } from '@/config/app';
import { currentBuild } from '@/lib/app-version';
import { COPY } from '@/lib/i18n/copy';

const ITEM = 'flex items-baseline gap-1.5';

/** Version, build commit and build time, so a learner can say which version they're on. */
export function AppVersion() {
  const build = currentBuild(APP_CONFIG.repositoryUrl);
  return (
    <dl
      data-testid="app-version"
      className="mt-3 flex flex-wrap items-baseline gap-x-5 text-xs font-extrabold tracking-widest text-muted uppercase tabular-nums"
    >
      <div className={ITEM}>
        <dt>
          <Ui {...COPY.about.version} />
        </dt>
        <dd className="text-ink">{build.version}</dd>
      </div>
      {build.commit && build.commitUrl && (
        <div className={ITEM}>
          <dt>
            <Ui {...COPY.about.build} />
          </dt>
          <dd>
            <a
              href={build.commitUrl}
              className="inline-flex min-h-11 items-center text-brand-strong normal-case underline underline-offset-4"
            >
              {build.commit}
            </a>
          </dd>
        </div>
      )}
      {build.builtAt && (
        <div className={ITEM}>
          <dt>
            <Ui {...COPY.about.builtAt} />
          </dt>
          <dd className="text-ink">{build.builtAt}</dd>
        </div>
      )}
    </dl>
  );
}
