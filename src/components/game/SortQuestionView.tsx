'use client';

import type { SortQuestion } from '@/content/types';
import type { LastAnswer } from '@/lib/game/game-reducer';
import { cn } from '@/lib/utils/cn';

import { optionTextClass } from './bin-styles';

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
              className="mx-1 inline-block w-12 border-b-4 border-brand align-baseline"
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
    <div className="flex flex-1 flex-col gap-4">
      {instruction && <p className="text-center text-sm font-semibold text-muted">{instruction}</p>}
      <div
        key={question.id + (last ? '-answered' : '')}
        className={cn(
          'flex min-h-48 flex-1 flex-col items-center justify-center rounded-3xl border-2 bg-surface p-6 text-center shadow-card motion-safe:animate-pop',
          !last && 'border-line',
          last?.isCorrect && 'border-correct',
          last && !last.isCorrect && 'border-wrong motion-safe:animate-shake',
        )}
      >
        <p className="font-display text-3xl font-bold break-words text-ink">
          <PromptText prompt={question.prompt} />
        </p>
        {question.gloss && <p className="mt-2 text-muted">{question.gloss}</p>}
        {last && !last.isCorrect && (
          <p className="mt-3 font-semibold text-wrong">Answer: {question.answer}</p>
        )}
      </div>
      <div
        className={cn(
          'grid gap-3',
          bins.length === 2 ? 'grid-cols-2' : bins.length === 3 ? 'grid-cols-3' : 'grid-cols-2',
        )}
        role="group"
        aria-label="Sort into"
      >
        {bins.map((bin) => {
          const highlight = last && bin === question.answer;
          return (
            <button
              key={bin}
              type="button"
              disabled={Boolean(last)}
              onClick={() => onAnswer(bin === question.answer, bin)}
              className={cn(
                'min-h-16 rounded-2xl border-2 bg-surface px-2 text-lg font-bold shadow-raised transition motion-safe:active:translate-y-px',
                optionTextClass(bin),
                highlight ? 'border-correct bg-correct-soft' : 'border-line hover:bg-sunken',
              )}
            >
              {bin}
            </button>
          );
        })}
      </div>
    </div>
  );
}
