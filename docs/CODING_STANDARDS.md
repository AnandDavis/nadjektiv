# Coding Standards

Conventions for the Nadjektiv codebase. `CLAUDE.md` has the short list of critical rules; this document explains them.

## File naming

| What                               | Convention | Example                                                |
| ---------------------------------- | ---------- | ------------------------------------------------------ |
| React components                   | PascalCase | `SorterGame.tsx`, `MasteryBadge.tsx`                   |
| Classes (services, adapters)       | PascalCase | `LocalStorageProgressStore.ts`                         |
| Utilities, pure functions, content | kebab-case | `xp.ts`, `build-session.ts`, `two-way-prepositions.ts` |
| Next.js conventions                | lowercase  | `page.tsx`, `layout.tsx`, `manifest.ts`                |
| Directories                        | kebab-case | `components/game/`, `lib/progress/`                    |

## Project structure

```
src/app/                 routes — thin composition only
src/components/ui/       design-system primitives
src/components/<feature> feature components (game, progress, topics)
src/content/             grammar topics and question banks (data, no logic)
src/hooks/               React hooks
src/lib/<domain>/        pure domain logic and ports/adapters
```

Feature code imports primitives from `@/components/ui`; it never re-styles a local copy of a button or card. If a variant is missing, add it to the primitive.

## Ports and adapters

Anything that talks to the outside world (storage today, an API tomorrow) sits behind an interface.

```typescript
// src/lib/storage/progress-store.ts — the port
export interface ProgressStore {
  load(): Progress;
  save(progress: Progress): void;
}

// src/lib/storage/LocalStorageProgressStore.ts — one adapter
export class LocalStorageProgressStore implements ProgressStore { … }
```

Domain logic depends on `ProgressStore`, never on `window.localStorage`. A future `RemoteProgressStore` drops in without UI changes.

## Pure domain logic

Scoring, mastery tiers, XP levels, question selection and answer checking are pure functions in `src/lib`. They take data in and return new data; they don't read clocks, randomness or storage implicitly.

```typescript
// ✅ Good — randomness and stats are injected, so it's deterministic and testable
export function buildSession(questions: Question[], stats: QuestionStatsMap, rng: Rng): Question[];

// ❌ Bad — hidden Math.random() and storage reads
export function buildSession(topicId: string) {
  const stats = JSON.parse(localStorage.getItem('stats')!);
  return shuffle(questions, Math.random);
}
```

Return new objects; don't mutate inputs. `applySessionResult(progress, result)` returns a new `Progress`.

## Components

### Pages are thin

A page composes feature components and passes route params. No logic, no data shaping.

```tsx
export default async function TopicPage({ params }: PageProps<'/topics/[topicId]'>) {
  const { topicId } = await params;
  const topic = getTopic(topicId);
  if (!topic) notFound();
  return <TopicOverview topic={topic} />;
}
```

### Decompose early

Extract when a component handles more than one concern, repeats a JSX pattern, or passes ~150 lines. Signs: several unrelated `useState`s, blank-line-separated JSX sections, nested ternaries.

Replace nested ternaries with early returns or small components:

```tsx
// ✅ Good
if (state.status === 'finished') return <ResultsScreen result={state.result} />;
return <QuestionView question={state.current} onAnswer={answer} />;
```

### Component template

```tsx
'use client'; // only when the component needs state, effects or browser APIs

interface SorterCardProps {
  prompt: string;
  onChoose: (option: string) => void;
}

export function SorterCard({ prompt, onChoose }: SorterCardProps) {
  // 1. hooks  2. handlers  3. early returns  4. render
}
```

Prefer named exports for components and utilities. Pages, layouts and other Next.js convention files use default exports.

### Name components by purpose

`SorterGame`, `GapFillGame`, `TopicCard` — not `Game`, `Question`, `Card`.

## Styling and design tokens

All colours come from the tokens in `src/app/globals.css`, exposed to Tailwind via `@theme`. The full visual language (shapes, rules, type, what to avoid) is in [DESIGN.md](DESIGN.md). Components use semantic utilities:

| Purpose                       | Utility                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------ |
| Page / raised surface / inset | `bg-canvas`, `bg-surface`, `bg-sunken`                                         |
| Primary text / secondary text | `text-ink`, `text-muted`                                                       |
| Rules / hairlines             | `border-ink`, `border-line`                                                    |
| Primary blocks                | `bg-blue text-on-blue`, `bg-red text-on-red`, `bg-yellow text-on-yellow`       |
| Correct / wrong feedback      | `bg-correct`, `bg-correct-soft`, `text-correct`, `text-wrong`, `bg-wrong-soft` |
| Grammatical gender            | `text-der`, `text-die`, `text-das`                                             |
| Mastery tiers                 | `text-bronze`, `text-silver`, `text-gold`, `text-mastered`                     |

No rounded corners and no shadows: ESLint rejects `rounded-*` and `shadow-*` classes in components.

