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
    title: '24 grammar topics',
    description:
      'Everything on the A1 and A2 grammar syllabus, from der/die/das and the cases to adjective endings, the past tense and connectors. Each topic has a short summary of the rules.',
  },
  {
    title: 'Daily mix',
    description:
      'Ten ready-made questions a day, from your revise list and your weakest topics. It’s the same mix all day, a new one tomorrow, and marked done once you’ve played it. There’s no streak: skipping a day costs nothing.',
  },
  {
    title: 'Topic map',
    description:
      'The Progress page shows the whole syllabus as a grid of squares, one per topic, filled in as you earn medals. Tap a square to open that topic.',
  },
  {
    title: 'Blitz',
    description:
      'Sort as many prompts as you can in 60 seconds, such as der/die/das, Akkusativ/Dativ or haben/sein. Runs of right answers multiply your points.',
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
      'Once you have a medal in a topic, type the missing word yourself instead of picking it, with ä ö ü ß keys built in. Case and extra spaces don’t matter, but spelling does: “ae” never counts for “ä”. If you’re one letter off, you’re told it was nearly right.',
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
      'Every question you get wrong is collected with the answer, the rule and more examples, the ones you’ve missed most at the top. Answer it correctly later and it leaves the list.',
  },
  {
    title: 'Mixed review',
    description:
      'A round across all the topics you’ve played, starting with your “to revise” questions, then the ones you miss most.',
  },
  {
    title: 'Settings that suit you',
    description:
      'Play Blitz without the clock, keep hints out of sight or always showing, move straight on after a right answer, make the text bigger, turn off movement, hide the English translations, or empty your revise list.',
  },
  {
    title: 'Works offline',
    description:
      'Add it to your home screen and use it anywhere, even without a connection. Your progress stays on your device.',
  },
];
