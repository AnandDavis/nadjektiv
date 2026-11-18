import { expect, test, type Page } from '@playwright/test';

import { getTopic } from '../src/content';

const articles = getTopic('articles')!;
const best = { plays: 1, bestScore: 10, bestAccuracy: 1, bestCombo: 1 };

async function playPerfectGapRound(page: Page) {
  const answers = new Map((articles.gap ?? []).map((q) => [q.translation, q.answer]));
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    const shown = (await page.locator('p.translation').first().textContent())!.trim();
    const answer = answers.get(shown)!;
    await page
      .getByRole('group', { name: 'Answer options' })
      .getByRole('button')
      .filter({ has: page.getByText(new RegExp(`^${answer}$`, 'i')) })
      .first()
      .click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
}

test('reaching Gemeistert celebrates once, with what’s next', async ({ page }) => {
  // One round short of Gemeistert, with every required game already played.
  await page.goto('/');
  await page.evaluate((modeBest) => {
    const topic = {
      answered: 95,
      correct: 95,
      recent: Array(40).fill(1),
      modes: { sort: modeBest, gap: modeBest, build: modeBest },
    };
    localStorage.setItem(
      'grammatik:progress',
      JSON.stringify({
        version: 3,
        xp: 0,
        topics: { articles: topic },
        questions: {},
        revise: {},
        grids: {},
      }),
    );
  }, best);

  await playPerfectGapRound(page);
  const panel = page.getByRole('region', { name: 'Gemeistert!' });
  await expect(panel).toBeVisible();
  await expect(panel.getByText('Die Artikeltabelle')).toBeVisible();
  await expect(panel.getByRole('link', { name: /Als Nächstes/ })).toHaveAttribute(
    'href',
    '/topics/cases',
  );

  // Already mastered: the next round doesn't celebrate again.
  await playPerfectGapRound(page);
  await expect(page.getByRole('region', { name: 'Gemeistert!' })).toHaveCount(0);
});
