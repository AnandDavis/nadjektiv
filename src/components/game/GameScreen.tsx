'use client';

import { useCallback, useEffect, useRef } from 'react';

import type { GameMode, Question, Topic } from '@/content/types';
import { useGameSession } from '@/hooks/useGameSession';
import { useProgress } from '@/hooks/useProgress';
import { formatSentence } from '@/lib/game/check-answer';
import { currentItem } from '@/lib/game/game-reducer';
import { createRng } from '@/lib/game/rng';
import {
  SORT_ROUND_SECONDS,
  buildReviewSession,
  buildTopicSession,
  type SessionItem,
} from '@/lib/game/session';
import type { Progress } from '@/lib/progress/types';

import { FeedbackPanel } from './FeedbackPanel';
import { GameHeader } from './GameHeader';
import { GameIntro } from './GameIntro';
import { QuestionView } from './QuestionView';
import { ResultsScreen } from './ResultsScreen';
import { SortTimer } from './SortTimer';

/** Pause after a sort answer before the next prompt: short when right, longer when wrong. */
const SORT_ADVANCE_MS = { correct: 250, wrong: 1400 } as const;

interface GameScreenProps {
  mode: GameMode | 'review';
  /** One topic for a topic round; every topic for a mixed review. */
  topics: Topic[];
  title: string;
  modeName: string;
  description: string;
  exitHref: string;
  exitLabel: string;
  modesByTopic: Readonly<Record<string, readonly GameMode[]>>;
  topicTitles: Readonly<Record<string, string>>;
}

function correctAnswerText(question: Question): string {
  switch (question.kind) {
    case 'sort':
    case 'gap':
      return question.answer;
    case 'build':
      return formatSentence(question.tiles, question.punctuation);
    default: {
      const exhaustive: never = question;
      return String(exhaustive);
    }
  }
}

export function GameScreen(props: GameScreenProps) {
  const { mode, topics, title, modeName, description, exitHref, exitLabel } = props;
  const progress = useProgress();
  const topicId = mode === 'review' ? undefined : topics[0]?.id;

  const buildItems = useCallback(
    (current: Progress): SessionItem[] => {
      const rng = createRng(Date.now());
      if (mode === 'review') {
        return buildReviewSession(
          topics,
          new Set(Object.keys(current.topics)),
          current.questions,
          rng,
        );
      }
      return buildTopicSession(topics[0], mode, current.questions, rng);
    },
    [mode, topics],
  );

  const { state, outcome, start, answer, next, finish } = useGameSession({
    mode,
    topicId,
    modesByTopic: props.modesByTopic,
    buildItems,
  });
  const item = currentItem(state);
  const isTimed = mode === 'sort';

  // Sort rounds advance on their own so the clock keeps the pressure on.
  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);
  useEffect(() => {
    if (!isTimed || state.phase !== 'feedback' || !state.last) return;
    const delay = state.last.isCorrect ? SORT_ADVANCE_MS.correct : SORT_ADVANCE_MS.wrong;
    const id = window.setTimeout(() => nextRef.current(), delay);
    return () => window.clearTimeout(id);
  }, [isTimed, state.phase, state.last]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-5 px-4 pt-4 pb-8">
      {state.phase === 'intro' && (
        <GameIntro
          title={title}
          modeName={modeName}
          description={description}
          best={topicId && mode !== 'review' ? progress?.topics[topicId]?.modes[mode] : undefined}
          isReady={progress !== null}
          onStart={start}
        />
      )}

      {item && (
        <>
          <GameHeader
            exitHref={exitHref}
            title={title}
            score={state.score}
            combo={state.combo}
            progress={isTimed ? undefined : { current: state.index + 1, total: state.items.length }}
            timer={
              isTimed ? <SortTimer seconds={SORT_ROUND_SECONDS} onExpire={finish} /> : undefined
            }
          />
          <QuestionView
            key={`${state.items.length}-${state.index}-${item.question.id}`}
            item={item}
            last={state.phase === 'feedback' ? state.last : undefined}
            onAnswer={answer}
          />
          <div aria-live="polite" className="contents">
            {state.phase === 'feedback' && state.last && !isTimed && (
              <FeedbackPanel
                isCorrect={state.last.isCorrect}
                correctAnswer={correctAnswerText(item.question)}
                explanation={item.question.explanation}
                points={state.last.points}
                onContinue={next}
              />
            )}
            {state.phase === 'feedback' && state.last && isTimed && (
              <p className="sr-only">
                {state.last.isCorrect
                  ? 'Richtig'
                  : `Falsch. Answer: ${correctAnswerText(item.question)}`}
              </p>
            )}
          </div>
        </>
      )}

      {state.phase === 'finished' && (
        <ResultsScreen
          score={state.score}
          answers={state.answers}
          mistakes={state.mistakes}
          outcome={outcome}
          exitHref={exitHref}
          exitLabel={exitLabel}
          topicTitles={props.topicTitles}
          onPlayAgain={start}
        />
      )}
    </main>
  );
}
