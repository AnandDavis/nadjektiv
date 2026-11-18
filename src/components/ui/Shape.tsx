import { cn } from '@/lib/utils/cn';
import type { ShapeColor, ShapeKind } from '@/lib/ui/shapes';

const FILL: Record<ShapeColor, string> = {
  blue: 'fill-blue',
  red: 'fill-red',
  yellow: 'fill-yellow',
  ink: 'fill-ink',
};

interface ShapeProps {
  kind: ShapeKind;
  color: ShapeColor;
  className?: string;
}

/** The Bauhaus marks: ■ ● ▲, and the ink ▦ for grid fill. Decorative; pair with text so meaning never relies on shape alone. */
export function Shape({ kind, color, className }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      width="1em"
      height="1em"
      className={cn('inline-block shrink-0', FILL[color], className)}
    >
      {kind === 'square' && <rect x="2" y="2" width="16" height="16" />}
      {kind === 'circle' && <circle cx="10" cy="10" r="8.5" />}
      {kind === 'triangle' && <polygon points="10,1.5 19,18.5 1,18.5" />}
      {kind === 'bar' && <rect x="7" y="1" width="6" height="18" />}
      {kind === 'grid' && (
        <>
          <rect x="2" y="2" width="7" height="7" />
          <rect x="11" y="2" width="7" height="7" />
          <rect x="2" y="11" width="7" height="7" />
          <rect x="11" y="11" width="7" height="7" />
        </>
      )}
    </svg>
  );
}
