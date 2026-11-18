/**
 * User-facing change log, shown on the About page. Newest first.
 *
 * Add an entry whenever a feature a learner would notice ships (see CLAUDE.md).
 * Write for learners, not developers: what they can now do, in plain words. Leave
 * out internal work and app chrome (refactors, tests, headers, menus, fixes to the
 * build).
 */

export interface ChangelogEntry {
  /** UTC timestamp, ISO 8601 (YYYY-MM-DDTHH:mmZ). */
  date: string;
  title: string;
  description: string;
}

export const CHANGELOG: readonly ChangelogEntry[] = [
  {
    date: '2026-11-18T21:00Z',
    title: 'More settings',
    description:
      'Settings now let you play Blitz without the clock (with its own bests), always show hints or turn them off, move straight on after a right answer, choose a larger text size, turn off the app’s movement, hide the English translations under questions, and empty your revise list without losing anything else.',
  },
  {
    date: '2026-11-18T19:40Z',
    title: 'Topic map',
    description:
      'Your Progress page now has a map of all 24 topics: one square each, grouped by level, filled in with the colour of the medal you’ve earned. Tap any square to go to that topic.',
  },
  {
    date: '2026-11-18T19:10Z',
    title: 'Clearer explanations, and your hardest questions first',
    description:
      'When you get something wrong, the reason now comes first, in big type, so you see the rule straight away. In Satzbau only the words in the wrong place are crossed out. The “To revise” list now puts the questions you’ve missed most at the top.',
  },
  {
    date: '2026-11-18T18:30Z',
    title: 'Daily mix',
    description:
      'The home page now has a Tagesmix: ten questions from your revise list and the topics you find hardest, the same all day and new each morning. It shows “done today” once you’ve played it. No streaks, so missing a day never costs you anything.',
  },
  {
    date: '2026-11-18T17:45Z',
    title: 'Hints',
    description:
      'In Lückentext, Tippen and Satzbau you can now ask for one hint per question. It shows the rule behind the answer without giving the answer away. A right answer after a hint earns half the points and keeps your run going, but only answers without hints count towards medals.',
  },
  {
    date: '2026-11-18T17:20Z',
    title: 'New game: Tippen (type the answer)',
    description:
      'A harder Lückentext for topics where you already have a medal: type the missing word yourself, with nothing to pick from. ä ö ü ß keys are built in, and if you’re just one letter off you’re told it was nearly right, though it still counts as a mistake.',
  },
  {
    date: '2026-11-18T16:54Z',
    title: 'A welcome for new learners',
    description:
      'Opening Nadjektiv for the first time now starts with three short screens: what the app is, the four games and their shapes, and how your progress is saved. You can pick German or English headings on the first screen, skip the intro at any point, and see it again from the About page.',
  },
  {
    date: '2026-11-18T16:12Z',
    title: 'The German stays German',
    description:
      'Browsers no longer offer to translate the app, so the sentences you’re learning from aren’t swapped for English. Installing Nadjektiv on your phone’s home screen also works more reliably.',
  },
  {
    date: '2026-11-18T14:56Z',
    title: 'New game: Tabelle (grid fill)',
    description:
      'Fill in a whole grammar table against the clock: articles, pronouns, verb endings, modal verbs, adjective endings, the Präteritum, comparatives and the 33 irregular verbs. Each cell locks green when it’s right, ä ö ü ß keys are built in, and missed cells go on your revise list. Beat your best time for every table.',
  },
  {
    date: '2026-11-18T14:28Z',
    title: 'Search for topics',
    description:
      'Type in the search box on the home page to find a topic by its German or English name, or by words like “Dativ”, “weil” or “past tense”. Umlauts are optional.',
  },
  {
    date: '2026-11-18T14:28Z',
    title: '“See the rules” goes straight to the rules',
    description:
      'From a card in “To revise”, the rules link now opens the topic scrolled to its rules section.',
  },
  {
    date: '2026-11-18T13:30Z',
    title: 'A bold new look',
    description:
      'A new Bauhaus-inspired design: big type, flat colour blocks, and shapes that mean something. der is always a blue square, die a red circle and das a yellow triangle, and each game has its own shape too.',
  },
  {
    date: '2026-11-18T13:02Z',
    title: 'Works fully offline',
    description:
      'After one visit with a connection, every topic and game works offline, including ones you haven’t opened yet.',
  },
  {
    date: '2026-11-18T12:57Z',
    title: 'New name: Nadjektiv',
    description: 'The app has a new name. Your progress carries over unchanged.',
  },
  {
    date: '2026-11-18T12:55Z',
    title: 'Added revision section',
    description:
      'Every question you get wrong lands in “To revise”, with the right answer, what you chose, why, and more examples. Answer it correctly later and it leaves the list. Mixed review now starts with these questions.',
  },
  {
    date: '2026-11-18T12:45Z',
    title: 'Every wrong answer is explained',
    description:
      'Blitz now pauses the clock when you get one wrong and shows what you chose, the right answer and the rule before you carry on.',
  },
  {
    date: '2026-11-18T12:45Z',
    title: 'Headings in German or English',
    description:
      'Choose whether headings and buttons are in German or English in Settings. Questions always stay in German.',
  },
  {
    date: '2026-11-18T12:38Z',
    title: 'More sentence orders accepted',
    description:
      'In Satzbau, a weil-, dass- or wenn-clause can now go before or after the main clause.',
  },
  {
    date: '2026-11-18T12:31Z',
    title: 'Every question double-checked',
    description:
      'All questions were reviewed: ones with two right answers were fixed, made-up words were replaced with real mistakes learners make, and every correct word order is now accepted.',
  },
  {
    date: '2026-11-18T12:27Z',
    title: 'First version',
    description:
      '24 A1–A2 grammar topics with three games (Blitz, Lückentext, Satzbau), mixed review, XP and levels, medals for each topic, personal bests, dark mode, progress export, and installing to your home screen.',
  },
];
