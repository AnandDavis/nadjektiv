import { Card, Ui } from '@/components/ui';
import { FEATURES } from '@/content/features';
import { COPY } from '@/lib/i18n/copy';

export function FeatureList() {
  return (
    <section aria-labelledby="features-heading">
      <h2 id="features-heading" className="mb-3 font-display text-xl font-bold text-ink">
        <Ui {...COPY.about.features} />
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <li key={feature.title}>
            <Card className="h-full">
              <h3 className="font-display font-bold text-ink">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted">{feature.description}</p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
