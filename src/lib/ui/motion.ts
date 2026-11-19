/**
 * Timing for the app's small animations. The CSS keyframes live in globals.css; these
 * are the parts JavaScript drives: counting numbers up and staggering a list.
 * Everything is skipped with reduced motion (phone setting or Settings › Bewegung).
 */

export const MOTION = {
  /** A number counting up to its value. */
  countUpMs: 500,
  /** The gap between result stats counting up one after another. */
  countStaggerMs: 150,
  /** The gap between items of a list that rise in one after another. */
  staggerMs: 60,
  /** The gap between squares of the topic map as their colours ripple in. */
  rippleStepMs: 20,
  /** No list waits longer than this before its last item starts. */
  maxStaggerMs: 600,
} as const;

/** Ease out (cubic): fast at first, settling at the end. `t` runs 0–1. */
export function easeOut(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - (1 - clamped) ** 3;
}

/** The whole number shown `elapsed` ms into counting from `from` to `to`. */
export function countUpAt(from: number, to: number, elapsed: number, duration: number): number {
  if (duration <= 0) return to;
  return Math.round(from + (to - from) * easeOut(elapsed / duration));
}

/** The delay before item `index` of a staggered list starts, capped for long lists. */
export function staggerDelay(index: number, stepMs: number = MOTION.staggerMs): number {
  return Math.min(index * stepMs, MOTION.maxStaggerMs);
}
