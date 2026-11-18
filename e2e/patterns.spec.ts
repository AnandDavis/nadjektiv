import { expect, test } from '@playwright/test';

import { getTopic } from '../src/content';

test('the revise page groups a repeated mix-up and links its rule', async ({ page }) => {
  const dative = (getTopic('articles')!.gap ?? []).filter((q) => q.answer === 'meinem').slice(0, 2);
  await page.goto('/');
  await page.evaluate(
    (ids) => {
      const entry = {
        topicId: 'articles',
        given: 'meinen',
        misses: 1,
        lastMissedAt: '2026-11-18T10:00Z',
      };
      const topic = { answered: 2, correct: 0, recent: [0, 0], modes: {} };
      localStorage.setItem(
        'grammatik:progress',
        JSON.stringify({
          version: 3,
          xp: 0,
          topics: { articles: topic },
          questions: {},
          revise: Object.fromEntries(ids.map((id) => [id, entry])),
          grids: {},
        }),
      );
    },
    dative.map((q) => q.id),
  );

  await page.goto('/revise');
  const patterns = page.getByRole('region', { name: 'Häufige Fehler' });
  await expect(patterns.getByText('„meinem“ statt „meinen“')).toBeVisible();
  await expect(patterns.getByText('2× falsch')).toBeVisible();
  await patterns.getByRole('link', { name: /Regeln ansehen/ }).click();
  await expect(page).toHaveURL(/\/topics\/articles#/);
});
