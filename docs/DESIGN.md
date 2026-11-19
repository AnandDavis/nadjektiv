# Design: the Bauhaus system

Nadjektiv looks like a printed Bauhaus poster, not a template. The concept drives every decision: warm paper, ink-black type and rules, and three primary shapes that carry meaning. If a new screen doesn't fit the concept, change the screen, not the concept.

## The shapes

| Shape          | Colour                 | Means                    |
| -------------- | ---------------------- | ------------------------ |
| ■ square       | blue                   | **der** · Lückentext     |
| ● circle       | red                    | **die** · Satzbau        |
| ▲ triangle     | yellow                 | **das** · Blitz          |
| ▦ four squares | blue, red, yellow, ink | Tabelle (grid fill)      |
| ▮ upright bar  | violet                 | Tippen (type the answer) |

The pairings are fixed so learners connect der with a blue square everywhere. Tippen's bar (▮, a text cursor) is violet, a fifth colour reserved for it, so every game has its own colour, and Tabelle's grid (▦) shows all four colours. Use `genderShape()` and `MODE_SHAPES` (`src/lib/ui/shapes.ts`) with the `<Shape>` primitive; never draw them ad hoc. Shapes are decorative (`aria-hidden`): always pair them with the word.

## Rules

1. **No rounded corners. No shadows.** Everything is flat and square. ESLint rejects `rounded-*` and `shadow-*` in components.
2. **Structure with rules, not cards.** Lists are rows divided by 2 px ink rules (`border-b-2 border-ink`), often numbered (01, 02 …). Use `Card` only for a bounded object, and never stack many cards.
3. **No one-sided accent borders.** A thick coloured border on one side of a box is the most recognisable "AI-built" pattern. Use a solid header strip (`bg-red text-on-red` above the content) or a full border instead.
4. **Type does the work.** One typeface: Archivo. Headings are `font-black`, often uppercase. Labels are small, uppercase and widely tracked (`text-xs font-extrabold tracking-widest uppercase`). Numbers are big (`text-4xl font-black tabular-nums`). German sentences use normal tracking so words don't collide.
5. **Colour as blocks.** Use the primaries as solid fills (`bg-blue`, `bg-red`, `bg-yellow`) with their `text-on-*` pair, not as tints. Yellow is the hover and highlight colour. Ink-filled bars (`bg-ink text-canvas`) frame the app (header, bottom nav, table heads).
6. **Feedback is functional, not decorative.** Correct is green (`bg-correct`), wrong is red with a strikethrough, and both always come with an icon or words.
7. **Section titles use `SectionHeading`** (heavy uppercase on a 4 px rule). Page titles: `text-4xl leading-none font-black tracking-tight`.

## Tokens

Defined once in `src/app/globals.css` with `light-dark()`; dark mode inverts paper and ink, and the header and nav bars become paper-coloured bands.

| Purpose                       | Utility                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------ |
| Page / raised surface / inset | `bg-canvas`, `bg-surface`, `bg-sunken`                                         |
| Text / secondary text         | `text-ink`, `text-muted`                                                       |
| Structural rules / hairlines  | `border-ink`, `border-line`                                                    |
| Primary blocks                | `bg-blue text-on-blue`, `bg-red text-on-red`, `bg-yellow text-on-yellow`       |
| Blitz case bins (den / dem)   | `bg-ink text-canvas`, `bg-orange text-on-orange`                               |
| Gender as text                | `text-der`, `text-die`, `text-das`                                             |
| Feedback                      | `bg-correct`, `bg-correct-soft`, `text-correct`, `text-wrong`, `bg-wrong-soft` |
| Medals                        | `text-bronze`, `text-silver`, `text-gold`, `text-mastered`, `text-tier-new`    |

## Avoid (the generic look)

Rounded cards stacked in a column · soft drop shadows · pill badges everywhere · icons in coloured rounded squares · one-sided accent borders · purple or indigo accents · gradient fills · Inter or system fonts · centred everything · timeline dots.
