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

/** "2× falsch" / "missed 2×", on a revise card. */
export function missedTimes(count: number): Bilingual {
  return { de: `${count}× falsch`, en: `missed ${count}×` };
}

/** When a revise entry comes back, and how many right answers it still needs. */
export function dueLine(days: number, left: number): Bilingual {
  const de = days === 0 ? 'Heute fällig' : days === 1 ? 'Morgen fällig' : `Fällig in ${days} Tagen`;
  const en = days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : `Due in ${days} days`;
  return {
    de: `${de} · noch ${left}× richtig`,
    en: `${en} · ${left} more right ${left === 1 ? 'answer' : 'answers'}`,
  };
}

/** "Prüfung A1" / "A1 test". */
export function examTitle(level: string): Bilingual {
  return { de: `Prüfung ${level}`, en: `${level} test` };
}

/** What a level test is, under its link. */
export function examHint(level: string, questions: number): Bilingual {
  return {
    de: `${questions} Fragen aus allen ${level}-Themen, ohne Hinweise. Am Ende gibt es eine Note.`,
    en: `${questions} questions from every ${level} topic, with no hints. You get a grade at the end.`,
  };
}

/** "Kombo ×2!" / "Combo ×2!", announced when the multiplier rises. */
export function comboLine(multiplier: number): Bilingual {
  return { de: `Kombo ×${multiplier}!`, en: `Combo ×${multiplier}!` };
}

/** "„dem“ statt „den“" / "“dem”, not “den”": a mistake pattern, right answer first. */
export function insteadOf(answer: string, given: string): Bilingual {
  return { de: `„${answer}“ statt „${given}“`, en: `“${answer}”, not “${given}”` };
}
