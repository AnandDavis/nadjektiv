'use client';

import type { ReactNode } from 'react';

import { SegmentedControl, Shape, Ui } from '@/components/ui';
import {
  WELCOME_DAILY,
  WELCOME_GAMES,
  WELCOME_GENDERS,
  WELCOME_MISTAKES,
  WELCOME_PROGRESS,
  welcomeIntro,
} from '@/content/welcome';
import { useUiLanguage } from '@/hooks/useUiLanguage';
import { MODE_INFO } from '@/lib/game/modes';
import { COPY } from '@/lib/i18n/copy';
import type { UiLanguage } from '@/lib/storage/preferences';
import { MODE_SHAPES } from '@/lib/ui/shapes';

// Language names are always shown in their own language.
const LANGUAGE_OPTIONS: ReadonlyArray<{ value: UiLanguage; label: ReactNode }> = [
  { value: 'de', label: <span lang="de">Deutsch</span> },
  { value: 'en', label: <span lang="en">English</span> },
];

export function HelloStep({ topicCount }: { topicCount: number }) {
  const [language, setLanguage] = useUiLanguage();
  return (
    <div className="flex flex-col gap-8">
      <p className="text-lg text-ink">
        <Ui {...welcomeIntro(topicCount)} />
      </p>
      <SegmentedControl
        name="welcome-language"
        legend={<Ui {...COPY.welcome.language} />}
        hint={<Ui {...COPY.welcome.languageHint} />}
        value={language}
        options={LANGUAGE_OPTIONS}
        onChange={setLanguage}
      />
    </div>
  );
}

export function GamesStep() {
  return (
    <div className="flex flex-col gap-6">
      <ul className="border-t-2 border-ink">
        {WELCOME_GAMES.map(({ mode, line }) => {
          const shape = MODE_SHAPES[mode];
          return (
            <li key={mode} className="flex items-start gap-3 border-b-2 border-ink py-3">
              <Shape kind={shape.kind} color={shape.color} className="mt-1 text-2xl" />
              <div>
                <p className="text-lg leading-tight font-black text-ink">{MODE_INFO[mode].name}</p>
                <p className="text-sm text-ink">
                  <Ui {...line} />
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="flex items-start gap-3 text-sm text-ink">
        <span className="mt-0.5 flex shrink-0 gap-1" aria-hidden="true">
          <Shape kind="square" color="blue" />
          <Shape kind="circle" color="red" />
          <Shape kind="triangle" color="yellow" />
        </span>
        <Ui {...WELCOME_GENDERS} />
      </p>
      <p className="bg-blue px-3 py-2 text-sm font-bold text-on-blue">
        <Ui {...WELCOME_DAILY} />
      </p>
      <p className="text-sm text-ink">
        <Ui {...WELCOME_MISTAKES} />
      </p>
    </div>
  );
}

export function ProgressStep() {
  return (
    <ul className="border-t-2 border-ink">
      {WELCOME_PROGRESS.map((line) => (
        <li key={line.en} className="border-b-2 border-ink py-3 text-ink">
          <Ui {...line} />
        </li>
      ))}
    </ul>
  );
}
