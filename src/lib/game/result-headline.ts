import { COPY, type Bilingual } from '../i18n/copy';
import { accuracy, type AnswerRecord } from './scoring';

const WELL_DONE_ACCURACY = 0.7;

/** The headline on the results screen for a finished round. */
export function resultHeadline(answers: readonly AnswerRecord[]): Bilingual {
  if (answers.length === 0) return COPY.game.timeUp;
  const acc = accuracy(answers);
  if (acc === 1) return COPY.game.perfect;
  if (acc >= WELL_DONE_ACCURACY) return COPY.game.wellDone;
  return COPY.game.keepGoing;
}
