import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// A brand-new visitor: nothing saved yet.
test.use({ storageState: { cookies: [], origins: [] } });

const HOME_HEADING = 'Was üben wir heute?';

test('a first visit opens the intro, and finishing it lands on home for good', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/welcome$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Willkommen bei Nadjektiv' }),
  ).toBeVisible();

  // Choosing English switches the rest of the intro straight away.
  await page.getByText('English', { exact: true }).filter({ visible: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Welcome to Nadjektiv' })).toBeVisible();

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Four games' })).toBeFocused();
  for (const game of ['Blitz', 'Lückentext', 'Satzbau', 'Tabelle']) {
    await expect(page.getByText(game, { exact: true })).toBeVisible();
  }

  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Welcome to Nadjektiv' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Your progress' })).toBeVisible();
  await page.getByRole('button', { name: 'Let’s go' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'What shall we practise today?' })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/\/$/);
});

test('the intro can be skipped from any step', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('button', { name: 'Überspringen' }).click();
  await expect(page.getByRole('heading', { name: HOME_HEADING })).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: HOME_HEADING })).toBeVisible();
});

test('links into the app are not redirected', async ({ page }) => {
  await page.goto('/topics/articles');
  await expect(page).toHaveURL(/\/topics\/articles$/);
});

test('About reopens the intro', async ({ page }) => {
  await page.goto('/welcome');
  await page.getByRole('button', { name: 'Überspringen' }).click();
  await page.goto('/about');
  await page.getByRole('link', { name: 'Einführung ansehen' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Willkommen bei Nadjektiv' }),
  ).toBeVisible();
});

test('every step of the intro has no accessibility violations', async ({ page }) => {
  await page.goto('/welcome');
  for (let step = 0; step < 3; step++) {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    if (step < 2) await page.getByRole('button', { name: 'Weiter' }).click();
  }
});
