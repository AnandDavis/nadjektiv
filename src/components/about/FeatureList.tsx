import { FoldSection, Ui } from '@/components/ui';
import { FEATURES } from '@/content/features';
import { COPY } from '@/lib/i18n/copy';

export function FeatureList() {
  return (
    <FoldSection id="features" title={<Ui {...COPY.about.features} />}>
      <ul>
        {FEATURES.map((feature) => (
          <li key={feature.title} className="border-b-2 border-ink py-3">
            <h3 className="leading-tight font-black text-ink uppercase">{feature.title}</h3>
            <p className="mt-1 text-sm text-ink">{feature.description}</p>
          </li>
        ))}
      </ul>
    </FoldSection>
  );
}
