import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { settleMotion } from './motion';

const ARTICLE_ANSWERS: Record<string, string> = {
  'Akk M': 'den',
  'Akk F': 'die',
  'Akk N': 'das',
  'Akk Pl': 'die',
  'Dat M': 'dem',
  'Dat F': 'der',
  'Dat N': 'dem',
  'Dat Pl': 'den',
};

async function openArticleGrid(page: Page) {
  await page.goto('/play/articles/grid');
  await page.getByRole('button', { name: /Der bestimmte Artikel/ }).click();
  await expect(page.getByRole('textbox', { name: 'Akk M' })).toBeFocused();
}

test('a perfect grid finishes by itself and records a best time', async ({ page }) => {
  await openArticleGrid(page);
  for (const [cell, answer] of Object.entries(ARTICLE_ANSWERS)) {
    await page.getByRole('textbox', { name: cell }).fill(answer.toUpperCase());
  }
  await expect(page.getByRole('heading', { level: 2, name: 'Perfekt!' })).toBeFocused();
  await expect(page.getByText('8/8')).toBeVisible();

  await page.getByRole('button', { name: 'Andere Tabelle' }).click();
  await expect(page.getByRole('button', { name: /Der bestimmte Artikel.*Bestzeit/ })).toBeVisible();
});

test('typing moves to the next cell once a cell is right', async ({ page }) => {
  await openArticleGrid(page);
  await page.keyboard.type('den');
  await expect(page.getByRole('textbox', { name: 'Akk F' })).toBeFocused();
  await page.keyboard.type('dem');
  await expect(page.getByRole('textbox', { name: 'Akk F' })).toBeFocused();
  await expect(page.getByText('1/8')).toBeVisible();
});

test('finishing early reveals the answers and sends missed cells to revise', async ({ page }) => {
  await openArticleGrid(page);
  await page.getByRole('textbox', { name: 'Akk M' }).fill('den');
  await page.getByRole('textbox', { name: 'Akk F' }).fill('der');
  await page.getByRole('button', { name: 'Fertig' }).click();

  await expect(page.getByText('1/8')).toBeVisible();
  await expect(page.getByText('7 neu auf deiner Wiederholungsliste')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Die Lösung' })).toBeVisible();

  await page.goto('/revise');
  await expect(page.getByText('Akk · F: die')).toBeVisible();
  await expect(page.getByText('Die ganze Zeile').first()).toBeVisible();
});

test('the round ends when the clock runs out', async ({ page }) => {
  await page.clock.install();
  await openArticleGrid(page);
  await page.getByRole('textbox', { name: 'Akk M' }).fill('den');
  await page.clock.runFor(91_000);
  await expect(page.getByRole('heading', { name: 'Die Lösung' })).toBeVisible();
});

test('the app keyboard types ä into the focused cell', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'The app keyboard is for touch screens.');
  await page.goto('/play/present-tense/grid');
  await page.getByRole('button', { name: /Vokalwechsel/ }).click();
  await page.getByRole('textbox', { name: 'du fahren' }).click();
  const keyboard = page.getByRole('group', { name: 'Tastatur' });
  for (const key of ['f', 'ä', 'h', 'r', 's', 't']) {
    await keyboard.getByRole('button', { name: key, exact: true }).click();
  }
  await expect(page.getByText('1/10')).toBeVisible();
});

test('grid fill has no accessibility violations in play or on the results', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openArticleGrid(page);
  await settleMotion(page);
  const playing = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(playing.violations.map((v) => v.id)).toEqual([]);
  await page.getByRole('button', { name: 'Fertig' }).click();
  await expect(page.getByRole('heading', { name: 'Die Lösung' })).toBeVisible();
  await settleMotion(page);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
