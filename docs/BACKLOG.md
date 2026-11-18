# Backlog

Ideas agreed but not yet built. Newest first. Move an item into a spec or plan when work starts.

## More settings

**Why:** Settings today covers only language, theme and progress. These let learners tune the games to how they learn. Each goes in `src/lib/storage/preferences.ts` (display preferences, not progress), is applied before paint where it affects layout, and has a bilingual label in `COPY`.

- **Blitz without the clock:** an untimed Blitz for learners who find the 60 seconds stressful. Untimed rounds keep their own bests, separate from timed ones.
- **Hints: show by default, or hide:** show the hint up front while learning a topic, or hide the hint button entirely so it isn't tempting. A hint shown by default still halves the points and doesn't count towards medals.
- **Move on after a right answer:** skip the Weiter pause after a right answer in Lückentext, Tippen and Satzbau. A wrong answer always still stops and explains (CLAUDE.md rule 16).
- **Reduce motion:** turn off the shake, pop-in and rise animations in this app only, on top of following the phone's own setting.
- **Text size:** Normal, Large, Larger. Check every screen at 360 px with long German compounds at the largest size, and keep the visual baselines at Normal.
- **Hide English translations:** hide the English lines under questions for extra immersion. Rule cards and explanations stay in English.
- **Empty the revise list:** clear the "To revise" list without resetting the rest of progress, with a confirm step. This one is a progress write, so it goes through `ProgressService` and the store, not preferences.

## Glossary of grammar terms

**Why:** explanations and rules use terms like Dativ, Akkusativ, Imperativ, Präteritum, trennbare Verben or Nebensatz, and a learner meeting one for the first time has nowhere to look it up.

**Notes:** a glossary page (e.g. `/glossary`, linked from the menu and About) with one entry per term: the German name, the English name, a one-line plain explanation, an example sentence, and links to the topics that teach it. Where a term appears in a rule card or explanation, it could link to its entry. Terms are content, so they live in `src/content/` with tests (every entry has an example, every linked topic exists) and pass the German spellcheck. Keep the explanations in plain English, the examples in German, and check every example against `docs/grammar/`.

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
