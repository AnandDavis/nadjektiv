import { expect, test, type Page } from '@playwright/test';

import { skipNewWords } from './new-words';

test.beforeEach(async ({ page }) => skipNewWords(page));

/** Answer whatever comes up (sort, gap or sentence builder), then continue. */
async function answerAnything(page: Page) {
  const words = page.getByRole('group', { name: 'Words to place' }).getByRole('button');
  const choices = page.getByRole('group', { name: /Answer options|Sort into/ }).getByRole('button');
  await expect(words.or(choices).first()).toBeVisible();
  if (await words.count()) {
    while (await words.count()) await words.first().click();
    await page.getByRole('button', { name: 'Prüfen' }).click();
  } else {
    await choices.first().click();
  }
  await page.getByRole('button', { name: 'Weiter' }).click();
}

test('a level test has no hints and ends with a grade and the best result', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Prüfung A1/ }).click();
  await expect(page).toHaveURL(/\/play\/exam\/a1$/);
  await page.getByRole('button', { name: /Los geht/ }).click();

  for (let i = 0; i < 20; i++) {
    await expect(page.getByRole('button', { name: /Hinweis zeigen/ })).toHaveCount(0);
    await answerAnything(page);
  }
  await expect(page.getByText(/von 20 richtig/)).toBeVisible();
  await expect(page.getByText('Note', { exact: true })).toBeVisible();
  await expect(page.getByText('Neues bestes Ergebnis!')).toBeVisible();

  const exams = await page.evaluate(
    () => JSON.parse(localStorage.getItem('grammatik:progress')!).exams,
  );
  expect(exams.A1.plays).toBe(1);

  await page.goto('/');
  await expect(page.getByRole('link', { name: /Prüfung A1/ })).toContainText('Bestes Ergebnis');
});
