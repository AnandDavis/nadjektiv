import { expect, test, type Page } from '@playwright/test';

import { getTopic } from '../src/content';

const articles = getTopic('articles')!;

/** The right answer to the question on screen, found by its English translation. */
async function answerOnScreen(page: Page): Promise<string> {
  const translations = new Map((articles.gap ?? []).map((q) => [q.translation, q.answer]));
  for (const text of await page.locator('p.text-muted').allTextContents()) {
    const answer = translations.get(text.trim());
    if (answer) return answer;
  }
  throw new Error('No known question on screen');
}

test('Type the answer is locked on the topic page until the topic has a medal', async ({
  page,
}) => {
  await page.goto('/topics/articles');
  await expect(
    page.getByText('Freigeschaltet, sobald du in diesem Thema eine Medaille hast.'),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Tippen/ })).toHaveCount(0);
});

test('typing the answer: right, nearly, and the umlaut keys', async ({ page }) => {
  await page.goto('/play/articles/type');
  await page.getByRole('button', { name: /Los geht/ }).click();
  const field = page.getByRole('textbox', { name: 'Deine Antwort' });
  await expect(field).toBeFocused();

  // Right, whatever the case and spacing.
  await field.fill(`  ${(await answerOnScreen(page)).toUpperCase()} `);
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('Richtig').first()).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();

  // One letter off: "nearly", but explained and counted as wrong.
  const answer = await answerOnScreen(page);
  await field.fill(`${answer}x`);
  await field.press('Enter');
  await expect(page.getByText(/Fast! Nur ein Buchstabe stimmt nicht/)).toBeVisible();
  await expect(page.getByText('Du hast getippt')).toBeVisible();
  await expect(page.getByText(/^Warum\?/)).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();

  // The ä ö ü ß keys type into the answer.
  await field.fill('gr');
  await page
    .getByRole('group', { name: 'Sonderzeichen' })
    .getByRole('button', { name: 'ö' })
    .click();
  await field.pressSequentially('ße');
  await expect(field).toHaveValue('größe');
});
