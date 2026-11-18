'use client';

import { Ui } from '@/components/ui';
import type { Level } from '@/content/types';
import { examPercent, gradeFor, weakestTopics } from '@/lib/exam/exam';
import type { AnswerRecord } from '@/lib/game/scoring';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import type { SessionOutcome } from '@/lib/progress/apply-session';
import { topicRulesHref } from '@/lib/routes';

import { TopicLink } from '../topics/TopicLink';

interface ExamResultProps {
  level: Level;
  answers: readonly AnswerRecord[];
  outcome: SessionOutcome | null;
  topicTitles: Readonly<Record<string, Bilingual>>;
}

const LABEL = 'text-xs font-extrabold tracking-widest text-muted uppercase';

/** A level test's grade, the best so far, and the topics to go back to. */
export function ExamResult({ level, answers, outcome, topicTitles }: ExamResultProps) {
  const percent = examPercent(answers);
  const grade = gradeFor(percent);
  const best = outcome?.progress.exams?.[level]?.bestPercent;
  const weakest = weakestTopics(answers);
  const passed = grade !== 'nichtBestanden';

  return (
    <section aria-labelledby="exam-grade" className="flex flex-col gap-4 border-4 border-ink p-4">
      <div>
        <p id="exam-grade" className={LABEL}>
          <Ui {...COPY.exam.grade} />
        </p>
        <p
          className={`text-4xl leading-tight font-black uppercase ${passed ? 'text-ink' : 'text-wrong'}`}
        >
          <Ui {...COPY.exam[grade]} />
        </p>
        <p className="text-sm text-muted">
          {outcome?.examBest ? (
            <strong className="text-ink">
              <Ui {...COPY.exam.newBest} />
            </strong>
          ) : (
            best !== undefined && (
              <>
                <Ui {...COPY.exam.best} />: <span className="tabular-nums">{best}%</span> ·{' '}
                <Ui {...COPY.exam[gradeFor(best)]} />
              </>
            )
          )}
        </p>
      </div>
      <div>
        <p className={LABEL}>
          <Ui {...(weakest.length > 0 ? COPY.exam.goBack : COPY.exam.noWeakSpots)} />
        </p>
        {weakest.length > 0 && (
          <ul className="mt-1 flex flex-col">
            {weakest.map((topicId) => (
              <li key={topicId}>
                <TopicLink
                  topicId={topicId}
                  href={topicRulesHref(topicId)}
                  className="inline-flex min-h-11 items-center font-semibold text-brand-strong underline underline-offset-4"
                >
                  {topicTitles[topicId] ? <Ui {...topicTitles[topicId]} /> : topicId} →
                </TopicLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
