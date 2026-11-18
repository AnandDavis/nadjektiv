# Backlog

Ideas agreed but not yet built. Newest first. Move an item into a spec or plan when work starts.

## Speed Insights

**Why:** Lighthouse measures a lab machine. Speed Insights reports real Core Web Vitals from learners' phones.

**Notes:** Vercel's `@vercel/speed-insights`. It sends anonymous performance data, so mention it on the About page and decide on consent first.

## Web Analytics

**Why:** see which games and topics are actually used, to decide what to build next.

**Notes:** Vercel Web Analytics is cookie-free. Same privacy question as Speed Insights: mention it on the About page.

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

---

# Decided against

Tried or looked into, with the reason, so they aren't reopened without new evidence.

## React Compiler

**Why:** game screens re-render on every answer. The compiler memoises components automatically.

**Tried (Nov 2026), not adopted:** with `reactCompiler: true` and `babel-plugin-react-compiler` 1.0, every hook passed lint and every test passed, but each page gained 12–17 KB of JavaScript (topic page 217.7 → 235.0 KB, over the 230 KB budget; home 214.4 → 229.3 KB). The game screens are small and already memoise their hot paths, so there was no slowness to win back. Revisit if a screen becomes measurably slow, or after splitting heavy screens frees budget.

## Prerender the next page (Speculation Rules)

**Looked into (Nov 2026), not adopted:** Speculation Rules prerender whole documents, which a browser only uses for a full page load. Every link in the app is a Next.js `<Link>`, which navigates client-side without loading a new document, and Next already prefetches those routes (with `partialPrefetching`). A prerendered document would never be shown, so the rules would only download pages twice. Revisit only if some navigation becomes a full page load.
