# Backlog

Ideas agreed but not yet built. Newest first. Move an item into a spec or plan when work starts.

## Grid fill game mode

**Why:** the Sporcle format that started this app. Fill a whole table against the clock (the article grid, pronouns, adjective endings, present-tense endings, the 33 irregular verbs). Seeing the whole pattern at once is how tables stick.

**Notes:** a new `grid` mode with its own content shape (rows × columns of cells, some pre-filled). Cells are typed answers, accepted case-insensitively, umlaut-aware. The timer and personal best record the time to complete, plus how many cells were filled if time runs out. Missed cells go on the revise list. Needs its own ▲●■-style mode mark in DESIGN.md.

## Type the answer

**Why:** recall is harder than recognition. A harder Lückentext where you type the word rather than pick it, for topics you've already earned a medal in.

**Notes:** an on-screen ä/ö/ü/ß key row. Ignore case and surrounding spaces, but never accept `ae` for `ä` or `ss` for `ß`. Show a "nearly" message for one-letter typos, but still count them wrong. Reuses the existing gap questions, so no new content is needed.

## Audio

**Why:** the app is silent. Hearing each sentence helps with listening and pronunciation, which are both on the A1/A2 sheets.

**Notes:** a speaker button on German sentences, rule examples and revise cards, using the browser's speech synthesis with a `de-DE` voice. It's free and works offline where the device has a German voice. Hide the button when no German voice is available. Add a setting to auto-play after each answer.

## Hints

**Why:** a nudge towards the rule beats a blind guess.

**Notes:** one hint per question, at a points cost (e.g. half points, and the combo isn't broken). Hints are written per question, or generated from the topic's rule (e.g. "dative after mit", "verb goes last"). Not available in Blitz. Record hint use, so the mastery tiers only count unaided answers.

## Daily mix

**Why:** a short, ready-made practice round each day, without streak pressure.

**Notes:** 10 questions drawn from the revise list and your weakest topics. Questions are seeded from the date, so the round is the same all day across devices. Nothing is lost for skipping a day, and no streak counter. Show "done today" once it's completed.

## Topic map

**Why:** a visual sense of progress across the whole syllabus.

**Notes:** a Bauhaus poster on the home or progress page: one shape per topic, coloured and filled in by medal tier (empty → bronze → … → mastered), grouped by level and topic group. Tapping a shape opens the topic. Shape and colour can't be the only signal, so add text labels or a list view for accessibility.

## Search topics on the home page

**Why:** with 24 topics in a long index, finding "two-way prepositions" or "Präteritum" means scrolling. A search box at the top of the home page would get there in a couple of keystrokes.

**Notes:**

- Match topic titles and taglines, plus useful keywords such as example words (`dem`, `weil`, `gegangen`) and German or English names for each topic (`Dativ`, `past tense`). Add a `keywords` field to each topic rather than searching the question banks, which would be slow and noisy.
- Ignore case and umlauts, so `prateritum` finds Präteritum and `fur` finds für.
- Filter the numbered index in place, keeping the A1/A2 and group headings for any matches. Show an empty state with a way to clear the search.
- Pure matching logic in `src/lib` with unit tests; works offline, because the topic list is already on the device.

## Transfer progress to another device with a QR code

**Why:** moving to a new phone today means exporting a file and importing it on the other device. Scanning a QR code from the old device would be much quicker.

**Constraint to design around:** a full progress export (per-question stats for ~1,400 questions, the revise list, personal bests) can be tens of KB. One QR code holds about 3 KB at most, and a dense code is hard to scan from a phone screen. Options:

- **Compress and trim:** deflate the JSON, and send only what can't be rebuilt (per-question stats as compact arrays, revise entries, bests, XP). Encode as Base45 for QR alphanumeric mode. Might fit one code for light users, but not for heavy ones.
- **Animated multi-part QR:** cycle through numbered chunks (as some crypto wallets and Bluetooth-free file transfers do) until the receiver has them all. Works offline and with no server, but needs a scanning UI.
- **Short-lived relay:** the old device uploads an encrypted blob to a tiny server endpoint, and the QR code holds only a one-time ID plus the decryption key. Simplest to scan, but it needs a backend, which fits in with the planned accounts work.

**Pieces either way:** a camera-based scanner (`BarcodeDetector` where supported, with a JS fallback), a merge-or-replace choice on import (reusing `deserialiseProgress`), and a test that a round-trip through the encoding loses nothing.
