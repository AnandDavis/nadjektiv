'use client';

import type { GridPuzzle } from '@/content/types';
import { cellKey, type CellKey, type GridRoundState } from '@/lib/grid/grid-round';
import { cn } from '@/lib/utils/cn';

interface GridBoardProps {
  grid: GridPuzzle;
  state: GridRoundState;
  /** Called with every keystroke in an unsolved cell. */
  onType?: (key: CellKey, value: string) => void;
  onFocusCell?: (key: CellKey) => void;
  onEnter?: (key: CellKey) => void;
  registerInput?: (key: CellKey, input: HTMLInputElement | null) => void;
}

// Columns size to their content (kept on one line); wide tables scroll sideways in their region.
const CELL = 'border-2 border-ink p-0 align-middle whitespace-nowrap';

/**
 * The table. While playing, unsolved cells are inputs and solved cells lock green.
 * Once finished it doubles as the answer key: missed cells show the answer in red,
 * with what was typed struck through.
 */
export function GridBoard({
  grid,
  state,
  onType,
  onFocusCell,
  onEnter,
  registerInput,
}: GridBoardProps) {
  const isPlaying = state.phase === 'playing';
  return (
    <div className="-mx-1 overflow-x-auto px-1" role="region" aria-label={grid.title} tabIndex={0}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-ink text-canvas">
            <th
              scope="col"
              className="px-2 py-1.5 text-xs font-extrabold tracking-wider whitespace-nowrap uppercase"
            >
              {grid.rowHeader}
            </th>
            {grid.columns.map((column) => (
              <th
                key={column}
                scope="col"
                lang="de"
                className="px-2 py-1.5 text-xs font-extrabold tracking-wider whitespace-nowrap uppercase"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.rows.map((row, r) => (
            <tr key={row.label}>
              <th
                scope="row"
                lang="de"
                className={cn(CELL, 'bg-sunken px-2 py-2 text-sm font-extrabold text-ink')}
              >
                {row.label}
              </th>
              {row.cells.map((cell, c) => {
                const key = cellKey(r, c);
                const typed = state.entries[key] ?? '';
                const isSolved = state.solved.includes(key);
                if (cell.given) {
                  return (
                    <td
                      key={key}
                      lang="de"
                      className={cn(CELL, 'bg-surface px-2 py-2 font-bold text-muted')}
                    >
                      {cell.answer}
                    </td>
                  );
                }
                if (isSolved) {
                  return (
                    <td
                      key={key}
                      lang="de"
                      className={cn(CELL, 'bg-correct px-2 py-2 font-extrabold text-canvas')}
                    >
                      {cell.answer}
                    </td>
                  );
                }
                if (!isPlaying) {
                  return (
                    <td
                      key={key}
                      lang="de"
                      className={cn(CELL, 'bg-wrong-soft px-2 py-1 text-ink')}
                    >
                      <span className="block font-extrabold text-wrong">{cell.answer}</span>
                      {typed.trim() && (
                        <span className="block text-xs text-muted line-through decoration-red decoration-2">
                          {typed}
                        </span>
                      )}
                    </td>
                  );
                }
                return (
                  <td key={key} className={cn(CELL, 'bg-surface')}>
                    <input
                      ref={(input) => registerInput?.(key, input)}
                      lang="de"
                      aria-label={`${row.label} ${grid.columns[c]}`}
                      value={typed}
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="next"
                      // A small intrinsic size lets the column, not the input, set the width.
                      size={1}
                      onChange={(event) => onType?.(key, event.target.value)}
                      onFocus={() => onFocusCell?.(key)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          onEnter?.(key);
                        }
                      }}
                      className="min-h-11 w-full min-w-16 bg-transparent px-2 text-base font-bold text-ink focus:bg-yellow focus:text-on-yellow focus:outline-none"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
