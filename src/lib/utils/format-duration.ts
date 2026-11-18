/** "1:05" for 65 seconds. Rounds down, so a round never looks faster than it was. */
export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/** A duration in ms as "1:05". */
export function formatDuration(ms: number): string {
  return formatClock(ms / 1000);
}
