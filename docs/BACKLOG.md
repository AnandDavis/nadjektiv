# Backlog

Ideas agreed but not yet built. Newest first. Move an item into a spec or plan when work starts.

## Welcome intro on first open

**Why:** a first-time visitor lands on a list of 24 topics with no idea what the games are, that progress lives on their device, or that headings can be switched to English. A short intro would explain the app before the topic list.

**Notes:**

- Two or three Bauhaus-style screens, swiped or stepped through: what Nadjektiv is; the four games (Blitz, Lückentext, Satzbau, Tabelle) with their shapes; and how progress works (saved on this device, no streaks, export in Settings, installable and works offline).
- Let the learner pick the interface language (Deutsch or English) on the first screen, so the rest of the intro is in their choice.
- Show it once: store a "welcome seen" flag with the display preferences (`src/lib/storage/preferences.ts`), not in progress, so resetting progress doesn't replay it. Always skippable, and reopenable from the menu or About.
- Prefer a full-screen route (e.g. `/welcome`, redirected to on first visit) over a modal overlay. It's easier to make accessible, works with the back button, and won't flash over the home page before the flag is read. Decide that in the spec.
- Existing learners (anyone with progress already saved) shouldn't see it.
- Cover it with an e2e test (first visit shows it, skip and finish both land on home, second visit doesn't) plus a visual baseline.

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

## Transfer progress to another device with a QR code

**Why:** moving to a new phone today means exporting a file and importing it on the other device. Scanning a QR code from the old device would be much quicker.

**Constraint to design around:** a full progress export (per-question stats for ~1,400 questions, the revise list, personal bests) can be tens of KB. One QR code holds about 3 KB at most, and a dense code is hard to scan from a phone screen. Options:

- **Compress and trim:** deflate the JSON, and send only what can't be rebuilt (per-question stats as compact arrays, revise entries, bests, XP). Encode as Base45 for QR alphanumeric mode. Might fit one code for light users, but not for heavy ones.
- **Animated multi-part QR:** cycle through numbered chunks (as some crypto wallets and Bluetooth-free file transfers do) until the receiver has them all. Works offline and with no server, but needs a scanning UI.
- **Short-lived relay:** the old device uploads an encrypted blob to a tiny server endpoint, and the QR code holds only a one-time ID plus the decryption key. Simplest to scan, but it needs a backend, which fits in with the planned accounts work.

**Pieces either way:** a camera-based scanner (`BarcodeDetector` where supported, with a JS fallback), a merge-or-replace choice on import (reusing `deserialiseProgress`), and a test that a round-trip through the encoding loses nothing.
