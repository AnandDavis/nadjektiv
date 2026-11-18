import { Ui } from '@/components/ui';
import { FEATURES } from '@/content/features';
import { COPY } from '@/lib/i18n/copy';

import { AboutSection } from './AboutSection';

export function FeatureList() {
  return (
    <AboutSection id="features" title={<Ui {...COPY.about.features} />}>
      <ul>
        {FEATURES.map((feature) => (
          <li key={feature.title} className="border-b-2 border-ink py-3">
            <h3 className="leading-tight font-black text-ink uppercase">{feature.title}</h3>
            <p className="mt-1 text-sm text-ink">{feature.description}</p>
          </li>
        ))}
      </ul>
    </AboutSection>
  );
}
