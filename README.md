# Nadjektiv

A mobile-first progressive web app for learning **German A1–A2 grammar** through short games instead of coursebook drills. Install it on your phone's home screen and it works offline.

**Offline:** open the deployed app once while online. Its service worker then downloads every page and the code each page needs, and from then on the whole app works without a connection, including topics you've never opened. Progress is stored on the device, so nothing needs a server. Offline support is only in production builds (`npm run build && npm run start`); `npm run dev` deliberately runs without the service worker.

## What's inside

**24 grammar topics, about 1,400 questions and 15 tables to fill in,** built from the A1 and A2 grammar syllabus:

| A1                                                                                                                                                                                                                  | A2                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Noun gender · Plurals · The article grid · Cases · Pronouns · Present tense · Word order · kein or nicht · Modal verbs · Separable verbs · Perfekt · Imperative · Prepositions of place and time · Telling the time | Adjective endings · Dative verbs and two objects · Two-way prepositions · Comparatives · Präteritum · The 33 irregular verbs · Reflexive verbs · Connectors · zu + infinitive · Inside the sentence |

Every topic has a **Die Regeln** card set summarising the rule, and one or more game modes:

- **Blitz** (rapid-fire sorter): 60 seconds to sort as many prompts as you can, such as der/die/das, Akkusativ/Dativ, haben/sein or Wo?/Wohin?. Runs of correct answers raise a combo multiplier. A wrong answer pauses the clock until you've read why.
- **Lückentext** (fill the gap): 10 sentences. Pick the word or ending that fits, then see the rule explained.
- **Satzbau** (sentence builder): 8 sentences. Tap word tiles into the right order. Every grammatically correct order is accepted, not just the textbook one.
- **Tabelle** (grid fill): fill in a whole grammar table against the clock: articles, pronouns, verb endings, modal verbs, adjective endings, the Präteritum, comparatives and the 33 irregular verbs. Cells lock green as soon as they're right, an ä/ö/ü/ß key row is built in, missed cells go on the revise list, and each table keeps your best time.
- **Zu wiederholen** (to revise): every question you get wrong, in any mode, lands on this list. Each card shows the correct answer, what you chose, why, other correct word orders, and more examples with the same answer. Answer it correctly later and it leaves the list. The bottom navigation shows how many are waiting.
- **Gemischte Wiederholung** (mixed review): 12 questions that start with your "to revise" list, then fill up with the questions you miss most across every topic you've played.

Every wrong answer, in every mode, shows what you chose, the right answer and the rule before you continue.

**Interface language:** headings and buttons are in German by default for extra immersion. Switch them to English in Settings. Grammar questions are always German.

**About page:** the menu in the app header (top right) has Settings and About. About lists the features, explains how XP, levels and medals work, and has a dated change log of new features.

## Gamification (no streaks)

- **Mastery tiers per topic:** Bronze → Silber → Gold → Gemeistert. A tier depends on how many questions you've answered and your accuracy over your last 40 answers. Gold and above also require playing every mode. Time away never costs you a tier; only getting things wrong does.
- **XP and levels:** every correct answer earns XP, multiplied by your combo, with a bonus for a perfect round. Levels come with titles (Anfänger, Lernender, Entdecker … Grammatik-Profi).
- **Personal bests:** best score, accuracy and combo for each topic and mode, with "new best" call-outs, Sporcle-style.
- **Smart practice:** every round favours questions you haven't seen or tend to miss.

## Getting started

Requires Node.js 22.12 or later (`.nvmrc` pins Node 22; `nvm install` picks it up).

```bash
npm install
npm run dev
```

Open http://localhost:3000. The service worker only registers in production builds; to test offline and install behaviour, run:

```bash
npm run build && npm run start
```

## Scripts

