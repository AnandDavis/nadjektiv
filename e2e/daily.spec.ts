import { expect, test, type Page } from '@playwright/test';

/** Answer whatever the question is (sort or gap), then continue. */
async function answerAnything(page: Page) {
  const choice = page
    .getByRole('group', { name: /Answer options|Sort into/ })
    .getByRole('button')
    .first();
  await choice.click();
  await page.getByRole('button', { name: 'Weiter' }).click();
}

test('the daily mix: ten questions, then marked done for today', async ({ page }) => {
  await page.goto('/');
  const callout = page.getByRole('link', { name: /Tagesmix/ });
  await expect(callout).toContainText('10 Fragen zum Einstieg');
  await callout.click();

  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) await answerAnything(page);
  await expect(page.getByText(/von 10 richtig/)).toBeVisible();

  await page.goto('/');
  await expect(page.getByRole('link', { name: /Tagesmix · Heute erledigt/ })).toBeVisible();
});

test('the same mix all day: reopening asks the same first question', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-18T10:00:00'));
  const firstQuestion = async () => {
    await page.goto('/play/daily');
    await page.getByRole('button', { name: /Los geht/ }).click();
    return page.locator('main [lang="de"]').first().textContent();
  };
  const first = await firstQuestion();
  expect(await firstQuestion()).toBe(first);
});
