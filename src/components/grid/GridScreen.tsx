'use client';

import { useCallback, useRef, type ReactNode } from 'react';

import { SortTimer } from '@/components/game/SortTimer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button, CrossIcon, KeyboardDock, Ui } from '@/components/ui';
import type { GameMode, GridPuzzle, Topic } from '@/content/types';
import { useGridRound } from '@/hooks/useGridRound';
import { useProgress } from '@/hooks/useProgress';
import { useUiLanguage } from '@/hooks/useUiLanguage';
import { isCellCorrect } from '@/lib/grid/check-cell';
import { blankCells, type CellKey } from '@/lib/grid/grid-round';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import { insertAtCaret } from '@/lib/ui/insert-at-caret';

import { GridBoard } from './GridBoard';
import { GridPicker } from './GridPicker';
import { GridResults } from './GridResults';
import { UmlautKeys } from './UmlautKeys';

interface GridScreenProps {
  topic: Topic;
  title: ReactNode;
  exitHref: string;
  exitLabel: ReactNode;
  modesByTopic: Readonly<Record<string, readonly GameMode[]>>;
  topicTitles: Readonly<Record<string, Bilingual>>;
}

/** Grid fill: pick a table, fill it against the clock, see the answer key. */
export function GridScreen({
  topic,
  title,
  exitHref,
  exitLabel,
  modesByTopic,
  topicTitles,
}: GridScreenProps) {
  const progress = useProgress();
  const [language] = useUiLanguage();
  const { grid, state, outcome, start, type, finish, leave } = useGridRound({
    topicId: topic.id,
    modesByTopic,
  });

  const inputs = useRef(new Map<CellKey, HTMLInputElement>());
  const activeKey = useRef<CellKey | null>(null);

  const registerInput = useCallback((key: CellKey, input: HTMLInputElement | null) => {
    if (input) inputs.current.set(key, input);
    else inputs.current.delete(key);
  }, []);

  /** Focus the next unsolved cell after `key`, wrapping around. */
  const focusNext = useCallback(
    (key: CellKey, solved: readonly CellKey[]) => {
      if (!grid) return;
      const order = blankCells(grid).filter((k) => !solved.includes(k));
      if (order.length === 0) return;
      const all = blankCells(grid);
      const after = all.slice(all.indexOf(key) + 1).find((k) => order.includes(k));
      const target = after ?? order[0];
      // Wait for React to swap the solved cell's input out before moving focus.
      requestAnimationFrame(() => inputs.current.get(target)?.focus());
    },
    [grid],
  );

  const handleType = useCallback(
    (key: CellKey, value: string) => {
      if (!grid || !state) return;
      type(key, value);
      const [r, c] = key.split(':').map(Number);
      const cell = grid.rows[r]?.cells[c];
      if (cell && isCellCorrect(cell, value)) focusNext(key, [...state.solved, key]);
    },
    [grid, state, type, focusNext],
  );

  const handleInsert = useCallback((character: string) => {
    const key = activeKey.current;
    const input = key ? inputs.current.get(key) : undefined;
    if (!key || !input) return;
    insertAtCaret(input, character);
  }, []);

  const startGrid = useCallback(
    (next: GridPuzzle) => {
      start(next);
      window.scrollTo({ top: 0 });
      requestAnimationFrame(() => {
        const first = blankCells(next)[0];
        if (first) inputs.current.get(first)?.focus();
      });
    },
    [start],
  );

  if (!grid || !state) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-5 px-4 pt-4 pb-8">
        <GridPicker
          title={title}
          grids={topic.grids ?? []}
          bests={progress?.grids ?? {}}
          exitHref={exitHref}
          onStart={startGrid}
        />
      </main>
    );
  }

  const total = blankCells(grid).length;

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 pt-4 pb-8">
        {state.phase === 'playing' ? (
          <>
            <header className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Quit round"
                  onClick={leave}
                  className="-ml-2 flex size-11 shrink-0 items-center justify-center text-xl text-ink hover:bg-ink hover:text-canvas"
                >
                  <CrossIcon />
                </button>
                <h1 className="min-w-0 flex-1 truncate text-sm font-extrabold tracking-widest text-ink uppercase">
                  <Ui de={grid.titleDe} en={grid.title} />
                </h1>
                <span
                  aria-live="polite"
                  className="bg-ink px-2.5 py-1 text-lg font-black text-canvas tabular-nums"
                >
                  {state.solved.length}/{total}
                </span>
              </div>
              <SortTimer seconds={grid.seconds} isPaused={false} onExpire={finish} format="clock" />
              <p className="text-sm text-muted">
                <Ui {...COPY.grid.typeHint} />
              </p>
            </header>
            <GridBoard
              grid={grid}
              state={state}
              onType={handleType}
              onFocusCell={(key) => {
                activeKey.current = key;
              }}
              onEnter={(key) => focusNext(key, state.solved)}
              registerInput={registerInput}
            />
            <KeyboardDock className="mt-auto flex flex-col gap-2 pt-2 pb-safe">
              <UmlautKeys label={COPY.grid.specialCharacters[language]} onInsert={handleInsert} />
              <Button size="lg" variant="secondary" onClick={finish}>
                <Ui {...COPY.grid.done} />
              </Button>
            </KeyboardDock>
          </>
        ) : (
          <GridResults
            grid={grid}
            state={state}
            outcome={outcome}
            exitHref={exitHref}
            exitLabel={exitLabel}
            topicTitles={topicTitles}
            onPlayAgain={() => startGrid(grid)}
            onOtherTable={leave}
          />
        )}
      </main>
    </div>
  );
}
