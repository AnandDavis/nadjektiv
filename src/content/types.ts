/**
 * Content model for grammar topics and their question banks.
 *
 * Question IDs are persisted in learner progress — never reuse or renumber them.
 * See docs/CODING_STANDARDS.md § German content.
 */

export type Level = 'A1' | 'A2';

export type GameMode = 'sort' | 'gap' | 'build';

export type TopicGroup = 'nouns' | 'cases' | 'verbs' | 'sentences' | 'prepositions' | 'adjectives';

interface QuestionBase {
  /** Stable, unique ID: `<topic-id>-<mode>-<n>`. */
  id: string;
  /** English explanation of the rule behind the answer, shown after answering. */
  explanation: string;
}

/**
 * Rapid-fire sorter: one prompt, tapped into one of the deck's bins.
 * `prompt` may contain `___` to mark the slot being asked about.
 */
export interface SortQuestion extends QuestionBase {
  kind: 'sort';
  prompt: string;
  /** Optional English gloss shown under the prompt. */
  gloss?: string;
  /** Must be one of the deck's `bins`. */
  answer: string;
}

export interface SortDeck {
  /** Instruction shown above the game, e.g. "Tap the article". */
  instruction: string;
  /** 2–4 short labels; every question's answer is one of these. */
  bins: string[];
  questions: SortQuestion[];
}

/**
 * Gap fill: a sentence with one gap and 2–4 options.
 * `before` and `after` include their own spacing. If `before` doesn't end in
 * whitespace, the gap is a word ending (`ein gut` + `es` + ` Kind`).
 */
export interface GapQuestion extends QuestionBase {
  kind: 'gap';
  before: string;
  after: string;
  options: string[];
  /** Must be one of `options`. */
  answer: string;
  /** English translation of the complete sentence. */
  translation: string;
}

/**
 * Sentence builder: put the tiles in order.
 * `tiles` is one correct order. Write tiles as they appear mid-sentence
 * (lowercase `ich`, `heute`); the UI capitalises the first word. Commas are their
 * own `','` entries: they are never tiles to place, so a clause can move without
 * changing the tile set (`['ich', 'koche', ',', 'wenn', …]` and
 * `['wenn', …, ',', 'koche', 'ich']`). Each order carries its own commas for display.
 * Terminal punctuation goes in `punctuation`.
 */
export interface BuildQuestion extends QuestionBase {
  kind: 'build';
  translation: string;
  tiles: string[];
  /** Other correct orders: the same words as `tiles` (commas may sit elsewhere). */
  accepted?: string[][];
  punctuation: '.' | '?' | '!';
}

export type Question = SortQuestion | GapQuestion | BuildQuestion;

export interface RuleTable {
  head: string[];
  rows: string[][];
}

export interface RuleExample {
  de: string;
  en: string;
}

/** One card in the "Learn" panel for a topic. */
export interface RuleCard {
  heading: string;
  body?: string;
  table?: RuleTable;
  examples?: RuleExample[];
}

export interface Topic {
  /** kebab-case, used in URLs. */
  id: string;
  level: Level;
  group: TopicGroup;
  title: string;
  /** One-line description shown on the topic card. */
  tagline: string;
  rules: RuleCard[];
  sort?: SortDeck;
  gap?: GapQuestion[];
  build?: BuildQuestion[];
}
