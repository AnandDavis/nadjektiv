import type { Metadata } from 'next';

import { AppVersion } from '@/components/about/AppVersion';
import { ChangelogList } from '@/components/about/ChangelogList';
import { FeatureList } from '@/components/about/FeatureList';
import { LevelsExplainer } from '@/components/about/LevelsExplainer';
import { MedalsExplainer } from '@/components/about/MedalsExplainer';
import { ButtonLink, Ui } from '@/components/ui';
import { APP_CONFIG } from '@/config/app';
import { COPY } from '@/lib/i18n/copy';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl leading-none font-black text-ink">
          <Ui {...COPY.header.about} />
        </h1>
        <p className="mt-1 text-muted">
          {APP_CONFIG.name}: {APP_CONFIG.description}
        </p>
        <AppVersion />
        <ButtonLink href="/welcome" variant="secondary" className="mt-4">
          <Ui {...COPY.welcome.reopen} />
        </ButtonLink>
      </header>
      <FeatureList />
      <LevelsExplainer />
      <MedalsExplainer />
      <ChangelogList />
    </div>
  );
}
