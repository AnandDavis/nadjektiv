# Backlog

Ideas agreed but not yet built. Newest first. Move an item into a spec or plan when work starts.

## Reorganise the About page

**Why:** the About page has grown long: the version, the feature list, how XP and levels work, the medal rules and the change log all stack in one scroll, and the change log grows with every release.

**Notes:** split it with tabs or accordions, for example _Features_, _XP and medals_ and _What's new_, keeping the heading, version and "See the intro" link at the top. Use native `<details>`/`<summary>` for accordions, or an accessible tab pattern (`role="tablist"`, arrow-key navigation) if tabs. Either must work at 360 px and in both themes, and keep the Bauhaus look: rules and blocks, not rounded cards. Open the section a link points at (e.g. `/about#changelog`). Update the About visual baselines and the a11y spec.

## Audio

**Why:** the app is silent. Hearing each sentence helps with listening and pronunciation, which are both on the A1/A2 sheets.

**Notes:** a speaker button on German sentences, rule examples and revise cards, using the browser's speech synthesis with a `de-DE` voice. It's free and works offline where the device has a German voice. Hide the button when no German voice is available. Add a setting to auto-play after each answer.

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
