'use client';

import { useMemo } from 'react';

import type { GapQuestion } from '@/content/types';
import { createRng, shuffle } from '@/lib/game/rng';
import { cn } from '@/lib/utils/cn';

import { optionTextClass } from './bin-styles';
import type { LastAnswer } from '@/lib/game/game-reducer';

interface GapQuestionViewProps {
  question: GapQuestion;
  last?: LastAnswer;
  onAnswer: (isCorrect: boolean, given: string) => void;
}

/** Ending gaps (no space before the gap) show options as "-es". */
function isEndingGap(question: GapQuestion): boolean {
  return question.before.length > 0 && !/\s$/.test(question.before);
}

function hashSeed(id: string): number {
  return [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
}

export function GapQuestionView({ question, last, onAnswer }: GapQuestionViewProps) {
  const options = useMemo(
    () => shuffle(question.options, createRng(hashSeed(question.id))),
    [question],
  );
  const ending = isEndingGap(question);
  const filled = last ? last.given : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-display text-2xl leading-relaxed font-semibold text-ink">
          {question.before}
          <span
            className={cn(
              'mx-0.5 inline-block min-w-16 rounded-lg border-b-4 px-1 text-center',
              !last && 'border-brand bg-sunken text-muted',
              last?.isCorrect && 'border-correct bg-correct-soft text-correct',
              last && !last.isCorrect && 'border-wrong bg-wrong-soft text-wrong line-through',
            )}
          >
            {filled ?? ' '}
          </span>
          {question.after}
        </p>
        <p className="mt-2 text-sm text-muted">{question.translation}</p>
      </div>
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Answer options">
        {options.map((option) => {
          const isAnswer = option === question.answer;
          const isChosen = last?.given === option;
          return (
            <button
              key={option}
              type="button"
              disabled={Boolean(last)}
              onClick={() => onAnswer(isAnswer, option)}
              className={cn(
                'min-h-14 rounded-2xl border-2 bg-surface px-3 text-lg font-semibold shadow-raised transition motion-safe:active:translate-y-px',
                optionTextClass(option),
                !last && 'border-line hover:bg-sunken',
                last && isAnswer && 'border-correct bg-correct-soft',
                last &&
                  isChosen &&
                  !isAnswer &&
                  'border-wrong bg-wrong-soft motion-safe:animate-shake',
                last && !isAnswer && !isChosen && 'border-line opacity-50',
              )}
            >
              {ending ? `-${option}` : option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