| Command                       | What it does                                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`                 | Development server                                                                                                                                                             |
| `npm run build` / `npm start` | Production build and server                                                                                                                                                    |
| `npm run lint`                | ESLint, zero warnings allowed                                                                                                                                                  |
| `npm run type-check`          | Route type generation and TypeScript                                                                                                                                           |
| `npm test`                    | Vitest: logic, content integrity and the German spellcheck                                                                                                                     |
| `npm run test:coverage`       | Vitest with coverage; fails below 95% lines and 90% branches in `src/lib`, `src/content` and `src/config`                                                                      |
| `npm run test:e2e`            | Playwright: end to end, accessibility, offline, visual regression, JS budgets and installability (builds and serves the app; run `npx playwright install chromium` once first) |
| `npm run test:lighthouse`     | Lighthouse (mobile) on key pages; fails below the score budgets in `scripts/lighthouse-budget.mjs`                                                                             |
| `npm run format`              | Prettier                                                                                                                                                                       |
| `npm run icons`               | Regenerate PWA icons from `scripts/icon.svg`                                                                                                                                   |

## Quality checks

- **German spellcheck:** `src/content/spelling.test.ts` checks every correct German sentence, prompt and example against a Hunspell German dictionary, splitting compound nouns automatically. Distractors are deliberately wrong, so they're skipped. Names and the occasional missing word go in `src/content/spelling-allowlist.ts`, with a reason. The dictionary (`dictionary-de`) is GPL-licensed. It's a dev-only dependency used in tests and is never shipped in the app.
- **Content rules:** `src/content/content.test.ts` checks IDs, answer keys, accepted word orders, real umlauts and ß, whitespace, and that every filled-in gap is a capitalised, punctuated sentence.
- **Visual regression:** `e2e/visual.spec.ts` compares the key screens in light and dark against the baselines in `e2e/visual.spec.ts-snapshots/`. After an intended design change, review the diff and update them with `npx playwright test visual --update-snapshots`. Baselines are per platform (`-darwin`, `-linux`). Only macOS baselines are committed, so the spec skips itself on Linux, including in CI.
- **Budgets:** `e2e/budgets.spec.ts` caps the compressed JavaScript each page downloads and checks the app stays installable (manifest, icons, service worker). Lighthouse budgets live in `scripts/lighthouse-budget.mjs`. Raise a budget only deliberately, in the commit that needs it.

## Tech

- **Next.js 16** (App Router, Cache Components) with **React 19** and strict **TypeScript**
- **Tailwind CSS v4** with design tokens in `src/app/globals.css`; light and dark themes via `light-dark()`
- **Zod** for validating and migrating persisted progress
- **Vitest** with Testing Library, and **Playwright** with axe-core
- A service worker generated from the topic registry (`src/app/sw.js/route.ts`) that precaches every route

## Configuration

- `src/config/app.ts`: the app's name, short name, description, export file name and brand colours. Rename the app here.
- `src/config/game.ts`: round lengths, the Blitz timer, review length, points, combos and XP per level.

`STORAGE_CONFIG` in `app.ts` holds the localStorage key prefix and the export-file marker. Those are baked into learners' saved data, so they stay fixed even when the app is renamed.

## Project structure

```
src/
  app/                 routes: home, topic, play, revise, review, progress, settings, manifest, sw.js
  config/              app identity and gameplay tuning
  components/          ui primitives, game modes, progress and topic views
  content/             topics and question banks (one file per topic) + integrity test
  hooks/               useProgress, useGameSession, useTheme
  lib/game/            session building, scoring, answer checking, game state machine
  lib/progress/        progress schema, XP levels, mastery tiers, applying a round
  lib/storage/         ProgressStore port + localStorage adapter
docs/
  CODING_STANDARDS.md  conventions
  grammar/             A1–A2 grammar reference used to check content
e2e/                   Playwright specs
```

## Progress and future accounts

Progress is stored in the browser's `localStorage` under a versioned, Zod-validated schema. Settings → _Your progress_ lets you export it to a JSON file, import it on another device, or reset it.

All persistence goes through the `ProgressStore` interface (`src/lib/storage/progress-store.ts`). Adding user accounts means writing a `RemoteProgressStore` that implements the same interface and calling `setProgressStore()` after sign-in; the exported JSON doubles as the import format for existing learners.

## Adding or editing content

Questions live in `src/content/topics/<topic>.ts`; the model is documented in `src/content/types.ts`. Rules:

- IDs (`<topic>-<mode>-<n>`) are stored in learners' progress, so never renumber or reuse them.
- Every question needs an English explanation of the rule.
- Sentence-builder questions list every acceptable word order in `accepted`.
- Run `npm test`. The content-integrity test checks IDs, answer keys, options and word orders.

## Releases

Versions follow [Semantic Versioning](https://semver.org) and are automated by [release-please](https://github.com/googleapis/release-please) from the [Conventional Commits](https://www.conventionalcommits.org) on `main`. It keeps a release pull request open that bumps the version and updates `CHANGELOG.md`: `fix` gives a patch release, `feat` a minor one, and a breaking change a major one. Merge that pull request to release; the About page shows the version.

## Deployment

Built for Vercel: import the repository and deploy with the default Next.js settings. No environment variables are needed.

## Credits

The grammar scope follows the free A1 and A2 German cheat sheets from [Ankommo](https://ankommo.de). The sheets aren't redistributed in this repository, and all questions and explanations are original.

## Licence

[MIT](LICENSE). The German spellcheck dictionary used in tests (`dictionary-de`) is GPL-licensed and is a dev-only dependency, never shipped in the app.
