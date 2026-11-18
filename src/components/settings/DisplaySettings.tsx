'use client';

import type { ReactNode } from 'react';

import { Card, SegmentedControl, Ui } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useUiLanguage } from '@/hooks/useUiLanguage';
import { COPY } from '@/lib/i18n/copy';
import { OPTIONS } from '@/lib/storage/options';
import type { ThemePreference, UiLanguage } from '@/lib/storage/preferences';

import { OptionControl } from './OptionControl';

const THEME_OPTIONS: ReadonlyArray<{ value: ThemePreference; label: ReactNode }> = [
  { value: 'system', label: <Ui {...COPY.settings.themeSystem} /> },
  { value: 'light', label: <Ui {...COPY.settings.themeLight} /> },
  { value: 'dark', label: <Ui {...COPY.settings.themeDark} /> },
];

// Language names are always shown in their own language.
const LANGUAGE_OPTIONS: ReadonlyArray<{ value: UiLanguage; label: ReactNode }> = [
  { value: 'de', label: <span lang="de">Deutsch</span> },
  { value: 'en', label: <span lang="en">English</span> },
];

export function DisplaySettings() {
  const [theme, setTheme] = useTheme();
  const [language, setLanguage] = useUiLanguage();
  return (
    <Card className="flex flex-col gap-6">
      <SegmentedControl
        name="ui-language"
        legend={<Ui {...COPY.settings.language} />}
        hint={<Ui {...COPY.settings.languageHint} />}
        value={language}
        options={LANGUAGE_OPTIONS}
        onChange={setLanguage}
      />
      <SegmentedControl
        name="theme"
        legend={<Ui {...COPY.settings.theme} />}
        value={theme}
        options={THEME_OPTIONS}
        onChange={setTheme}
      />
      <OptionControl
        option={OPTIONS.textSize}
        legend={COPY.settings.textSize}
        labels={{
          normal: COPY.settings.textNormal,
          large: COPY.settings.textLarge,
          larger: COPY.settings.textLarger,
        }}
      />
      <OptionControl
        option={OPTIONS.motion}
        legend={COPY.settings.motion}
        labels={{ system: COPY.settings.motionSystem, reduce: COPY.settings.motionReduce }}
      />
      <OptionControl
        option={OPTIONS.translations}
        legend={COPY.settings.translations}
        hint={COPY.settings.translationsHint}
        labels={{
          shown: COPY.settings.translationsShown,
          hidden: COPY.settings.translationsHidden,
        }}
      />
    </Card>
  );
}
