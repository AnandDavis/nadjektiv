import { expect, test, type Page } from '@playwright/test';
import { skipNewWords } from './new-words';

test.use({ serviceWorkers: 'allow' });
test.beforeEach(async ({ page }) => skipNewWords(page));

/** Collect every Content Security Policy violation the page reports. */
async function watchViolations(page: Page): Promise<string[]> {
  const violations: string[] = [];
  await page.exposeFunction('reportViolation', (detail: string) => violations.push(detail));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      const report = (window as unknown as { reportViolation: (d: string) => void })
        .reportViolation;
      report(`${event.violatedDirective} blocked ${event.blockedURI || 'inline'}`);
    });
  });
  return violations;
}

test('pages are served with the security headers', async ({ page }) => {
  const response = await page.goto('/');
  const headers = response?.headers() ?? {};
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['content-security-policy']).toContain("object-src 'none'");
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['x-powered-by']).toBeUndefined();
});

test('the policy blocks nothing the app needs', async ({ page }) => {
  const violations = await watchViolations(page);

  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.getByRole('link', { name: /der, die oder das\?/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
  await expect(page.getByRole('button', { name: 'Weiter' })).toBeVisible();

  await page.goto('/play/articles/grid');
  await page.goto('/settings');
  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  expect(violations).toEqual([]);
});
