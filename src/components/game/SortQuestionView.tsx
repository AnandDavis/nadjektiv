'use client';

import type { SortQuestion } from '@/content/types';
import type { LastAnswer } from '@/lib/game/game-reducer';
import { Shape } from '@/components/ui';
import { genderShape } from '@/lib/ui/shapes';
import { cn } from '@/lib/utils/cn';

import { binFillClass } from './bin-styles';

interface SortQuestionViewProps {
  question: SortQuestion;
  bins: string[];
  instruction?: string;
  last?: LastAnswer;
  onAnswer: (isCorrect: boolean, given: string) => void;
}

function PromptText({ prompt }: { prompt: string }) {
  const parts = prompt.split('___');
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span
              className="mx-1 inline-block h-7 w-16 bg-ink align-text-bottom"
              aria-label="blank"
            />
          )}
        </span>
      ))}
    </>
  );
}

export function SortQuestionView({
  question,
  bins,
  instruction,
  last,
  onAnswer,
}: SortQuestionViewProps) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      {instruction && (
        <p className="text-xs font-extrabold tracking-widest text-muted uppercase">{instruction}</p>
      )}
      <div
        key={question.id + (last ? '-answered' : '')}
        className={cn(
          'flex min-h-48 flex-1 flex-col items-center justify-center border-4 p-6 text-center motion-safe:animate-pop',
          !last && 'border-ink bg-surface',
          last?.isCorrect && 'border-correct bg-correct text-canvas',
          last && !last.isCorrect && 'border-red bg-surface motion-safe:animate-shake',
        )}
      >
        <p
          lang="de"
          className={cn(
            'text-4xl font-black break-words',
            last?.isCorrect ? 'text-canvas' : 'text-ink',
          )}
        >
          <PromptText prompt={question.prompt} />
        </p>
        {question.gloss && (
          <p
            className={cn(
              'translation mt-2 font-semibold',
              last?.isCorrect ? 'text-canvas' : 'text-muted',
            )}
          >
            {question.gloss}
          </p>
        )}
      </div>
      <div
        className={cn('grid gap-2', bins.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}
        role="group"
        data-shortcuts="choices"
        aria-label="Sort into"
      >
        {bins.map((bin) => {
          const isAnswer = bin === question.answer;
          const shape = genderShape(bin);
          const fill = binFillClass(bin);
          return (
            <button
              key={bin}
              type="button"
              disabled={Boolean(last)}
              onClick={() => onAnswer(isAnswer, bin)}
              className={cn(
                'flex min-h-20 flex-col items-center justify-center gap-1 border-2 border-ink px-2 text-xl font-black transition motion-safe:active:translate-y-px',
                fill ?? 'bg-surface text-ink hover:bg-yellow hover:text-on-yellow',
                fill && !last && 'hover:brightness-110',
                last && !isAnswer && 'opacity-30',
                last && isAnswer && 'outline-4 outline-offset-2 outline-correct',
              )}
            >
              {shape && <Shape kind={shape.kind} color="ink" className="text-lg opacity-80" />}
              <span lang="de">{bin}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
