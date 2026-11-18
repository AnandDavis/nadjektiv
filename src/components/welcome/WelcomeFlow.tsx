'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button, Shape, Ui } from '@/components/ui';
import { APP_CONFIG } from '@/config/app';
import { COPY, stepOf, type Bilingual } from '@/lib/i18n/copy';
import { markWelcomeSeen } from '@/lib/storage/preferences';
import type { ShapeSpec } from '@/lib/ui/shapes';

import { GamesStep, HelloStep, ProgressStep } from './WelcomeSteps';

const STEP_HEADINGS: readonly Bilingual[] = [
  COPY.welcome.heading,
  COPY.welcome.games,
  COPY.welcome.progress,
];
const STEP_SHAPES: readonly ShapeSpec[] = [
  { kind: 'square', color: 'blue' },
  { kind: 'circle', color: 'red' },
  { kind: 'triangle', color: 'yellow' },
];

/** Three steps: what the app is (and its language), the games, how progress works. */
export function WelcomeFlow({ topicCount }: { topicCount: number }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const last = STEP_HEADINGS.length - 1;

  // Move focus to the new step's heading so screen readers announce it.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [step]);

  const finish = () => {
    markWelcomeSeen();
    router.replace('/');
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pt-safe pb-safe">
      <div className="flex min-h-14 items-center gap-3">
        <span className="text-xl font-black text-ink uppercase font-stretch-semi-expanded">
          {APP_CONFIG.name}
        </span>
        <span className="ml-auto">
          <Button variant="ghost" onClick={finish}>
            <Ui {...COPY.welcome.skip} />
          </Button>
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="flex gap-1.5 text-lg" aria-hidden="true">
          {STEP_SHAPES.map((shape, i) => (
            <Shape
              key={i}
              kind={shape.kind}
              color={i <= step ? shape.color : 'ink'}
              className={i <= step ? undefined : 'opacity-20'}
            />
          ))}
        </span>
        <p className="text-xs font-extrabold tracking-widest text-muted uppercase">
          <Ui {...stepOf(step + 1, STEP_HEADINGS.length)} />
        </p>
      </div>

      <h1
        ref={heading}
        tabIndex={-1}
        className="mt-3 mb-6 text-5xl leading-none font-black tracking-tight text-ink focus:outline-none"
      >
        <Ui {...STEP_HEADINGS[step]} />
      </h1>

      {step === 0 && <HelloStep topicCount={topicCount} />}
      {step === 1 && <GamesStep />}
      {step === 2 && <ProgressStep />}

      <div className="sticky bottom-0 mt-auto flex gap-3 bg-canvas pt-6 pb-6">
        {step > 0 && (
          <Button size="lg" variant="secondary" onClick={() => setStep(step - 1)}>
            <Ui {...COPY.welcome.back} />
          </Button>
        )}
        {step < last ? (
          <Button size="lg" className="flex-1" onClick={() => setStep(step + 1)}>
            <Ui {...COPY.welcome.next} />
          </Button>
        ) : (
          <Button size="lg" variant="accent" className="flex-1" onClick={finish}>
            <Ui {...COPY.welcome.start} />
          </Button>
        )}
      </div>
    </main>
  );
}
