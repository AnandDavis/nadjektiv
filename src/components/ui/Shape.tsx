import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils/cn';
import type { ShapeColor, ShapeKind } from '@/lib/ui/shapes';

const FILL: Record<ShapeColor, string> = {
  blue: 'fill-blue',
  red: 'fill-red',
  yellow: 'fill-yellow',
  violet: 'fill-violet',
  ink: 'fill-ink',
  primaries: 'fill-ink',
};

/** The grid mark's squares, top-left to bottom-right, when coloured as `primaries`. */
const PRIMARY_CELLS = ['fill-blue', 'fill-red', 'fill-yellow', 'fill-ink'];
const GRID_CELLS = [
  { x: 2, y: 2 },
  { x: 11, y: 2 },
  { x: 2, y: 11 },
  { x: 11, y: 11 },
];

interface ShapeProps {
  kind: ShapeKind;
  color: ShapeColor;
  className?: string;
  /** For animation timing, e.g. a staggered delay. */
  style?: CSSProperties;
}

/** The Bauhaus marks: ■ ● ▲, and the ink ▦ for grid fill. Decorative; pair with text so meaning never relies on shape alone. */
export function Shape({ kind, color, className, style }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      width="1em"
      height="1em"
      className={cn('inline-block shrink-0', FILL[color], className)}
      style={style}
    >
      {kind === 'square' && <rect x="2" y="2" width="16" height="16" />}
      {kind === 'circle' && <circle cx="10" cy="10" r="8.5" />}
      {kind === 'triangle' && <polygon points="10,1.5 19,18.5 1,18.5" />}
      {kind === 'bar' && <rect x="7" y="1" width="6" height="18" />}
      {kind === 'grid' &&
        GRID_CELLS.map(({ x, y }, i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="7"
            height="7"
            className={color === 'primaries' ? PRIMARY_CELLS[i] : undefined}
          />
        ))}
    </svg>
  );
}
