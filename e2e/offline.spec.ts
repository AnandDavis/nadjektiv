import { expect, test, type Page } from '@playwright/test';

test.use({ serviceWorkers: 'allow' });

/** Load the app once online and wait until the service worker has finished precaching. */
async function installOffline(page: Page) {
  await page.goto('/');
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    // The worker activates only after its install step (the precache) has finished.
    if (registration.active?.state !== 'activated') {
      await new Promise<void>((resolve) =>
        registration.active?.addEventListener('statechange', () => resolve()),
      );
    }
  });
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
    .toBe(true);
}

test('pages never opened online still load and play offline', async ({ page, context }) => {
  await installOffline(page);
  await context.setOffline(true);

  // Full page loads of routes that were never visited.
  await page.goto('/topics/irregular-verbs');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Die 33 unregelmäßigen Verben' }),
  ).toBeVisible();

  await page.goto('/play/perfekt/build');
  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(page.getByRole('group', { name: 'Words to place' })).toBeVisible();

  // Grid fill loads in its own bundle; it must be precached too.
  await page.goto('/play/articles/grid');
  await page.getByRole('button', { name: /Der bestimmte Artikel/ }).click();
  await expect(page.getByRole('textbox', { name: 'Akk M' })).toBeVisible();

  await page.goto('/revise');
  await expect(page.getByText('Nichts zu wiederholen')).toBeVisible();
});

test('in-app navigation works offline', async ({ page, context }) => {
  await installOffline(page);
  await context.setOffline(true);

  await page.getByRole('link', { name: /Wechselpräpositionen/ }).click();
  await expect(page).toHaveURL(/\/topics\/two-way-prepositions$/);
  await page.getByRole('link', { name: /Blitz/ }).click();
  await expect(page).toHaveURL(/\/play\/two-way-prepositions\/sort$/);
  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(page.getByRole('group', { name: 'Sort into' })).toBeVisible();

  await page.getByRole('link', { name: 'Quit round' }).click();
  await expect(page).toHaveURL(/\/topics\/two-way-prepositions$/);
  // Offline, a navigation with no cached data falls back to a full page load from the
  // service worker, so the page can render twice in quick succession. Tap the way a
  // person would: once the page has settled, retrying if a reload swallowed the tap.
  const progressLink = page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: /Fortschritt/ });
  await expect(async () => {
    await progressLink.click({ timeout: 2_000 });
    await expect(page.getByRole('heading', { level: 1, name: 'Fortschritt' })).toBeVisible({
      timeout: 3_000,
    });
  }).toPass({ timeout: 20_000 });
});
