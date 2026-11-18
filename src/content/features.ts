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
    title: '27 grammar topics',
    description:
      'Everything on the A1 and A2 grammar syllabus, from der/die/das and the cases to weak nouns, verbs with prepositions, the past tense and connectors. Each topic has a short summary of the rules, with grammar words linked to the glossary.',
  },
  {
    title: 'Noun cards',
    description:
      'Learn 152 everyday nouns the way Germans say them: der Tisch, die Tische. Family, food, home, town, work, the body, clothes, time and nature: each card asks for the article and the plural together. The first time a noun comes up, a “new word” card shows its shape, article and plural before you’re asked.',
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
    title: 'Five games',
    description:
      'Blitz: sort as many prompts as you can in 60 seconds, with runs of right answers multiplying your points. Lückentext: pick the word that fills the gap. Satzbau: tap words into the right order. Tippen: once you have a medal, type the answer yourself on a German keyboard. Tabelle: fill in a whole table against the clock. And when you’re stuck, one hint per question shows the rule with the answer blanked out.',
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
    title: 'Verb lookup',
    description:
      'Look up 75 common verbs (irregular, modal, regular, separable and those that take the dative) by any form or their English meaning, and see its whole present tense, Präteritum and Perfekt (with haben or sein) together, with links to the topics.',
  },
  {
    title: 'Your progress',
    description:
      'The Progress page maps every topic as a square that fills in as you earn medals, and charts your answers on each of the last 14 days and the share right in each of the last 8 weeks. The records page gathers your bests: top Blitz score, longest run, fastest table, and your best in every game of every topic.',
  },
  {
    title: 'Glossary',
    description:
      'Every grammar term the app uses, from Akkusativ to Wechselpräposition, explained in plain English with a German example and links to the topics that teach it.',
  },
  {
    title: 'Works offline',
    description:
      'Add it to your home screen (Settings shows you how) and use it anywhere, even without a connection. When a new version is ready, a bar offers to update. Your progress stays on your device, with no account, cookies or ads; the app only counts anonymous page views, rounds played and loading times.',
  },
];
