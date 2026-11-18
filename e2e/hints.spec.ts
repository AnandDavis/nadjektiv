import { expect, test } from '@playwright/test';

import { getTopic } from '../src/content';
import { hintFor } from '../src/lib/game/hint';

const articles = getTopic('articles')!;

test('a hint shows the rule without the answer, and a right answer then scores half', async ({
  page,
}) => {
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();

  const shown = (await page.locator('p.text-muted').allTextContents()).map((t) => t.trim());
  const question = (articles.gap ?? []).find((q) => shown.includes(q.translation))!;

  await page.getByRole('button', { name: /Hinweis zeigen/ }).click();
  await expect(page.getByRole('button', { name: /Hinweis zeigen/ })).toHaveCount(0);
  await expect(page.getByText(hintFor(question)!, { exact: true })).toBeVisible();

  await page
    .getByRole('group', { name: 'Answer options' })
    .getByRole('button', { name: new RegExp(`^${question.answer}\\b`) })
    .click();
  await expect(page.getByText('+5')).toBeVisible();

  // The next question starts without a hint.
  await page.getByRole('button', { name: 'Weiter' }).click();
  await expect(page.getByRole('button', { name: /Hinweis zeigen/ })).toBeVisible();
});

test('Blitz has no hints', async ({ page }) => {
  await page.goto('/play/noun-gender/sort');
  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(page.getByRole('group', { name: 'Sort into' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Hinweis/ })).toHaveCount(0);
});
