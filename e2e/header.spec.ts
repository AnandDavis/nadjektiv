import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const appHeader = (page: Page) =>
  page.getByRole('banner').filter({ has: page.getByRole('link', { name: 'Nadjektiv' }) });

test('the app header is on every page except the quiz intro', async ({ page }) => {
  for (const path of ['/', '/revise', '/progress', '/topics/articles']) {
    await page.goto(path);
    await expect(appHeader(page)).toBeVisible();
  }

  await page.goto('/play/articles/gap');
  await expect(page.getByRole('button', { name: /Los geht/ })).toBeVisible();
  await expect(appHeader(page)).toHaveCount(0);

  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(appHeader(page)).toBeVisible();
});

test('the quiz intro has its own way out, since it has no header', async ({ page }) => {
  await page.goto('/play/articles/gap');
  await page.getByRole('link', { name: 'Close' }).click();
  await expect(page).toHaveURL(/\/topics\/articles$/);
});

test('the menu opens Settings and About, and closes with Escape', async ({ page }) => {
  await page.goto('/');
  const menuButton = page.getByRole('button', { name: 'Menu' });

  await menuButton.click();
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Einstellungen' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Glossar' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Über die App' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await page.getByRole('menuitem', { name: 'Über die App' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { name: 'Level und XP' })).toBeVisible();
  await page.getByText('Neuigkeiten').click();
  await expect(page.getByText('Added revision section')).toBeVisible();

  await menuButton.click();
  await page.getByRole('menuitem', { name: 'Einstellungen' }).click();
  await expect(page).toHaveURL(/\/settings$/);
});

test('settings is no longer in the bottom navigation', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  await expect(nav.getByRole('link')).toHaveCount(3);
  await expect(nav.getByRole('link', { name: /Einstellungen/ })).toHaveCount(0);
});

test('the open menu and the About page have no accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  await page.getByRole('button', { name: 'Menu' }).click();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(
    results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`),
  ).toEqual([]);
});

test('About shows the app version', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByTestId('app-version')).toHaveText(/Version\s*\d+\.\d+\.\d+$/);
});
