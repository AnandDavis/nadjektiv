import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Play a gap round choosing the first option each time, so some answers are wrong. */
async function playGapRound(page: Page, path: string) {
  await page.goto(path);
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
}

test('wrong answers are collected on the revise page with the answer and why', async ({ page }) => {
  await page.goto('/revise');
  await expect(page.getByText('Nichts zu wiederholen')).toBeVisible();

  await playGapRound(page, '/play/articles/gap');
  const correctText = await page.getByText(/von 10 richtig/).textContent();
  const correct = Number(correctText?.match(/(\d+) von 10/)?.[1]);
  test.skip(correct === 10, 'Every first option happened to be right; nothing to revise.');

  await expect(page.getByText(/neu auf deiner Wiederholungsliste/)).toBeVisible();
  await page.getByRole('link', { name: /neu auf deiner Wiederholungsliste/ }).click();

  await expect(page).toHaveURL(/\/revise$/);
  await expect(page.getByRole('heading', { name: 'Die Artikeltabelle' })).toBeVisible();
  // One card per missed question; each shows what was chosen and why.
  await expect(page.getByText('Deine Wahl')).toHaveCount(10 - correct);
  await expect(page.getByText('Warum?')).toHaveCount(10 - correct);
  await expect(page.getByRole('navigation', { name: 'Main' })).toContainText(String(10 - correct));

  // After a client-side navigation the <title> streams in with the page metadata.
  await expect(page).toHaveTitle(/To revise/);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);

  // Mixed review starts from here and asks the revise questions first.
  await page.getByRole('link', { name: /Jetzt üben/ }).click();
  await expect(page).toHaveURL(/\/play\/review$/);
  await expect(page.getByRole('button', { name: /Los geht/ })).toBeVisible();
});
