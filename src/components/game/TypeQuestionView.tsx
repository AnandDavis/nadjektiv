'use client';

import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';

import { Button, OnScreenKeyboard, Ui } from '@/components/ui';
import type { GapQuestion } from '@/content/types';
import { useAppKeyboard } from '@/hooks/useAppKeyboard';
import { checkTyped } from '@/lib/game/check-typed';
import { isEndingGap } from '@/lib/game/gap';
import type { LastAnswer } from '@/lib/game/game-reducer';
import { COPY } from '@/lib/i18n/copy';
import { applyKey, type KeyAction } from '@/lib/text/caret-edit';
import { cn } from '@/lib/utils/cn';

interface TypeQuestionViewProps {
  question: GapQuestion;
  last?: LastAnswer;
  onAnswer: (isCorrect: boolean, given: string) => void;
}

/**
 * A gap question answered by typing: on a touch screen with the app's own German
 * keyboard (so the phone's keyboard never opens), otherwise with a real keyboard.
 */
export function TypeQuestionView({ question, last, onAnswer }: TypeQuestionViewProps) {
  const appKeyboard = useAppKeyboard();
  const [typed, setTyped] = useState('');
  const input = useRef<HTMLInputElement>(null);
  // Where the caret goes after an on-screen key, applied once React has re-rendered.
  const pendingCaret = useRef<number | null>(null);
  useLayoutEffect(() => {
    const caret = pendingCaret.current;
    if (caret === null || !input.current) return;
    input.current.setSelectionRange(caret, caret);
    pendingCaret.current = null;
  }, [typed]);
  const ending = isEndingGap(question);
  const isNearly = last !== undefined && checkTyped(question, last.given) === 'nearly';

  const check = () => {
    const given = typed.trim().replace(/\s+/g, ' ');
    if (!given || last) return;
    onAnswer(checkTyped(question, given) === 'correct', given);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    check();
  };

  const pressKey = (action: KeyAction) => {
    if (last) return;
    const field = input.current;
    const edit = applyKey(
      {
        value: typed,
        start: field?.selectionStart ?? typed.length,
        end: field?.selectionEnd ?? typed.length,
      },
      action,
    );
    pendingCaret.current = edit.caret;
    setTyped(edit.value);
  };

  // `contents` makes these direct children of the page column, so the key dock can
  // stick to the bottom of the whole page.
  return (
    <div className="contents">
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
            {last ? last.given : ' '}
          </span>
          {question.after}
        </p>
        <p className="translation mt-2 text-sm text-muted">{question.translation}</p>
      </div>

      <form id="typed-form" onSubmit={submit} className="flex flex-col gap-3">
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
            // The app's keyboard replaces the phone's: keep the field focused for the
            // caret and screen readers, but don't open the system keyboard.
            inputMode={appKeyboard ? 'none' : undefined}
            className="min-h-14 w-full min-w-0 bg-transparent px-3 text-2xl font-extrabold text-ink outline-none disabled:opacity-60"
          />
        </div>
        {isNearly && (
          <p className="border-2 border-ink bg-yellow px-3 py-2 text-sm font-extrabold text-on-yellow">
            <Ui {...COPY.typed.nearly} />
          </p>
        )}
      </form>
      {!last && (
        <div className="sticky bottom-0 z-10 bg-canvas py-2">
          {appKeyboard ? (
            <OnScreenKeyboard
              onKey={pressKey}
              onEnter={check}
              enterLabel={<Ui {...COPY.typed.check} />}
              canEnter={typed.trim() !== ''}
            />
          ) : (
            <Button
              type="submit"
              form="typed-form"
              size="lg"
              className="w-full"
              disabled={typed.trim() === ''}
            >
              <Ui {...COPY.typed.check} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
