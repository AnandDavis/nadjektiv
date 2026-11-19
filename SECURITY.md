# Security policy

## Supported versions

Only the latest release, the version deployed to production, receives security fixes.

## Reporting a vulnerability

Please report security issues privately, not in a public issue or pull request.

Use GitHub's private vulnerability reporting: open the repository's **Security** tab and choose **Report a vulnerability**. Include the steps to reproduce, the affected page or file, and the impact you expect.

You'll get an acknowledgement within a week. Once a fix ships, the advisory is published with credit to the reporter unless you'd rather stay anonymous.

## Scope

Nadjektiv runs entirely in the browser: progress lives in the learner's own `localStorage`, there are no accounts, and there is no server-side data. Reports that matter most:

- script injection (XSS) or a way around the Content Security Policy
- an imported progress file that can run code or corrupt other saved data
- a service worker that can be made to serve content from another origin
- anything that leaks data to a third party

Out of scope: findings that need a compromised device or browser, missing headers on Vercel-owned domains, and automated scanner output without a working proof of concept.

## How the app is protected

- Every response carries a strict Content Security Policy and security headers (`src/lib/security/headers.ts`), checked by `e2e/security.spec.ts`.
- Saved and imported data is validated with Zod schemas before use (`src/lib/progress/`).
- CI runs CodeQL, fails on high or critical advisories in production dependencies, and pins every GitHub Action to a commit SHA. Dependabot keeps dependencies and actions current.
