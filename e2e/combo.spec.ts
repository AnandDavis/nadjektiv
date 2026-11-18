import { expect, test, type Page } from '@playwright/test';

import { getTopic } from '../src/content';

const deck = getTopic('noun-gender')!.sort!;

/** The bin for the Blitz prompt on screen, right or deliberately wrong. */
async function binFor(page: Page, right: boolean): Promise<string> {
  const prompt = (await page.locator('main [lang="de"].text-4xl').first().textContent())!.trim();
  const question = deck.questions.find((q) => q.prompt === prompt)!;
  return right ? question.answer : deck.bins.find((b) => b !== question.answer)!;
}

test('the combo badge rises with a run, and a wrong answer says it was lost', async ({ page }) => {
  await page.goto('/play/noun-gender/sort');
  await page.getByRole('button', { name: /Los geht/ }).click();
  const bins = page.getByRole('group', { name: 'Sort into' });

  for (let i = 0; i < 5; i++) {
    await bins.getByRole('button', { name: await binFor(page, true), exact: true }).click();
    // A right answer moves on by itself after a moment.
    await page.waitForTimeout(400);
  }
  await expect(page.getByText('×2')).toBeVisible();

  await bins.getByRole('button', { name: await binFor(page, false), exact: true }).click();
  await expect(page.getByText('Kombo verloren')).toBeVisible();
  await expect(page.getByText('×2')).toHaveCount(0);
});
