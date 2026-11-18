import { expect, test, type Page } from '@playwright/test';

import { getTopic } from '../src/content';
import { skipNewWords } from './new-words';

test.beforeEach(async ({ page }) => skipNewWords(page));

async function choose(page: Page, label: string) {
  await page.getByText(label, { exact: true }).filter({ visible: true }).click();
}

test('text size, motion and translations apply across the app', async ({ page }) => {
  await page.goto('/settings');
  await choose(page, 'Größer');
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'larger');
  await choose(page, 'Reduziert');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  await choose(page, 'Ausblenden');

  await page.goto('/play/articles/gap');
  // Applied before paint on a fresh page load, too.
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'larger');
  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(page.locator('p.translation')).toBeHidden();
  const rootSize = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
  expect(rootSize).toBe('20px');
});

test('untimed Blitz has no clock, a set length and its own bests', async ({ page }) => {
  await page.goto('/settings');
  await choose(page, 'Ohne Uhr');
  await page.goto('/play/noun-gender/sort');
  await expect(page.getByText(/20 prompts and no clock/)).toBeVisible();
  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(page.getByText('60s')).toHaveCount(0);
  for (let i = 0; i < 20; i++) {
    await page.getByRole('group', { name: 'Sort into' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
  await expect(page.getByText(/von 20 richtig/)).toBeVisible();
  const modes = await page.evaluate(
    () => JSON.parse(localStorage.getItem('grammatik:progress')!).topics['noun-gender'].modes,
  );
  expect(Object.keys(modes)).toEqual(['sortUntimed']);
});

test('hints can be shown up front, or turned off', async ({ page }) => {
  await page.goto('/settings');
  await choose(page, 'Immer zeigen');
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(page.getByText('Hinweis', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Hinweis zeigen/ })).toHaveCount(0);

  await page.goto('/settings');
  await choose(page, 'Aus');
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(page.getByRole('group', { name: 'Answer options' })).toBeVisible();
  await expect(page.getByText(/Hinweis/)).toHaveCount(0);
});

test('a right answer can move on by itself; a wrong one still stops', async ({ page }) => {
  const answers = new Map((getTopic('articles')!.gap ?? []).map((q) => [q.translation, q.answer]));
  const answerOnScreen = async () => {
    for (const text of await page.locator('p.translation').allTextContents()) {
      const answer = answers.get(text.trim());
      if (answer) return answer;
    }
    throw new Error('No known question on screen');
  };
  const options = () => page.getByRole('group', { name: 'Answer options' }).getByRole('button');

  await page.goto('/settings');
  await choose(page, 'Weitergehen');
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();

  const right = await answerOnScreen();
  await options()
    .filter({ has: page.getByText(new RegExp(`^${right}$`, 'i')) })
    .first()
    .click();
  await expect(page.getByText(/^02\s*\/\s*10$/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Weiter' })).toHaveCount(0);

  const next = await answerOnScreen();
  await options()
    .filter({ hasNot: page.getByText(new RegExp(`^${next}$`, 'i')) })
    .first()
    .click();
  await expect(page.getByText('Nicht ganz')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Weiter' })).toBeVisible();
});

test('the revise list can be emptied without touching the rest', async ({ page }) => {
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').nth(1).click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('grammatik:progress')!));
  test.skip(Object.keys(before.revise).length === 0, 'Every second option was right.');

  await page.goto('/settings');
  await page.getByRole('button', { name: 'Wiederholungsliste leeren' }).click();
  await page.getByRole('button', { name: 'Ja, leeren' }).click();
  await expect(page.getByText('Wiederholungsliste geleert.')).toBeVisible();
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('grammatik:progress')!));
  expect(after.revise).toEqual({});
  expect(after.xp).toBe(before.xp);
});
