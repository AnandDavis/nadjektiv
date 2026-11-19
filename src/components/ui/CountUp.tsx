'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface CountUpProps {
  /** The final number. */
  to: number;
  /** How the number is shown, e.g. as a percentage. */
  format?: (n: number) => string;
  delayMs?: number;
}

/**
 * A number counting up from zero, for the eye only: pair it with the real value for
 * screen readers (it is aria-hidden).
 */
export function CountUp({ to, format = String, delayMs = 0 }: CountUpProps) {
  const shown = useCountUp(to, { from: 0, delayMs });
  return <span aria-hidden="true">{format(shown)}</span>;
}
