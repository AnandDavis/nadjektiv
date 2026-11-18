/**
 * Anonymous usage counts (Vercel Web Analytics, cookie-free): which topics and games
 * get played. Only the topic id and game are sent; nothing about the learner. Calls
 * are queued and dropped silently where the analytics script isn't loaded (local
 * builds, offline).
 */

import { track } from '@vercel/analytics';

export function trackRound(mode: string, topicId?: string): void {
  try {
    track('round', { mode, topic: topicId ?? mode });
  } catch {
    // Analytics must never break a game.
  }
}
