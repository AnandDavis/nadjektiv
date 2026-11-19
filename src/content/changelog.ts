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
    date: '2026-11-19T11:00Z',
    title: 'Small animations',
    description:
      'Answers feel livelier: the gap in a sentence wipes open to show your word, a right answer’s shape drops into place, your score ticks up and flashes when a run grows, and Satzbau words slide into the sentence. At the end of a round the results count up and your mistakes rise in with the right word underlined. The topic map ripples in, the XP bar fills, folded sections slide open and pages fade between the tabs. Turn it all off in Settings under Bewegung.',
  },
  {
    date: '2026-11-19T09:50Z',
    title: 'More German, clearer round reviews',
    description:
      'With the app in German, topic descriptions and game intros are now in German too. At the end of a round, each mistake shows the right word underlined in the sentence with your answer underneath, and on a phone the buttons stay at the bottom of the screen. Topics are numbered in the order you see them, rule tables fit on a phone screen, and the records page labels its columns.',
  },
  {
    date: '2026-11-19T09:30Z',
    title: 'Search the glossary, and articles always in order',
    description:
      'The glossary has a search box: type a term in German or English to find it. Article choices now always read der, die, das (then den, dem) so each one is in the same place every time, and in Blitz den and dem have colours of their own. The Progress page now counts the questions you have to revise, and its topic list folds away under the map; open it to see your best in every game, in points or, for Tabelle, your fastest time.',
  },
  {
    date: '2026-11-18T23:40Z',
    title: 'More words and two new topics',
    description:
      'Noun cards now cover 152 everyday nouns, from family and food to clothes and nature. The der/die/das Blitz has compound nouns like die Haustür, and Plural has nouns with no singular, like die Eltern. Two new A2 topics: weak nouns (den Kollegen) and verbs with prepositions (warten auf, Angst haben vor). The verb lookup now has 75 verbs, including the modal verbs, and comparatives have a second table.',
  },
  {
    date: '2026-11-18T23:30Z',
    title: 'Easier typing in Tippen',
    description:
      'In Tippen the keyboard now stays at the bottom of the screen with the hint button above it, a × in the answer field clears what you typed, and a word that starts a sentence shows its capital letter as you type.',
  },
  {
    date: '2026-11-18T23:20Z',
    title: 'No tracking, just anonymous counts',
    description:
      'The app now counts anonymous page views, finished rounds (only the topic and game) and loading speed, to learn which topics to improve. It uses no cookies and records nothing about you; your progress still never leaves your device.',
  },
  {
    date: '2026-11-18T23:10Z',
    title: 'Your history on the Progress page',
    description:
      'Two small charts show how many answers you gave on each of the last 14 days and how many you got right in each of the last 8 weeks. There are no streaks: a day off is just an empty bar.',
  },
  {
    date: '2026-11-18T23:00Z',
    title: 'Verb lookup',
    description:
      'Open Verben from the menu to look up any of the 33 irregular verbs, by any form (ging finds gehen) or its English meaning, and see its present tense, Präteritum and Perfekt together.',
  },
  {
    date: '2026-11-18T22:50Z',
    title: 'Level tests',
    description:
      'Take a Prüfung for A1 or A2 from the end of each level on the home page: 20 questions from every topic, no hints, and a grade at the end with the topics to go back to. Your best result is kept.',
  },
  {
    date: '2026-11-18T22:40Z',
    title: 'Noun cards and new words',
    description:
      'A new topic, Artikel und Plural, asks for a noun’s article and plural together: der Tisch, die Tische. And the first time a noun comes up in a game, a card shows it with its article and plural before you’re asked (the Blitz clock waits).',
  },
  {
    date: '2026-11-18T22:30Z',
    title: 'Revise at the right moment',
    description:
      'Questions on your revise list now come back after 1, 3 and then 7 days. Answer one right each time it’s due and it leaves the list; a miss starts it again. Mixed review and the daily mix ask the ones due today first, and the Revise tab counts only those.',
  },
  {
    date: '2026-11-18T22:20Z',
    title: 'Common mistakes',
    description:
      'The revise page now groups mix-ups you’ve made more than once, such as dem instead of den, with the rule that fixes them all.',
  },
  {
    date: '2026-11-18T22:15Z',
    title: 'Combos, records and celebrations',
    description:
      'The game now tells you when your combo rises or is lost, the results show your longest run beside your record, a new records page gathers your bests, and reaching Gemeistert in a topic gets its own celebration. The daily mix also leans towards questions like the ones that broke a long run.',
  },
  {
    date: '2026-11-18T22:10Z',
    title: 'A German keyboard, and shortcuts',
    description:
      'On a phone, Tippen and Tabelle now use the app’s own keyboard with ä ö ü ß beside the space bar (you can switch back to your phone’s keyboard in Settings). On a computer, play with the keyboard: 1–4 or A–D to choose, Enter to continue, H for a hint.',
  },
  {
    date: '2026-11-18T22:05Z',
    title: 'Easier to install, safer progress',
    description:
      'Settings now shows how to add the app to your home screen, a bar offers the new version when one is ready, and the app asks your browser to keep your progress safe. Grammar words in the rules and on revise cards link to the glossary.',
  },
  {
    date: '2026-11-18T22:00Z',
    title: 'Glossary',
    description:
      'Not sure what Dativ, Nebensatz or Partizip II means? The new glossary, in the menu, explains 33 grammar terms in plain English, each with a German example and links to the topics where you can practise it.',
  },
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
