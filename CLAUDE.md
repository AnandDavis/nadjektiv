# CLAUDE.md

**Nadjektiv** — a mobile-first PWA for learning German A1–A2 grammar through short games. Progress lives in `localStorage` today; user accounts and server sync come later, so persistence must stay behind a port.

## Critical Rules

1. **Commits use Conventional Commits** — `type(scope): summary` (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `style`, `perf`). Imperative mood, lowercase summary, no trailing period, ≤ 72 chars. One logical change per commit. Never push, force-push, or rewrite history without explicit permission.
2. **Search before creating** — find an existing component, hook or util before writing a new one. Extend it rather than building a parallel version.
3. **German content must be correct** — every question carries an `explanation`, and every sentence must be grammatical, natural A1/A2 German. Check articles, case endings, umlauts and `ß` against `docs/grammar/` before adding content. A wrong answer key teaches the wrong thing — treat it as a bug, not a typo. `npm test` runs content-integrity checks; keep them green.
4. **Persistence goes through the progress store** — never touch `localStorage` directly outside `src/lib/storage/`. UI reads progress through `useProgress()`; writes go through `ProgressService` pure functions and the `ProgressStore` port. This is the seam that lets us swap in a server-backed store when logins arrive.
5. **Persisted data is versioned and validated** — every stored shape has a Zod schema and a `version`. Bump the version and add a migration when the shape changes; never silently discard a learner's progress.
6. **No magic colours or numbers, and follow the design system** — colours come from the design tokens in `src/app/globals.css` (`bg-surface`, `text-muted`, `bg-blue` …). Raw Tailwind hues (`bg-red-500`), hex codes and arbitrary values (`w-[13px]`) don't belong in components. The visual language is Bauhaus: no rounded corners, no shadows, no one-sided accent borders, rules instead of stacked cards, and the ■ ● ▲ shape system for der/die/das and game modes. Read [docs/DESIGN.md](docs/DESIGN.md) before building UI.
7. **Dark mode and mobile first** — every screen must work at 360 px wide, with touch targets ≥ 44 px, in both light and dark themes. Tokens handle the theme; check both.
8. **Accessible by default** — semantic elements, visible focus rings, `aria-live` for game feedback, and no information conveyed by colour alone. The Playwright a11y spec must stay green.
9. **Keep files small** — see [File Size Guidelines](#file-size-guidelines).
10. **Write lint-clean code** — ESLint runs with `--max-warnings=0`; `npm run type-check` and `npm test` must pass before a commit.
11. **Domain logic lives in `src/lib`, not components** — scoring, mastery, question selection and answer checking are pure, unit-tested functions. Components wire state to JSX.
12. **Zero is not null** — store `0` for a measured zero (score, combo, attempts). Reserve `undefined` for "never played".
13. **Never give time estimates, and never cut corners based on perceived effort** — no "quick fix", "an hour's work" or similar, anywhere. Defer work only on its merits (scope, risk, value, missing information), never on the clock.
14. **Verify findings before acting on them** — when a review, doc or sub-agent claims something about the code or the German, open the file and read the line before acting. Docs describe what was true when written.
15. **Interface labels are bilingual** — headings, buttons and other labels that have a German form live in `src/lib/i18n/copy.ts` and render through `<Ui {...COPY.x.y} />`, which shows German or English per the learner's setting (switched by CSS before paint, so no flash). Grammar content is always German and never goes through `COPY`.
16. **A wrong answer is always explained before the game moves on** — every mode stops on a wrong answer, shows what was chosen, the right answer and the rule, and waits for the learner to continue (Blitz pauses its clock while it waits).
17. **Names and tuning live in `src/config/`** — the app name, description and brand colours come from `APP_CONFIG`; round lengths, timers, points and XP from `GAME_CONFIG`. Don't hardcode them elsewhere. `STORAGE_CONFIG` holds identifiers baked into saved data (localStorage keys, export marker) and must not change without a migration.
18. **Every learner-facing feature updates the About page in the same change** — add a dated entry to the change log (`src/content/changelog.ts`, newest first, UTC timestamp `YYYY-MM-DDTHH:mmZ` = when it ships) and update the feature list (`src/content/features.ts`) so it describes how the app now works. Write for learners in plain, non-technical words ("Added revision section", not "feat(revise): …"). Leave out internal work and app chrome: refactors, tests, build or tooling fixes, headers, menus, navigation tweaks. If the change alters how XP, levels or medals work, check the About page explanation (it is generated from `GAME_CONFIG` and the tier rules, but its wording may need updating).

---

## Architecture

- **Framework:** Next.js 16 (App Router, `cacheComponents`) + React 19 + TypeScript (strict)
- **Styling:** Tailwind CSS v4 with CSS-variable design tokens (`src/app/globals.css`), dark mode via `data-theme` on `<html>`; Bauhaus visual language in [docs/DESIGN.md](docs/DESIGN.md)
- **State:** component-local state and reducers; progress via `useProgress()` (a `useSyncExternalStore` over the store)
- **Persistence:** `ProgressStore` port → `LocalStorageProgressStore` adapter (Zod-validated, versioned)
- **Testing:** Vitest + Testing Library (unit/component), Playwright + axe (end-to-end, accessibility)
- **PWA:** `app/manifest.ts` and a service worker generated from the topic registry at `app/sw.js/route.ts` (precaches every route); installable and usable offline
- **Hosting:** Vercel

### Layout

```
src/
  app/                    routes (pages are thin composition)
  components/ui/          design-system primitives (Button, Card, Badge, ProgressBar …)
  components/game/        game modes and the shared game shell
  components/progress/    mastery, XP and personal-best displays
  config/                 app identity (app.ts) and gameplay tuning (game.ts)
  content/                grammar topics, question banks, change log and feature list (data only)
  hooks/                  React hooks (useProgress, useGameSession …)
  lib/game/               pure game logic: session building, scoring, answer checking
  lib/progress/           progress types, schema, ProgressService, mastery and XP maths
  lib/storage/            ProgressStore port + localStorage adapter
docs/grammar/             A1/A2 grammar reference extracted from the cheat sheets
```

### Rendering

Progress only exists in the browser, so components that show it are client components. Keep the surrounding shell (headings, layout, topic text) server-renderable so routes prerender and work offline. Content is static: topic routes use `generateStaticParams`.

### Adding infrastructure (e.g. accounts, sync)

Follow ports and adapters: define a generic interface in `src/lib/<area>/`, add an adapter, and depend on the interface from services. When logins arrive, add a `RemoteProgressStore` that implements `ProgressStore` — UI and services shouldn't change.

---

## Coding Rules

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) for the full standards. Highlights:

### File Size Guidelines

Responsibility trumps line count — a 250-line file with one concern beats a 180-line file with two.

| File type                | Target             | Max |
| ------------------------ | ------------------ | --- |
| Pages                    | 50–150             | 200 |
| Components               | 100–250            | 300 |
| Hooks                    | 50–150             | 200 |
| Utilities / services     | 50–200             | 300 |
| Content (question banks) | one file per topic | —   |
| Type files               | no limit           | —   |

### Always handle promise rejections

Every `Promise.all(...)` or `.then(...)` has a `.catch()` or sits in `try/catch`. Unhandled rejections leave the UI stuck.

### File naming

- Components and classes: `PascalCase.tsx` / `PascalCase.ts`
- Utilities, content and config: `kebab-case.ts`
- Directories: `kebab-case/`

---

## Development Commands

```bash
npm run dev            # Dev server
npm run build          # Production build
npm run lint           # ESLint (zero warnings)
npm run type-check     # TypeScript
npm test               # Vitest unit, component and content-integrity tests
npm run test:e2e       # Playwright end-to-end + a11y (builds and serves the app)
npm run format         # Prettier
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
