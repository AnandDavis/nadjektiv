import { TierBadge } from '@/components/progress/TierBadge';
import { Card, Ui } from '@/components/ui';
import { MEDAL_RULES } from '@/lib/about/levels';
import { RECENT_WINDOW } from '@/lib/progress/types';
import { COPY } from '@/lib/i18n/copy';

import { AboutSection } from './AboutSection';

export function MedalsExplainer() {
  return (
    <AboutSection id="medals" title={<Ui {...COPY.about.tiers} />}>
      <Card>
        <p className="text-sm text-ink">
          Each topic earns its own medal from your accuracy over your last {RECENT_WINDOW} answers
          in it. A medal reflects what you know now: it can drop if you start getting a topic wrong,
          but never just because you took a break. Only answers you get without a hint count towards
          a medal; a wrong answer counts either way.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {MEDAL_RULES.map((rule) => (
            <li key={rule.tier} className="flex flex-wrap items-center gap-2 text-sm text-ink">
              <TierBadge tier={rule.tier} />
              <span>
                {rule.minAnswered} answers, {Math.round(rule.minAccuracy * 100)}% right
                {rule.needsAllModes && ', and every game mode played'}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </AboutSection>
  );
}
