import type { Page } from '@playwright/test';

/**
 * Switch the page to reduced motion, which drops every motion-safe animation at once.
 * Accessibility scans call this first: axe measures colour contrast on whatever is on
 * screen, and an element mid fade-in reads as faint.
 */
export async function settleMotion(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
}
