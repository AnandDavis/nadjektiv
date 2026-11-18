'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui';
import type { BuildQuestion } from '@/content/types';
import { formatSentence, isCorrectOrder, matchingOrder, wordsOf } from '@/lib/game/check-answer';
import type { LastAnswer } from '@/lib/game/game-reducer';
import { createRng, shuffle } from '@/lib/game/rng';
import { cn } from '@/lib/utils/cn';

interface BuildQuestionViewProps {
  question: BuildQuestion;
  last?: LastAnswer;
  onAnswer: (isCorrect: boolean, given: string) => void;
}

interface Tile {
  key: number;
  text: string;
}

function seedFor(id: string): number {
  return [...id].reduce((h, c) => (h * 33 + c.charCodeAt(0)) >>> 0, 11);
}

/** Shuffle the placeable tiles (commas excluded), never handing them out already in order. */
function shuffledTiles(question: BuildQuestion): Tile[] {
  const tiles = wordsOf(question.tiles).map((text, key) => ({ key, text }));
  const rng = createRng(seedFor(question.id));
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = shuffle(tiles, rng);
    if (
      !isCorrectOrder(
        question,
        candidate.map((t) => t.text),
      )
    )
      return candidate;
  }
  return [...tiles].reverse();
}

const TILE_CLASS =
  'min-h-12 border-2 border-ink bg-surface px-3 text-lg font-extrabold text-ink transition-colors hover:bg-yellow hover:text-on-yellow motion-safe:active:translate-y-px';

export function BuildQuestionView({ question, last, onAnswer }: BuildQuestionViewProps) {
  const pool = useMemo(() => shuffledTiles(question), [question]);
  const [chosen, setChosen] = useState<number[]>([]);
  const chosenTiles = chosen.map((key) => pool.find((t) => t.key === key)!);
  const remaining = pool.filter((t) => !chosen.includes(t.key));
  const isComplete = remaining.length === 0;

  function check() {
    const order = chosenTiles.map((t) => t.text);
    // A correct answer is shown with the commas of the order it matched.
    const matched = matchingOrder(question, order);
    onAnswer(matched !== undefined, formatSentence(matched ?? order, question.punctuation));
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-extrabold tracking-widest text-muted uppercase">Say in German</p>
        <p className="mt-1 text-2xl leading-snug font-extrabold text-ink">{question.translation}</p>
      </div>

      <div
        aria-label="Your sentence"
        className={cn(
          'flex min-h-28 flex-wrap content-start items-start gap-2 border-4 p-3',
          !last && 'border-ink bg-sunken',
          last?.isCorrect && 'border-correct bg-correct-soft',
          last && !last.isCorrect && 'border-red bg-wrong-soft',
        )}
      >
        {chosenTiles.length === 0 && (
          <p className="p-2 text-sm font-bold text-muted">Tap the words below in order</p>
        )}
        {chosenTiles.map((tile, i) => (
          <button
            key={tile.key}
            type="button"
            disabled={Boolean(last)}
            onClick={() => setChosen((keys) => keys.filter((k) => k !== tile.key))}
            className={cn(TILE_CLASS, 'motion-safe:animate-pop')}
            aria-label={`Remove ${tile.text}`}
          >
            {i === 0 ? tile.text.charAt(0).toUpperCase() + tile.text.slice(1) : tile.text}
          </button>
        ))}
        {isComplete && (
          <span className="self-center text-3xl font-black text-ink">{question.punctuation}</span>
        )}
      </div>

      {!last && (
        <>
          <div className="flex min-h-11 flex-wrap gap-2" role="group" aria-label="Words to place">
            {remaining.map((tile) => (
              <button
                key={tile.key}
                type="button"
                onClick={() => setChosen((keys) => [...keys, tile.key])}
                className={TILE_CLASS}
              >
                {tile.text}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setChosen([])}
              disabled={chosen.length === 0}
            >
              Clear
            </Button>
            <Button size="lg" onClick={check} disabled={!isComplete}>
              Check
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
