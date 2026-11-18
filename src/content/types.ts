/**
 * Content model for grammar topics and their question banks.
 *
 * Question IDs are persisted in learner progress — never reuse or renumber them.
 * See docs/CODING_STANDARDS.md § German content.
 */

export type Level = 'A1' | 'A2';

/**
 * Modes that ask one question at a time. `type` asks a topic's gap questions with
 * the answer typed instead of picked; it unlocks once the topic has a medal.
 */
export type QuestionMode = 'sort' | 'gap' | 'build' | 'type';

/** Every game mode: the question modes plus grid fill, which shows a whole table. */
export type GameMode = QuestionMode | 'grid';

/** A round of questions across topics: mixed review, or the daily mix. */
export type MixedMode = 'review' | 'daily';

/** What one question-at-a-time round is playing. */
export type RoundMode = QuestionMode | MixedMode;

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

/**
 * One cell of a grid. `answer` is shown once solved; `accepted` lists other spellings
 * that count (e.g. "kleinsten" for "am kleinsten"). Endings may be written with or
 * without their hyphen ("-en" or "en"). Case is ignored; umlauts and ß are not.
 */
export interface GridCell {
  answer: string;
  accepted?: string[];
  /** Pre-filled as an anchor; not typed and not scored. */
  given?: boolean;
}

export interface GridRow {
  label: string;
  cells: GridCell[];
}

/**
 * A table to fill in against the clock (grid fill mode).
 * Cell ids (`<id>:<row>:<col>`) are stored in progress: never reorder rows or columns.
 */
export interface GridPuzzle {
  /** `<topic-id>-grid-<n>`, stable. */
  id: string;
  title: string;
  titleDe: string;
  /** Heading above the row labels, e.g. "Fall" or "Person". */
  rowHeader: string;
  columns: string[];
  rows: GridRow[];
  /** Time limit for the round. */
  seconds: number;
  /** The rule the table shows, in English; used on results and revise cards. */
  explanation: string;
}

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
  /** German title, shown when the interface language is German. */
  titleDe: string;
  /** Extra search terms, German and English: grammar names and telltale words. */
  keywords: string[];
  /** One-line description shown on the topic card. */
  tagline: string;
  rules: RuleCard[];
  sort?: SortDeck;
  gap?: GapQuestion[];
  build?: BuildQuestion[];
  grids?: GridPuzzle[];
}
