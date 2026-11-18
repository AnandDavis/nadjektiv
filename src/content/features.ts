/**
 * What the app does, shown on the About page. Keep this in step with the change log
 * (see CLAUDE.md): when a feature ships, describe it here as it now works.
 */

export interface Feature {
  title: string;
  description: string;
}

export const FEATURES: readonly Feature[] = [
  {
    title: '25 grammar topics',
    description:
      'Everything on the A1 and A2 grammar syllabus, from der/die/das and the cases to adjective endings, the past tense and connectors. Each topic has a short summary of the rules, with grammar words linked to the glossary.',
  },
  {
    title: 'Noun cards',
    description:
      'Learn nouns the way Germans say them: der Tisch, die Tische. Each card asks for the article and the plural together. The first time a noun comes up, a “new word” card shows its shape, article and plural before you’re asked.',
  },
  {
    title: 'Level tests',
    description:
      'A Prüfung for A1 and for A2: 20 questions from every topic of the level, with no hints. You get a grade from Sehr gut to Nicht bestanden, the topics to go back to, and your best result is kept.',
  },
  {
    title: 'Daily mix',
    description:
      'Ten ready-made questions a day, from the revise questions due today and your weakest topics, leaning towards questions like the ones that broke a long run of right answers. It’s the same mix all day, a new one tomorrow, and marked done once you’ve played it. There’s no streak: skipping a day costs nothing.',
  },
  {
    title: 'Topic map',
    description:
      'The Progress page shows the whole syllabus as a grid of squares, one per topic, filled in as you earn medals. Tap a square to open that topic.',
  },
  {
    title: 'Blitz',
    description:
      'Sort as many prompts as you can in 60 seconds, such as der/die/das, Akkusativ/Dativ or haben/sein. Runs of right answers multiply your points; the game tells you when your combo rises or is lost, and the results show your longest run beside your record.',
  },
  {
    title: 'Lückentext',
    description: 'Fill the gap in 10 real sentences, with the rule explained after every answer.',
  },
  {
    title: 'Satzbau',
    description:
      'Tap words into the right order to build 8 sentences. Every correct German word order counts.',
  },
  {
    title: 'Tippen',
    description:
      'Once you have a medal in a topic, type the missing word yourself instead of picking it. On a phone the app’s own German keyboard has ä ö ü ß beside the space bar (or switch to your phone’s keyboard in Settings). Case and extra spaces don’t matter, but spelling does: “ae” never counts for “ä”. If you’re one letter off, you’re told it was nearly right.',
  },
  {
    title: 'Hints',
    description:
      'Stuck in Lückentext, Tippen or Satzbau? Show one hint per question: the rule behind it, with the answer blanked out. A right answer then earns half the points and doesn’t break your run, but it doesn’t count towards medals.',
  },
  {
    title: 'Tabelle',
    description:
      'Fill in a whole table against the clock, such as the article grid or the irregular verbs. Cells lock green when they’re right, and your best time is saved for each table.',
  },
  {
    title: 'Every mistake explained',
    description:
      'A wrong answer always stops to show what you chose, the right answer and why, before you carry on.',
  },
  {
    title: 'To revise',
    description:
      'Every question you get wrong is collected with the answer, the rule and more examples. It comes back after 1, 3 and then 7 days; answer it right each time it’s due and it leaves the list, while a miss starts it again. Mix-ups you make more than once are grouped under Common mistakes, with the rule that fixes them.',
  },
  {
    title: 'Mixed review',
    description:
      'A round across all the topics you’ve played, starting with the “to revise” questions due today, then the rest of the list, then the ones you miss most.',
  },
  {
    title: 'Settings that suit you',
    description:
      'Play Blitz without the clock, choose the app’s keyboard or your own, keep hints out of sight or always showing, move straight on after a right answer, make the text bigger, turn off movement, hide the English translations, or empty your revise list.',
  },
  {
    title: 'Verb lookup',
    description:
      'Look up any of the 33 irregular verbs, by any form or its English meaning, and see its whole present tense, Präteritum and Perfekt (with haben or sein) together, with links to the topics.',
  },
  {
    title: 'Your history and records',
    description:
      'The Progress page charts your answers on each of the last 14 days and the share right in each of the last 8 weeks. The records page gathers your bests: top Blitz score, longest run, fastest table, and your best in every game of every topic.',
  },
  {
    title: 'Keyboard shortcuts',
    description:
      'On a computer, pick answers with 1–4 or A–D, continue with Enter, show a hint with H, and take back a word in Satzbau with Backspace.',
  },
  {
    title: 'Glossary',
    description:
      'Every grammar term the app uses, from Akkusativ to Wechselpräposition, explained in plain English with a German example and links to the topics that teach it.',
  },
  {
    title: 'No tracking',
    description:
      'No account, no cookies, no ads. To see which topics and games get used and how fast pages load, the app counts anonymous page views, finished rounds (just the topic and game) and loading times with Vercel Web Analytics and Speed Insights, which set no cookies and record nothing that identifies you. Your progress itself never leaves your device.',
  },
  {
    title: 'Works offline',
    description:
      'Add it to your home screen (Settings shows you how) and use it anywhere, even without a connection. When a new version is ready, a bar offers to update. Your progress stays on your device, and the app asks your browser to keep it safe.',
  },
];
