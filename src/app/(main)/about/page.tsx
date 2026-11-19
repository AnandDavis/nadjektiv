import type { Metadata } from 'next';

import { AppVersion } from '@/components/about/AppVersion';
import { ChangelogList } from '@/components/about/ChangelogList';
import { FeatureList } from '@/components/about/FeatureList';
import { LevelsExplainer } from '@/components/about/LevelsExplainer';
import { MedalsExplainer } from '@/components/about/MedalsExplainer';
import { ShortcutList } from '@/components/about/ShortcutList';
import { ButtonLink, Ui } from '@/components/ui';
import { APP_CONFIG } from '@/config/app';
import { GAME_MODES } from '@/content';
import { MODE_INFO } from '@/lib/game/modes';
import { COPY, aboutIntro, builtBy } from '@/lib/i18n/copy';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl leading-none font-black text-ink">
          <Ui {...COPY.header.about} />
        </h1>
        <p className="mt-1 text-muted">
          <Ui
            {...aboutIntro(
              APP_CONFIG.name,
              GAME_MODES.map((mode) => MODE_INFO[mode].name),
            )}
          />
        </p>
        <AppVersion />
        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink href="/welcome" variant="secondary">
            <Ui {...COPY.welcome.reopen} />
          </ButtonLink>
          <ButtonLink href="/glossary" variant="secondary">
            <Ui {...COPY.glossary.title} />
          </ButtonLink>
        </div>
      </header>
      <div className="border-b-4 border-ink">
        <FeatureList />
        <LevelsExplainer />
        <MedalsExplainer />
        <ShortcutList />
        <ChangelogList />
      </div>
      <p className="text-center text-xs font-extrabold tracking-widest text-muted uppercase">
        <Ui {...builtBy(APP_CONFIG.maker.name, APP_CONFIG.maker.place)} />
      </p>
    </div>
  );
}
