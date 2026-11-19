import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { settleMotion } from './motion';

test('About keeps its sections folded, and each opens on tap', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByText('Gebaut von Nad in London')).toBeVisible();
  const changelog = page.locator('details#changelog');
  await expect(changelog).not.toHaveAttribute('open');
  await expect(page.getByText('Added revision section')).toBeHidden();

  await page.getByText('Neuigkeiten').click();
  await expect(changelog).toHaveAttribute('open');
  await expect(page.getByText('Added revision section')).toBeVisible();
});

test('a link to a section opens it', async ({ page }) => {
  await page.goto('/about#levels');
  await expect(page.locator('details#levels')).toHaveAttribute('open');
  await expect(page.getByText('XP sammeln')).toBeVisible();
});

test('About, with every section open, has no accessibility violations', async ({ page }) => {
  await page.goto('/about');
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
  for (const summary of await page.locator('summary').all()) await summary.click();
  await settleMotion(page);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(
    results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`),
  ).toEqual([]);
});
