import { expect, test, type Page } from '@playwright/test';

async function answerGapRound(page: Page) {
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
}

test('home lists A1 and A2 topics', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A1', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A2', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Noun gender/ })).toBeVisible();
});

test('a finished gap round is saved and survives a reload', async ({ page }) => {
  await page.goto('/play/articles/gap');
  await answerGapRound(page);
  await expect(page.getByText(/of 10 correct/)).toBeVisible();

  await page.goto('/topics/articles');
  await expect(page.getByText('Answer 10 questions (10 so far)')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Answer 10 questions (10 so far)')).toBeVisible();

  await page.goto('/');
  await expect(page.getByRole('link', { name: /Gemischte Wiederholung/ })).toBeVisible();
});

test('sentence builder checks a completed sentence', async ({ page }) => {
  await page.goto('/play/negation/build');
  await page.getByRole('button', { name: /Los geht/ }).click();
  // The tile order is shuffled, so place tiles in pool order and check feedback appears.
  const pool = page.getByRole('group', { name: 'Words to place' });
  while ((await pool.getByRole('button').count()) > 0) {
    await pool.getByRole('button').first().click();
  }
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.getByText(/Richtig!|Nicht ganz/)).toBeVisible();
});

test('blitz round ends when time runs out', async ({ page }) => {
  await page.clock.install();
  await page.goto('/play/noun-gender/sort');
  await page.getByRole('button', { name: /Los geht/ }).click();
  // Don't answer: a wrong answer would (rightly) pause the clock.
  await page.clock.runFor(61_000);
  await expect(page.getByRole('button', { name: 'Play again' })).toBeVisible();
});

// Under Cache Components unknown params render on demand and stream before notFound()
// runs, so the first response can be a 200. Assert what the learner sees instead.
test('unknown topics show the not-found page', async ({ page }) => {
  await page.goto('/topics/does-not-exist');
  await expect(page.getByText('Diese Seite gibt es nicht.')).toBeVisible();
});

test('a wrong blitz answer pauses the clock and explains before moving on', async ({ page }) => {
  await page.clock.install();
  await page.goto('/play/noun-gender/sort');
  await page.getByRole('button', { name: /Los geht/ }).click();

  const bins = page.getByRole('group', { name: 'Sort into' });
  const continueButton = page.getByRole('button', { name: 'Weiter' });
  // Keep tapping "das" until one is wrong (most nouns in the deck aren't das).
  for (let i = 0; i < 15 && !(await continueButton.isVisible()); i++) {
    await bins.getByRole('button', { name: 'das' }).click();
    await page.clock.runFor(300);
  }
  await expect(continueButton).toBeVisible();
  await expect(page.getByText('Warum?')).toBeVisible();
  await expect(page.getByText('Deine Wahl')).toBeVisible();

  const timer = page.getByRole('progressbar', { name: /Time left/ });
  const before = await timer.getAttribute('aria-valuenow');
  await page.clock.runFor(5_000);
  expect(await timer.getAttribute('aria-valuenow')).toBe(before);

  await continueButton.click();
  await expect(continueButton).toBeHidden();
});
