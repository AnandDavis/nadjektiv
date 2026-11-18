'use client';

import { useEffect, useRef } from 'react';

import { Button, Shape, Ui } from '@/components/ui';
import type { Noun } from '@/content/nouns';
import { COPY } from '@/lib/i18n/copy';
import { genderShape } from '@/lib/ui/shapes';

interface NounRevealProps {
  noun: Noun;
  onDone: () => void;
}

/** A noun met for the first time: its shape, article and plural, before the question. */
export function NounReveal({ noun, onDone }: NounRevealProps) {
  const shape = genderShape(noun.gender);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => buttonRef.current?.focus(), []);

  return (
    <section aria-labelledby="new-word" className="flex flex-col gap-4 border-4 border-ink p-5">
      <p id="new-word" className="text-xs font-extrabold tracking-widest text-muted uppercase">
        <Ui {...COPY.game.newWord} />
      </p>
      <div className="flex items-center gap-4">
        {shape && <Shape kind={shape.kind} color={shape.color} className="text-5xl" />}
        <div className="min-w-0">
          <p lang="de" className="text-4xl leading-tight font-black break-words text-ink">
            {noun.gender} {noun.word}
          </p>
          {noun.plural ? (
            <p lang="de" className="text-xl font-bold text-ink">
              die {noun.plural}
            </p>
          ) : (
            <p className="text-xl font-bold text-ink">
              <Ui {...COPY.game.noPlural} />
            </p>
          )}
          <p className="translation text-sm text-muted">{noun.gloss}</p>
        </div>
      </div>
      <p className="text-sm text-muted">
        <Ui {...COPY.game.newWordHint} />
      </p>
      <Button ref={buttonRef} size="lg" data-shortcut="confirm" onClick={onDone}>
        <Ui {...COPY.game.gotIt} />
      </Button>
    </section>
  );
}
