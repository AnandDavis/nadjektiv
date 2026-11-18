'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';

import { AppHeader } from '@/components/layout/AppHeader';
import { Ui } from '@/components/ui';

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
import { COPY } from '@/lib/i18n/copy';
import type { Progress } from '@/lib/progress/types';

import { FeedbackPanel } from './FeedbackPanel';
import { GameHeader } from './GameHeader';
import { GameIntro } from './GameIntro';
import { QuestionView } from './QuestionView';
import { ResultsScreen } from './ResultsScreen';
import { SortTimer } from './SortTimer';

/** In timed rounds a right answer moves on by itself after this pause. */
const SORT_CORRECT_ADVANCE_MS = 250;

interface GameScreenProps {
  mode: GameMode | 'review';
  /** One topic for a topic round; every topic for a mixed review. */
  topics: Topic[];
  title: ReactNode;
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
          current.revise,
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

  const isShowingFeedback = state.phase === 'feedback' && state.last !== undefined;
  // A wrong answer always stops for its explanation (and, in Blitz, stops the clock);
  // only a right answer in a timed round moves on by itself.
  const isAutoAdvancing = isTimed && isShowingFeedback && state.last?.isCorrect === true;
  const isWaitingOnLearner = isShowingFeedback && !isAutoAdvancing;

  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);
  useEffect(() => {
    if (!isAutoAdvancing) return;
    const id = window.setTimeout(() => nextRef.current(), SORT_CORRECT_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [isAutoAdvancing]);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* The quiz intro is a focused start screen; every other phase keeps the app header. */}
      {state.phase !== 'intro' && <AppHeader />}
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 pt-4 pb-8">
        {state.phase === 'intro' && (
          <GameIntro
            title={title}
            modeName={modeName}
            description={description}
            best={topicId && mode !== 'review' ? progress?.topics[topicId]?.modes[mode] : undefined}
            isReady={progress !== null}
            exitHref={exitHref}
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
              progress={
                isTimed ? undefined : { current: state.index + 1, total: state.items.length }
              }
              timer={
                isTimed ? (
                  <SortTimer
                    seconds={SORT_ROUND_SECONDS}
                    isPaused={isWaitingOnLearner}
                    onExpire={finish}
                  />
                ) : undefined
              }
            />
            <QuestionView
              key={`${state.items.length}-${state.index}-${item.question.id}`}
              item={item}
              last={state.phase === 'feedback' ? state.last : undefined}
              onAnswer={answer}
            />
            <div aria-live="polite" className="contents">
              {isWaitingOnLearner && state.last && (
                <FeedbackPanel
                  isCorrect={state.last.isCorrect}
                  given={state.last.given}
                  correctAnswer={correctAnswerText(item.question)}
                  explanation={item.question.explanation}
                  points={state.last.points}
                  onContinue={next}
                />
              )}
              {isAutoAdvancing && (
                <p className="sr-only">
                  <Ui {...COPY.game.correct} />
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
    </div>
  );
}
