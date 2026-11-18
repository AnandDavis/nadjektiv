# Backlog

Ideas agreed but not yet built. Newest first. Move an item into a spec or plan when work starts.

## View transitions between screens

**Why:** moving between screens is an instant swap. Animated transitions (a topic sliding into its game, a topic-map square growing into the topic header) would make the app feel native.

**Notes:** React 19 and Next 16 support the View Transitions API. Respect the reduced-motion setting (`data-motion` and `prefers-reduced-motion`), keep transitions short, and check they don't clash with the service worker's offline navigation fallback.

## Install prompt

**Why:** few learners know the app can be installed. Android only offers it from the browser menu, and iPhone never prompts.

**Notes:** on Android, capture `beforeinstallprompt` and show our own "Installieren" button (e.g. in Settings or once on home). On iPhone, show a one-time hint: Share → Add to Home Screen. Never show either once installed (`display-mode: standalone`). Bilingual labels in `COPY`.

## Prerender the next page (Speculation Rules)

**Why:** topic → game navigation could be instant on Chromium browsers.

**Notes:** add Speculation Rules (prerender on hover or tap for `/topics/*` and `/play/*`), checking how they interact with Next's own prefetching and with the service worker. Measure before and after.

## Trim the font

**Why:** Archivo is likely the largest download after JavaScript.

**Notes:** load only the weights and the width-axis range actually used, and check visual baselines don't change.

## Load heavy screens on demand

**Why:** the home page's JavaScript grows with every feature, and the budget is 230 KB.

**Notes:** split grid fill, the topic map and the glossary with `next/dynamic` or route-level splitting so they load only when opened. Keep offline working: the service worker must still precache the chunks.

## React Compiler

**Why:** game screens re-render on every answer. The compiler memoises components automatically.

**Notes:** enable it in Next 16, check our hooks follow its rules (lint), and compare render counts and the JS budget before and after.

## Speed Insights

**Why:** Lighthouse measures a lab machine. Speed Insights reports real Core Web Vitals from learners' phones.

**Notes:** Vercel's `@vercel/speed-insights`. It sends anonymous performance data, so mention it on the About page and decide on consent first.

## Web Analytics

**Why:** see which games and topics are actually used, to decide what to build next.

**Notes:** Vercel Web Analytics is cookie-free. Same privacy question as Speed Insights: mention it on the About page.

## Spaced repetition for the revise list

**Why:** a missed question comes back whenever the learner opens the list, not when it would help memory most.

**Notes:** schedule each revise entry to return after 1, 3, then 7 days, resetting on a miss. Mixed review and the daily mix draw "due" entries first. Needs a `dueAt` on revise entries, so a schema change with a migration.

## Gender reveal on new nouns

**Why:** meeting a noun for the first time in a quiz means guessing its gender.

**Notes:** the first time a noun appears, show it briefly with its ■ ● ▲ shape, article and plural before asking. Track "seen" per noun in progress.

## Topic tests (Prüfung)

**Why:** a way to check a whole level, like a mock exam.

**Notes:** a mixed round across every A1 or A2 topic, ending with a grade and the weakest topics to go back to. No hints. Keep the best grade per level.

## Verb lookup

**Why:** learners often want one verb's forms at a glance.

**Notes:** search a verb and see its present-tense forms, Präteritum and Perfekt (with haben or sein) together, linking to the topics. Built from the existing irregular-verb content; check every form against `docs/grammar/`.

## Stats over time

**Why:** a sense of improvement, without streak pressure.

**Notes:** on the Progress page, a simple chart of answers per day and accuracy per week. Needs a small daily history in progress (schema change). No streaks or "days in a row".

## Content review tooling

**Why:** German correctness matters most, and proofreading 1,400 questions in code is hard.

**Notes:** a script that exports every correct sentence per topic (gap, build, sort, examples, glossary) to a readable file a native speaker can review and annotate.

## Analytics without tracking

**Why:** knowing which topics get played would guide new content.

**Notes:** anonymous, cookieless counts only (e.g. Vercel Analytics): page views and rounds per topic and mode. No personal data, no consent banner needed; mention it on the About page.

## Audio

**Why:** the app is silent. Hearing each sentence helps with listening and pronunciation, which are both on the A1/A2 sheets.

**Notes:** a speaker button on German sentences, rule examples and revise cards, using the browser's speech synthesis with a `de-DE` voice. It's free and works offline where the device has a German voice. Hide the button when no German voice is available. Add a setting to auto-play after each answer.

## Transfer progress to another device with a QR code

**Why:** moving to a new phone today means exporting a file and importing it on the other device. Scanning a QR code from the old device would be much quicker.

**Constraint to design around:** a full progress export (per-question stats for ~1,400 questions, the revise list, personal bests) can be tens of KB. One QR code holds about 3 KB at most, and a dense code is hard to scan from a phone screen. Options:

- **Compress and trim:** deflate the JSON, and send only what can't be rebuilt (per-question stats as compact arrays, revise entries, bests, XP). Encode as Base45 for QR alphanumeric mode. Might fit one code for light users, but not for heavy ones.
- **Animated multi-part QR:** cycle through numbered chunks (as some crypto wallets and Bluetooth-free file transfers do) until the receiver has them all. Works offline and with no server, but needs a scanning UI.
- **Short-lived relay:** the old device uploads an encrypted blob to a tiny server endpoint, and the QR code holds only a one-time ID plus the decryption key. Simplest to scan, but it needs a backend, which fits in with the planned accounts work.

**Pieces either way:** a camera-based scanner (`BarcodeDetector` where supported, with a JS fallback), a merge-or-replace choice on import (reusing `deserialiseProgress`), and a test that a round-trip through the encoding loses nothing.
