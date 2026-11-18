import { Ui } from '@/components/ui';
import { SHORTCUT_LIST } from '@/lib/game/shortcuts';
import { COPY } from '@/lib/i18n/copy';

import { AboutSection } from './AboutSection';

/** The game keyboard shortcuts, for learners on a computer. */
export function ShortcutList() {
  return (
    <AboutSection id="shortcuts" title={<Ui {...COPY.about.shortcuts} />}>
      <p className="text-sm text-ink">
        <Ui {...COPY.about.shortcutsHint} />
      </p>
      <dl className="border-t-2 border-line">
        {SHORTCUT_LIST.map(({ keys, de, en }) => (
          <div key={keys} className="flex items-baseline gap-4 border-b-2 border-line py-2">
            <dt className="w-24 shrink-0 font-black text-ink tabular-nums">
              <kbd className="font-sans">{keys}</kbd>
            </dt>
            <dd className="text-sm text-ink">
              <Ui de={de} en={en} />
            </dd>
          </div>
        ))}
      </dl>
    </AboutSection>
  );
}
