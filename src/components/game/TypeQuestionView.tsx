'use client';

import { useRef, useState, type FormEvent } from 'react';

import { UmlautKeys } from '@/components/grid/UmlautKeys';
import { Button, Ui } from '@/components/ui';
import type { GapQuestion } from '@/content/types';
import { useUiLanguage } from '@/hooks/useUiLanguage';
import { checkTyped } from '@/lib/game/check-typed';
import type { LastAnswer } from '@/lib/game/game-reducer';
import { COPY } from '@/lib/i18n/copy';
import { cn } from '@/lib/utils/cn';

interface TypeQuestionViewProps {
  question: GapQuestion;
  last?: LastAnswer;
  onAnswer: (isCorrect: boolean, given: string) => void;
}

/** Ending gaps (no space before the gap) are typed as the ending alone: "es". */
function isEndingGap(question: GapQuestion): boolean {
  return question.before.length > 0 && !/\s$/.test(question.before);
}

/** A gap question answered by typing, with ä ö ü ß keys for keyboards without them. */
export function TypeQuestionView({ question, last, onAnswer }: TypeQuestionViewProps) {
  const [language] = useUiLanguage();
  const [typed, setTyped] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const ending = isEndingGap(question);
  const isNearly = last !== undefined && checkTyped(question, last.given) === 'nearly';

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const given = typed.trim().replace(/\s+/g, ' ');
    if (!given || last) return;
    onAnswer(checkTyped(question, given) === 'correct', given);
  };

  const insert = (character: string) => {
    const field = input.current;
    if (!field || last) return;
    // Insert natively so text and caret move together, then let React see the change.
    field.focus();
    field.setRangeText(
      character,
      field.selectionStart ?? field.value.length,
      field.selectionEnd ?? field.value.length,
      'end',
    );
    field.dispatchEvent(new Event('input', { bubbles: true }));
  };

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
              last && !last.isCorrect && 'bg-red text-on-red line-through',
            )}
          >
            {last ? last.given : ' '}
          </span>
          {question.after}
        </p>
        <p className="mt-2 text-sm text-muted">{question.translation}</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <label
          htmlFor="typed-answer"
          className="text-xs font-extrabold tracking-widest text-ink uppercase"
        >
          <Ui {...COPY.typed.yourAnswer} />
        </label>
        <div className="flex items-stretch border-2 border-ink bg-surface focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-focus">
          {ending && (
            <span
              aria-hidden="true"
              className="flex items-center pl-3 text-2xl font-extrabold text-muted"
            >
              -
            </span>
          )}
          <input
            ref={input}
            id="typed-answer"
            lang="de"
            type="text"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            disabled={Boolean(last)}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="done"
            className="min-h-14 w-full min-w-0 bg-transparent px-3 text-2xl font-extrabold text-ink outline-none disabled:opacity-60"
          />
        </div>
        {!last && (
          <>
            <UmlautKeys label={COPY.grid.specialCharacters[language]} onInsert={insert} />
            <Button type="submit" size="lg" disabled={typed.trim() === ''}>
              <Ui {...COPY.typed.check} />
            </Button>
          </>
        )}
        {isNearly && (
          <p className="border-2 border-ink bg-yellow px-3 py-2 text-sm font-extrabold text-on-yellow">
            <Ui {...COPY.typed.nearly} />
          </p>
        )}
      </form>
    </div>
  );
}
