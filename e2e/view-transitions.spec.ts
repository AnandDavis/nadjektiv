import { expect, test, type Page } from '@playwright/test';

/** Count view transitions the page starts (Chromium supports the API). */
async function countTransitions(page: Page) {
  await page.addInitScript(() => {
    const start = document.startViewTransition?.bind(document);
    if (!start) return;
    (window as unknown as { transitions: number }).transitions = 0;
    document.startViewTransition = ((arg: Parameters<typeof start>[0]) => {
      (window as unknown as { transitions: number }).transitions += 1;
      return start(arg);
    }) as typeof document.startViewTransition;
  });
}

test('navigating from the topic list into a topic runs a view transition', async ({ page }) => {
  await countTransitions(page);
  await page.goto('/');
  await page.getByRole('link', { name: /der, die oder das\?/ }).click();
  await expect(page).toHaveURL(/\/topics\/noun-gender$/);
  const started = await page.evaluate(
    () => (window as unknown as { transitions: number }).transitions,
  );
  expect(started).toBeGreaterThan(0);
});
