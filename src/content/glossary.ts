/**
 * The glossary: grammar terms used in the rules and explanations, each with a plain
 * explanation, a German example, and the topics that teach it. Content: every example
 * is checked by the German spellcheck, and every topic id by content.test.ts.
 */

export interface GlossaryEntry {
  /** URL fragment on /glossary, stable: other pages may link to #id. */
  id: string;
  /** The German term, as learners meet it in the app. */
  term: string;
  english: string;
  /** Plain English, one or two sentences. */
  explanation: string;
  /** `highlight`: the words that show the term, in order as they appear in `de`. */
  example: { de: string; en: string; highlight: string[] };
  /** Topic ids that teach the term. */
  topics: string[];
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    id: 'adjektivendung',
    term: 'Adjektivendung',
    english: 'adjective ending',
    explanation:
      'An adjective in front of a noun takes an ending, and the ending depends on the article, the gender and the case.',
    example: { de: 'Das ist ein neues Auto.', en: 'That’s a new car.', highlight: ['neues'] },
    topics: ['adjective-endings'],
  },
  {
    id: 'akkusativ',
    term: 'Akkusativ',
    english: 'accusative',
    explanation:
      'The case of the direct object: who or what the action is done to. Only the masculine changes: der becomes den, ein becomes einen.',
    example: { de: 'Ich sehe den Bus.', en: 'I can see the bus.', highlight: ['den Bus'] },
    topics: ['cases', 'articles'],
  },
  {
    id: 'artikel',
    term: 'Artikel',
    english: 'article',
    explanation:
      'The small word in front of a noun: der, die, das (the), ein, eine (a) or kein (no). Its form shows the noun’s gender, number and case.',
    example: {
      de: 'Ich habe einen Bruder und eine Schwester.',
      en: 'I have a brother and a sister.',
      highlight: ['einen', 'eine'],
    },
    topics: ['articles', 'noun-gender'],
  },
  {
    id: 'dativ',
    term: 'Dativ',
    english: 'dative',
    explanation:
      'The case of the indirect object (to or for whom), after verbs like helfen and danken, and after prepositions like mit, bei, nach, von and zu.',
    example: {
      de: 'Ich helfe meiner Mutter.',
      en: 'I’m helping my mother.',
      highlight: ['meiner Mutter'],
    },
    topics: ['cases', 'dative-verbs', 'prepositions-place-time'],
  },
  {
    id: 'genus',
    term: 'Genus',
    english: 'gender',
    explanation:
      'Every noun is masculine (der), feminine (die) or neuter (das). The gender belongs to the word, not to the thing, so learn each noun with its article.',
    example: {
      de: 'der Tisch, die Lampe, das Fenster',
      en: 'the table, the lamp, the window',
      highlight: ['der', 'die', 'das'],
    },
    topics: ['noun-gender', 'articles'],
  },
  {
    id: 'hauptsatz',
    term: 'Hauptsatz',
    english: 'main clause',
    explanation:
      'A clause that can stand on its own. In a statement its conjugated verb is always the second element.',
    example: {
      de: 'Heute bleibe ich zu Hause.',
      en: 'I’m staying at home today.',
      highlight: ['bleibe'],
    },
    topics: ['word-order', 'connectors'],
  },
  {
    id: 'hilfsverb',
    term: 'Hilfsverb',
    english: 'auxiliary verb',
    explanation:
      'A helper verb that builds a tense with another verb: haben or sein in the Perfekt, and werden for the future.',
    example: {
      de: 'Er ist um acht Uhr gekommen.',
      en: 'He came at eight o’clock.',
      highlight: ['ist'],
    },
    topics: ['perfekt', 'zu-infinitive'],
  },
  {
    id: 'imperativ',
    term: 'Imperativ',
    english: 'imperative',
    explanation:
      'The form for instructions and requests. It has one form for du, one for ihr and one for Sie.',
    example: { de: 'Komm bitte schnell!', en: 'Please come quickly!', highlight: ['Komm'] },
    topics: ['imperative'],
  },
  {
    id: 'infinitiv',
    term: 'Infinitiv',
    english: 'infinitive',
    explanation:
      'The basic form of a verb, as in the dictionary, usually ending in -en. After a modal verb or zu it goes to the end of the sentence.',
    example: {
      de: 'Ich möchte heute schwimmen.',
      en: 'I’d like to swim today.',
      highlight: ['schwimmen'],
    },
    topics: ['modal-verbs', 'zu-infinitive'],
  },
  {
    id: 'kasus',
    term: 'Kasus',
    english: 'case',
    explanation:
      'The job a noun does in the sentence. German has four cases, and articles, pronouns and adjective endings change to show which one.',
    example: {
      de: 'Der Mann gibt dem Kind den Ball.',
      en: 'The man gives the child the ball.',
      highlight: ['Der Mann', 'dem Kind', 'den Ball'],
    },
    topics: ['cases', 'articles'],
  },
  {
    id: 'komparativ',
    term: 'Komparativ',
    english: 'comparative',
    explanation:
      'Comparing two things: add -er, usually with als. Many short adjectives also take an umlaut: alt, älter.',
    example: {
      de: 'Mein Bruder ist älter als ich.',
      en: 'My brother is older than me.',
      highlight: ['älter als'],
    },
    topics: ['comparatives'],
  },
  {
    id: 'konjugation',
    term: 'Konjugation',
    english: 'conjugation',
    explanation:
      'Changing a verb’s ending to match its subject: ich spiele, du spielst, er spielt. Some verbs also change their vowel.',
    example: {
      de: 'Du sprichst sehr gut Deutsch!',
      en: 'You speak German very well!',
      highlight: ['sprichst'],
    },
    topics: ['present-tense', 'irregular-verbs'],
  },
  {
    id: 'konjunktion',
    term: 'Konjunktion',
    english: 'conjunction',
    explanation:
      'A word that joins two clauses. With und, aber, oder and denn the word order stays the same; weil, dass, wenn and obwohl send the verb to the end.',
    example: {
      de: 'Ich lerne Deutsch, denn ich wohne in Berlin.',
      en: 'I’m learning German because I live in Berlin.',
      highlight: ['denn'],
    },
    topics: ['connectors'],
  },
  {
    id: 'mittelfeld',
    term: 'Mittelfeld',
    english: 'middle field',
    explanation:
      'Everything between the conjugated verb and the end of the sentence. Its order has rules: a dative noun before an accusative noun, but pronouns first.',
    example: {
      de: 'Ich gebe dem Kind einen Ball.',
      en: 'I’m giving the child a ball.',
      highlight: ['dem Kind einen Ball'],
    },
    topics: ['sentence-middle'],
  },
  {
    id: 'modalverb',
    term: 'Modalverb',
    english: 'modal verb',
    explanation:
      'können, müssen, wollen, sollen, dürfen and mögen: verbs that change the meaning of a second verb, which goes to the end as an infinitive.',
    example: {
      de: 'Ich muss heute lange arbeiten.',
      en: 'I have to work late today.',
      highlight: ['muss'],
    },
    topics: ['modal-verbs'],
  },
  {
    id: 'nebensatz',
    term: 'Nebensatz',
    english: 'subordinate clause',
    explanation:
      'A clause that starts with a word like weil, dass or wenn and can’t stand on its own. Its conjugated verb goes to the very end.',
    example: {
      de: 'Ich bleibe zu Hause, weil ich krank bin.',
      en: 'I’m staying at home because I’m ill.',
      highlight: ['weil ich krank bin'],
    },
    topics: ['connectors', 'word-order'],
  },
  {
    id: 'negation',
    term: 'Negation',
    english: 'negation',
    explanation:
      'Saying no or not: kein in front of nouns that would take ein or no article, and nicht for everything else.',
    example: {
      de: 'Ich habe keine Zeit. Ich komme heute nicht.',
      en: 'I have no time. I’m not coming today.',
      highlight: ['keine', 'nicht'],
    },
    topics: ['negation'],
  },
  {
    id: 'nomen',
    term: 'Nomen',
    english: 'noun',
    explanation:
      'A word for a person, thing, place or idea. German nouns always start with a capital letter and have a gender.',
    example: {
      de: 'Der Hund schläft im Garten.',
      en: 'The dog is asleep in the garden.',
      highlight: ['Hund', 'Garten'],
    },
    topics: ['noun-gender', 'plurals'],
  },
  {
    id: 'nominativ',
    term: 'Nominativ',
    english: 'nominative',
    explanation:
      'The case of the subject: who or what does the action. It’s the form you find in the dictionary.',
    example: {
      de: 'Der Lehrer kommt aus Wien.',
      en: 'The teacher comes from Vienna.',
      highlight: ['Der Lehrer'],
    },
    topics: ['cases'],
  },
  {
    id: 'objekt',
    term: 'Objekt',
    english: 'object',
    explanation:
      'The person or thing the action is done to (the accusative object) or for (the dative object).',
    example: {
      de: 'Sie schreibt ihrer Freundin einen Brief.',
      en: 'She’s writing her friend a letter.',
      highlight: ['ihrer Freundin', 'einen Brief'],
    },
    topics: ['cases', 'dative-verbs', 'sentence-middle'],
  },
  {
    id: 'partizip-ii',
    term: 'Partizip II',
    english: 'past participle',
    explanation:
      'The verb form at the end of a Perfekt sentence, usually ge- … -t (gemacht) or ge- … -en (gegessen).',
    example: { de: 'Wir sind nach Hause gegangen.', en: 'We went home.', highlight: ['gegangen'] },
    topics: ['perfekt', 'irregular-verbs'],
  },
  {
    id: 'perfekt',
    term: 'Perfekt',
    english: 'present perfect',
    explanation:
      'The everyday spoken past: haben or sein in second place, and the past participle at the end.',
    example: {
      de: 'Gestern habe ich Pizza gegessen.',
      en: 'I ate pizza yesterday.',
      highlight: ['habe', 'gegessen'],
    },
    topics: ['perfekt'],
  },
  {
    id: 'plural',
    term: 'Plural',
    english: 'plural',
    explanation:
      'More than one. German has several plural endings, and in the plural every noun takes the article die.',
    example: { de: 'ein Kind, zwei Kinder', en: 'one child, two children', highlight: ['Kinder'] },
    topics: ['plurals'],
  },
  {
    id: 'praeposition',
    term: 'Präposition',
    english: 'preposition',
    explanation:
      'A small word in front of a noun that shows place, time or direction, such as in, auf, mit or nach. Each one takes a particular case.',
    example: {
      de: 'Wir fahren mit dem Bus zur Arbeit.',
      en: 'We go to work by bus.',
      highlight: ['mit', 'zur'],
    },
    topics: ['prepositions-place-time', 'two-way-prepositions'],
  },
  {
    id: 'praesens',
    term: 'Präsens',
    english: 'present tense',
    explanation:
      'For what happens now, for habits, and often for the future when a time word says when.',
    example: {
      de: 'Morgen fahre ich nach Hamburg.',
      en: 'Tomorrow I’m going to Hamburg.',
      highlight: ['fahre'],
    },
    topics: ['present-tense'],
  },
  {
    id: 'praeteritum',
    term: 'Präteritum',
    english: 'simple past',
    explanation:
      'The past tense of stories and writing. In conversation it’s used mainly for sein, haben and the modal verbs: war, hatte, konnte.',
    example: {
      de: 'Als Kind war ich oft krank.',
      en: 'As a child I was often ill.',
      highlight: ['war'],
    },
    topics: ['praeteritum', 'irregular-verbs'],
  },
  {
    id: 'pronomen',
    term: 'Pronomen',
    english: 'pronoun',
    explanation:
      'A word that stands in for a noun: ich, du, er, sie, es and so on. Pronouns change with the case too: er, ihn, ihm.',
    example: {
      de: 'Kennst du Paul? Ja, ich kenne ihn.',
      en: 'Do you know Paul? Yes, I know him.',
      highlight: ['ihn'],
    },
    topics: ['pronouns'],
  },
  {
    id: 'reflexives-verb',
    term: 'reflexives Verb',
    english: 'reflexive verb',
    explanation:
      'A verb that comes with a pronoun (mich, dich, sich …) pointing back to the subject.',
    example: {
      de: 'Ich freue mich auf das Wochenende.',
      en: 'I’m looking forward to the weekend.',
      highlight: ['mich'],
    },
    topics: ['reflexive-verbs'],
  },
  {
    id: 'subjekt',
    term: 'Subjekt',
    english: 'subject',
    explanation:
      'The person or thing doing the action, in the nominative. The verb’s ending agrees with it.',
    example: { de: 'Wir wohnen in Berlin.', en: 'We live in Berlin.', highlight: ['Wir'] },
    topics: ['present-tense', 'word-order'],
  },
  {
    id: 'superlativ',
    term: 'Superlativ',
    english: 'superlative',
    explanation: 'The most of something: am … -sten, or der, die, das … -ste in front of a noun.',
    example: {
      de: 'Im Winter sind die Tage am kürzesten.',
      en: 'In winter the days are shortest.',
      highlight: ['am kürzesten'],
    },
    topics: ['comparatives'],
  },
  {
    id: 'trennbares-verb',
    term: 'trennbares Verb',
    english: 'separable verb',
    explanation:
      'A verb with a prefix that splits off and goes to the end of the sentence: ankommen becomes kommt … an.',
    example: {
      de: 'Der Zug kommt um neun Uhr an.',
      en: 'The train arrives at nine o’clock.',
      highlight: ['kommt', 'an'],
    },
    topics: ['separable-verbs'],
  },
  {
    id: 'verb',
    term: 'Verb',
    english: 'verb',
    explanation:
      'The word for an action or a state. In a statement the conjugated verb always comes second, even if something else comes first.',
    example: {
      de: 'Heute spielt Anna Tennis.',
      en: 'Anna is playing tennis today.',
      highlight: ['spielt'],
    },
    topics: ['present-tense', 'word-order'],
  },
  {
    id: 'wechselpraeposition',
    term: 'Wechselpräposition',
    english: 'two-way preposition',
    explanation:
      'One of nine prepositions, such as in, an and auf, that take the accusative for movement (wohin?) and the dative for location (wo?).',
    example: {
      de: 'Ich lege das Buch auf den Tisch. Jetzt liegt es auf dem Tisch.',
      en: 'I put the book on the table. Now it’s lying on the table.',
      highlight: ['auf den Tisch', 'auf dem Tisch'],
    },
    topics: ['two-way-prepositions'],
  },
];
