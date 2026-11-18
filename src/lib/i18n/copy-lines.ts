/** Interface lines with a number or name filled in. Re-exported from copy.ts. */
import type { Bilingual } from './bilingual';

/** "3 von 10 richtig" / "3 of 10 correct" */
export function correctCount(correct: number, total: number): Bilingual {
  return { de: `${correct} von ${total} richtig`, en: `${correct} of ${total} correct` };
}

/** "Level up! Du bist jetzt Level 3:" / "Level up! You’re now level 3:" */
export function levelUpLine(level: number): Bilingual {
  return {
    de: `Level up! Du bist jetzt Level ${level}:`,
    en: `Level up! You’re now level ${level}:`,
  };
}

/** "3 Themen" / "3 topics" */
export function topicCount(count: number): Bilingual {
  return {
    de: `${count} ${count === 1 ? 'Thema' : 'Themen'}`,
    en: `${count} ${count === 1 ? 'topic' : 'topics'}`,
  };
}

/** "Schritt 2 von 3" / "Step 2 of 3" */
export function stepOf(step: number, total: number): Bilingual {
  return { de: `Schritt ${step} von ${total}`, en: `Step ${step} of ${total}` };
}

/** The daily mix's line on the home page, for a learner with or without progress. */
export function dailyHint(length: number, hasProgress: boolean): Bilingual {
  return hasProgress
    ? {
        de: `${length} Fragen aus deiner Wiederholungsliste und deinen schwächsten Themen`,
        en: `${length} questions from your revise list and your weakest topics`,
      }
    : { de: `${length} Fragen zum Einstieg`, en: `${length} questions to get you started` };
}

/** "Gebaut von Nad in London" / "Built by Nad in London" */
export function builtBy(name: string, place: string): Bilingual {
  return { de: `Gebaut von ${name} in ${place}`, en: `Built by ${name} in ${place}` };
}

/** "Ohne Uhr hat Blitz 20 Wörter …" with the configured round length. */
export function untimedBlitzHint(length: number): Bilingual {
  return {
    de: `Ohne Uhr hat Blitz ${length} Wörter und eigene Rekorde.`,
    en: `Untimed Blitz has ${length} words and its own bests.`,
  };
}