Dark mode is handled by redefining the tokens under `[data-theme='dark']` (and `prefers-color-scheme` when the learner hasn't chosen), so components don't need `dark:` variants for token colours. If you find yourself reaching for a raw `dark:` variant, the token set is missing something — add a token instead.

Never use hex codes, `rgb()`, raw hue classes (`bg-red-500`) or arbitrary values (`p-[13px]`) in components.

### Mobile first

- Design at 360 px, then enhance with `sm:`/`md:`.
- Touch targets ≥ 44 px (`min-h-11`).
- Respect `prefers-reduced-motion` — animations use the `motion-safe:` variant.
- Use `dvh` units for full-height game screens so mobile browser chrome doesn't clip them.

## Accessibility

- Use real `<button>`, `<a>`, `<main>`, `<nav>`, headings in order.
- Game feedback ("Richtig!", "Nicht ganz") is announced via an `aria-live="polite"` region.
- Never signal correctness by colour alone — pair it with an icon or text.
- Every interactive element has a visible focus ring (built into the primitives).
- The Playwright axe spec (`e2e/a11y.spec.ts`) must pass.

## German content

Question banks live in `src/content/topics/<topic-id>.ts` and export a `Topic`.

- Every question has a stable, unique `id` (`<topic>-<mode>-<n>`). Progress is keyed by it, so **never reuse or renumber IDs** — retire a question by deleting it, and give a new one a new number.
- Every question has an English `explanation` that states the rule, not just the answer.
- Sentence-builder questions list every acceptable word order in `accepted`.
- Grid tables (`grids` on a topic) are stored by cell (`<grid-id>:<row>:<col>`) in learners' progress and revise lists, so never reorder or remove rows or columns. Only append, or add a new grid. Mark anchor cells `given`, and list other accepted spellings in `accepted`.
- Use real umlauts and `ß` — never `ae`/`ss` substitutes.
- The content-integrity test (`src/content/content.test.ts`) checks IDs, options and answers. Extend it when you add a new question shape.

## TypeScript

- `strict` is on; no `any`. Use `unknown` plus a type guard or Zod at trust boundaries (storage, network, imports).
- Explicit return types on exported functions.
- Discriminated unions for variants (`question.kind`, `session.status`), with exhaustive `switch` and a `never` check.
- `interface` for object shapes, `type` for unions and aliases.
- `import type` for type-only imports.

## Persistence

- Every persisted shape has a Zod schema and a `version` field. Bump it with a migration when existing saves no longer fit; a new optional field needs no bump (see CLAUDE.md rule 5).
- On load: parse → migrate older versions → validate. If the data is corrupt, keep a backup copy under a separate key before falling back to defaults — never silently drop a learner's progress.
- Writes go through `ProgressStore.save`. Components never call `localStorage`.
- Store `0` for measured zeros; `undefined` means "never played".

## Error handling

- Every promise chain has a `.catch()` or `try/catch`.
- Error messages carry context: `Unknown topic: ${topicId}`, not `Not found`.
- Storage can throw (private mode, quota). Adapters catch and degrade gracefully; the game keeps working in memory.

## Naming

- Variables and functions: `camelCase`; booleans start with `is`/`has`/`should`; handlers with `handle`.
- Constants: `UPPER_SNAKE_CASE` for module-level fixed values (`SESSION_LENGTH`, `XP_PER_CORRECT`).
- Types: `PascalCase`, descriptive (`GapQuestion`, not `Q`).

## Imports

Order: React/Next → third-party → `@/components` → `@/lib`, `@/hooks`, `@/content` → types → styles. Use the `@/` alias rather than long relative paths.

## Testing

| Layer                  | Tool                    | What                                                                                                               |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Pure logic (`src/lib`) | Vitest                  | Scoring, XP, mastery, sessions, answer checking, storage, migrations. Coverage thresholds: 95% lines, 90% branches |
| Content                | Vitest                  | Integrity of every question bank, plus a Hunspell German spellcheck of all correct text                            |
| Flows                  | Playwright              | Sessions end to end, progress persistence, revise list, offline, header and menu                                   |
| Accessibility          | Playwright + axe        | Every main screen in both themes, plus the open menu and a game in play                                            |
| Visual                 | Playwright screenshots  | Key screens in light and dark; update baselines only for intended changes                                          |
| Budgets                | Playwright + Lighthouse | Compressed JS per page, installability, Lighthouse category scores                                                 |

Exhaustive `switch` defaults that the type system proves unreachable may be marked `/* v8 ignore next */` with a reason; don't use it to hide untested behaviour.

Test behaviour, not implementation: query by role and label, not class names.

## Comments

Explain **why**, not **what**. Header comments on modules whose purpose isn't obvious from the name. Keep comments current — a stale comment is worse than none.

## Performance

- Memoise derived data that's expensive to recompute (`useMemo`) — not everything.
- No layout shift: reserve space for progress-dependent UI until the store has hydrated.
- No N+1 work: compute derived stats (mastery for every topic) in one pass, not per card per render.
