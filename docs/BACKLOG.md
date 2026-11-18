# Backlog

Ideas agreed but not yet built. Newest first. Move an item into a spec or plan when work starts.

## Combo feedback

**Why:** the combo multiplier works, but it's easy to miss when it rises or breaks.

**Notes:** a ×2 or ×3 badge that pops beside the score when the multiplier goes up, and a short "Kombo verloren" when a wrong answer breaks it. Announce both through the existing `aria-live` region, keep the text bilingual in `COPY`, and respect reduced motion (the phone's and the app's own setting).

## Best combo on the results screen

**Why:** the best combo for each topic and mode is already saved, but barely shown.

**Notes:** on the results screen, show this round's best run next to the all-time best for that topic and mode, with the existing "new best" call-out when it's beaten.

## Combo-aware daily mix

**Why:** where a run breaks is a clue to a rule that isn't solid yet.

**Notes:** record the question (and so the rule) that broke each long run. The next daily mix leans towards questions on that rule. "Rule" could start as the question's topic and mode, refined later if questions get rule tags. Needs a small addition to saved progress (schema change with a migration).

## Mistake patterns

**Why:** the revise list shows single questions, but mistakes often share a cause across topics, such as picking Akkusativ after mit.

**Notes:** group revise entries and recent misses by the rule behind them (topic, and for gap/sort questions the chosen vs right answer, e.g. den → dem). Show the top patterns on the revise page with a link to the rule card that explains them. Pure analysis in `src/lib/revise/`, with tests; no new content needed.

## Noun cards: gender and plural together

**Why:** der/die/das and the plural are learned as a pair ("der Tisch, die Tische"), but they're practised in separate topics.

**Notes:** a Blitz-style round showing a noun and asking for both gender and plural form. Needs a checked noun list with plurals (reuse noun-gender and plurals content where it overlaps, and check every plural against `docs/grammar/`). New question ids are permanent once shipped.

## Topic graduation

**Why:** reaching Gemeistert passes with a small call-out; it deserves a moment.

**Notes:** a celebration screen after the round that reaches Gemeistert: what the topic covered, the learner's stats, and a suggested next topic. Shown once per topic (remember it in progress, as an optional field). Respect reduced motion.

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

---

# Decided against

Tried or looked into, with the reason, so they aren't reopened without new evidence.

## React Compiler

**Why:** game screens re-render on every answer. The compiler memoises components automatically.

**Tried (Nov 2026), not adopted:** with `reactCompiler: true` and `babel-plugin-react-compiler` 1.0, every hook passed lint and every test passed, but each page gained 12–17 KB of JavaScript (topic page 217.7 → 235.0 KB, over the 230 KB budget; home 214.4 → 229.3 KB). The game screens are small and already memoise their hot paths, so there was no slowness to win back. Revisit if a screen becomes measurably slow, or after splitting heavy screens frees budget.

## Prerender the next page (Speculation Rules)

**Looked into (Nov 2026), not adopted:** Speculation Rules prerender whole documents, which a browser only uses for a full page load. Every link in the app is a Next.js `<Link>`, which navigates client-side without loading a new document, and Next already prefetches those routes (with `partialPrefetching`). A prerendered document would never be shown, so the rules would only download pages twice. Revisit only if some navigation becomes a full page load.
