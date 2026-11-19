'use client';

import { useEffect, useRef, useState } from 'react';

import { MOTION, countUpAt } from '@/lib/ui/motion';

/** Reduced motion, from the phone's setting or Settings › Bewegung (data-motion). */
function prefersReducedMotion(): boolean {
  return (
    document.documentElement.dataset.motion === 'reduce' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * A number that counts up (or down) to `target`: from `from` on first render, then
 * from wherever it was each time the target changes. Jumps straight there with
 * reduced motion. Show the real value to screen readers; this is for the eye.
 */
export function useCountUp(target: number, { from = target, delayMs = 0 } = {}): number {
  const [shown, setShown] = useState(from);
  const shownRef = useRef(from);

  useEffect(() => {
    const start = shownRef.current;
    if (start === target) return;
    // With reduced motion the count takes no time: the first frame shows the target.
    const reduced = prefersReducedMotion();
    const duration = reduced ? 0 : MOTION.countUpMs;
    let frame = 0;
    let began: number | null = null;
    const step = (now: number) => {
      began ??= now;
      const value = countUpAt(start, target, now - began, duration);
      shownRef.current = value;
      setShown(value);
      if (value !== target) frame = requestAnimationFrame(step);
    };
    const timer = window.setTimeout(
      () => {
        frame = requestAnimationFrame(step);
      },
      reduced ? 0 : delayMs,
    );
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, delayMs]);

  return shown;
}
