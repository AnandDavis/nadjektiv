import { Ui } from '@/components/ui';
import { FEATURES } from '@/content/features';
import { COPY } from '@/lib/i18n/copy';

import { AboutSection } from './AboutSection';

export function FeatureList() {
  return (
    <AboutSection id="features" title={<Ui {...COPY.about.features} />}>
      <ol>
        {FEATURES.map((feature, index) => (
          <li key={feature.title} className="flex gap-3 border-b-2 border-ink py-3">
            <span className="w-7 shrink-0 text-right font-black text-muted tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="leading-tight font-black text-ink uppercase">{feature.title}</h3>
              <p className="mt-1 text-sm text-ink">{feature.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </AboutSection>
  );
}
