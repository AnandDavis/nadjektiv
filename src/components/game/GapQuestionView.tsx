'use client';

import { useMemo } from 'react';

import type { GapQuestion } from '@/content/types';
import { isEndingGap } from '@/lib/game/gap';
import { createRng, shuffle } from '@/lib/game/rng';
import { Shape } from '@/components/ui';
import { genderShape } from '@/lib/ui/shapes';
import { cn } from '@/lib/utils/cn';

import { optionKey, optionTextClass } from './bin-styles';
import type { LastAnswer } from '@/lib/game/game-reducer';

interface GapQuestionViewProps {
  question: GapQuestion;
  last?: LastAnswer;
  onAnswer: (isCorrect: boolean, given: string) => void;
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
        <p lang="de" className="text-3xl leading-snug font-extrabold text-ink">
          {question.before}
          <span
            className={cn(
              'mx-1 inline-block min-w-20 px-2 text-center align-baseline',
              !last && 'bg-ink text-ink',
              last?.isCorrect && 'bg-correct text-canvas',
              last && !last.isCorrect && 'bg-red text-on-red line-through decoration-4',
            )}
          >
            {filled ?? '\u00a0'}
          </span>
          {question.after}
        </p>
        <p className="translation mt-2 text-sm text-muted">{question.translation}</p>
      </div>
      <div className="flex flex-col gap-2" role="group" aria-label="Answer options">
        {options.map((option, index) => {
          const isAnswer = option === question.answer;
          const isChosen = last?.given === option;
          const shape = genderShape(option);
          return (
            <button
              key={option}
              type="button"
              disabled={Boolean(last)}
              onClick={() => onAnswer(isAnswer, option)}
              className={cn(
                'flex min-h-14 items-center gap-3 border-2 border-ink px-4 text-left text-xl font-extrabold transition-colors motion-safe:active:translate-y-px',
                !last && 'bg-surface hover:bg-yellow hover:text-on-yellow',
                !last && optionTextClass(option),
                last && isAnswer && 'bg-correct text-canvas',
                last &&
                  isChosen &&
                  !isAnswer &&
                  'bg-red text-on-red line-through decoration-4 motion-safe:animate-shake',
                last && !isAnswer && !isChosen && 'bg-surface text-ink opacity-40',
              )}
            >
              {shape && <Shape kind={shape.kind} color={shape.color} className="text-base" />}
              <span lang="de" className="flex-1">
                {ending ? `-${option}` : option}
              </span>
              <span className="text-sm font-black opacity-60" aria-hidden="true">
                {optionKey(index)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
