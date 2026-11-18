/**
 * Lighthouse budget: runs Lighthouse (mobile) against key pages of the production
 * build and fails if any category score drops below its budget.
 *
 * Usage: npm run test:lighthouse   (builds first, then serves on a spare port)
 * Uses Playwright's Chromium, so `npx playwright install chromium` is the only setup.
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

import { chromium } from '@playwright/test';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const PORT = 3300;
// Lighthouse runs with empty storage, so '/' would redirect a "first visit" to the
// intro: audit the intro itself, which is what a new visitor loads.
const PAGES = ['/welcome', '/topics/articles', '/play/articles/gap', '/about'];

/** Minimum category scores, 0–100. Raise these when the app improves; never lower them quietly. */
const BUDGETS = {
  performance: 90,
  accessibility: 100,
  'best-practices': 95,
  seo: 90,
};

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await sleep(500);
  }
  throw new Error(`Server at ${url} did not start`);
}

const server = spawn('npx', ['next', 'start', '--port', String(PORT)], { stdio: 'ignore' });
let failed = false;

try {
  await waitForServer(`http://localhost:${PORT}/`);
  const chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox'],
  });
  try {
    for (const page of PAGES) {
      const result = await lighthouse(`http://localhost:${PORT}${page}`, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: Object.keys(BUDGETS),
      });
      const scores = Object.fromEntries(
        Object.keys(BUDGETS).map((key) => [
          key,
          Math.round((result.lhr.categories[key]?.score ?? 0) * 100),
        ]),
      );
      const misses = Object.entries(BUDGETS).filter(([key, min]) => scores[key] < min);
      console.log(
        `${misses.length ? '✗' : '✓'} ${page.padEnd(22)} ${Object.entries(scores)
          .map(([k, v]) => `${k} ${v}`)
          .join(' · ')}`,
      );
      for (const [key, min] of misses) {
        failed = true;
        console.log(`    ${key} ${scores[key]} is below the budget of ${min}`);
        const audits = Object.values(result.lhr.audits).filter(
          (audit) =>
            audit.score !== null &&
            audit.score < 0.9 &&
            result.lhr.categories[key].auditRefs.some(
              (ref) => ref.id === audit.id && ref.weight > 0,
            ),
        );
        for (const audit of audits.slice(0, 5)) console.log(`      - ${audit.title}`);
      }
    }
  } finally {
    await chrome.kill();
  }
} finally {
  server.kill();
}

process.exit(failed ? 1 : 0);
