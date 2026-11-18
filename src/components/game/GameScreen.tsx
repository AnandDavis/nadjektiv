'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { AppHeader } from '@/components/layout/AppHeader';
import { Ui } from '@/components/ui';

import type { GameMode, Question, RoundMode, Topic } from '@/content/types';
import { isMixedMode } from '@/lib/game/modes';
import { GAME_CONFIG } from '@/config/game';
import { useGameSession } from '@/hooks/useGameSession';
import { useGameShortcuts } from '@/hooks/useGameShortcuts';
import { useOption } from '@/hooks/useOption';
import { useProgress } from '@/hooks/useProgress';
import { formatSentence } from '@/lib/game/check-answer';
import { dailyKey, todaysMix, withDailyMix } from '@/lib/game/daily';
import { currentItem } from '@/lib/game/game-reducer';
import { hintFor } from '@/lib/game/hint';
import { diffBuiltSentence } from '@/lib/game/word-diff';
import { createRng } from '@/lib/game/rng';
import {
  SORT_ROUND_SECONDS,
  buildReviewSession,
  buildTopicSession,
  type SessionItem,
} from '@/lib/game/session';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import { nounToReveal, withSeenNoun } from '@/lib/nouns/reveal';
import { MODE_SHAPES } from '@/lib/ui/shapes';
import type { Progress } from '@/lib/progress/types';
import { OPTIONS } from '@/lib/storage/options';
import { updateProgress } from '@/lib/storage/progress-client';

import { FeedbackPanel } from './FeedbackPanel';
import { GameHeader } from './GameHeader';
import { GameIntro } from './GameIntro';
import type { GraduationInfo } from './GraduationPanel';
import { HintControl } from './HintControl';
import { NounReveal } from './NounReveal';
import { QuestionView } from './QuestionView';
import { ResultsScreen } from './ResultsScreen';
import { SortTimer } from './SortTimer';

/** In timed rounds a right answer moves on by itself after this pause. */
const SORT_CORRECT_ADVANCE_MS = 250;

interface GameScreenProps {
  mode: RoundMode;
  /** One topic for a topic round; every topic for mixed review and the daily mix. */
  topics: Topic[];
  title: ReactNode;
  modeName: ReactNode;
  description: string;
  exitHref: string;
  exitLabel: ReactNode;
  modesByTopic: Readonly<Record<string, readonly GameMode[]>>;
  topicTitles: Readonly<Record<string, Bilingual>>;
  /** About this round's topic, for a Gemeistert celebration (topic rounds only). */
  graduation?: GraduationInfo;
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
  useGameShortcuts();
  const topicId = isMixedMode(mode) ? undefined : topics[0]?.id;
  const [blitzClock] = useOption(OPTIONS.blitzClock);
  const [hintsOption] = useOption(OPTIONS.hints);
  const [autoAdvance] = useOption(OPTIONS.autoAdvance);
  const untimed = mode === 'sort' && blitzClock === 'untimed';

  const buildItems = useCallback(
    (current: Progress): SessionItem[] => {
      if (mode === 'daily') {
        const key = dailyKey(new Date());
        const { items, isNew } = todaysMix(topics, current, key);
        if (isNew) updateProgress((progress) => withDailyMix(progress, key, items));
        return items;
      }
      const rng = createRng(Date.now());
      if (mode === 'review') {
        return buildReviewSession(
          topics,
          new Set(Object.keys(current.topics)),
          current.questions,
          current.revise,
          rng,
          dailyKey(new Date()),
        );
      }
      return buildTopicSession(topics[0], mode, current.questions, rng, { untimed });
    },
    [mode, topics, untimed],
  );

  const { state, outcome, start, answer, next, finish, hint } = useGameSession({
    mode,
    topicId,
    modesByTopic: props.modesByTopic,
    buildItems,
    untimed,
    autoHint: hintsOption === 'shown',
  });
  const item = currentItem(state);
  const isTimed = mode === 'sort' && !untimed;
  const hintText = item && hintsOption !== 'hidden' ? hintFor(item.question) : undefined;

  // A noun met for the first time is shown before it's asked (and stops the clock).
  const [metThisRound, setMetThisRound] = useState<ReadonlySet<string>>(new Set());
  const revealNoun =
    item && progress && state.phase === 'playing'
      ? nounToReveal(item.question, progress)
      : undefined;
  const isRevealing = revealNoun !== undefined && !metThisRound.has(revealNoun.word);
  const meetNoun = (word: string) => {
    setMetThisRound((met) => new Set(met).add(word));
    updateProgress((current) => withSeenNoun(current, word));
  };

  const isShowingFeedback = state.phase === 'feedback' && state.last !== undefined;
  // A wrong answer always stops for its explanation (and, in Blitz, stops the clock).
  // A right answer moves on by itself in timed Blitz, or anywhere if the learner asked.
  const isAutoAdvancing =
    (isTimed || autoAdvance === 'on') && isShowingFeedback && state.last?.isCorrect === true;
  const isWaitingOnLearner = isShowingFeedback && !isAutoAdvancing;
  const advanceMs = isTimed ? SORT_CORRECT_ADVANCE_MS : GAME_CONFIG.autoAdvanceMs;

  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);
  useEffect(() => {
    if (!isAutoAdvancing) return;
    const id = window.setTimeout(() => nextRef.current(), advanceMs);
    return () => window.clearTimeout(id);
  }, [isAutoAdvancing, advanceMs]);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* The quiz intro is a focused start screen; every other phase keeps the app header. */}
      {state.phase !== 'intro' && <AppHeader />}
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 pt-4 pb-8">
        {state.phase === 'intro' && (
          <GameIntro
            title={title}
            modeName={modeName}
            description={
              untimed
                ? `${GAME_CONFIG.untimedSortLength} prompts and no clock: take your time over each one.`
                : description
            }
            best={
              topicId && !isMixedMode(mode)
                ? progress?.topics[topicId]?.modes[untimed ? 'sortUntimed' : mode]
                : undefined
            }
            isReady={progress !== null}
            shape={isMixedMode(mode) ? undefined : MODE_SHAPES[mode]}
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
              comboChange={state.last?.comboChange}
              progress={
                isTimed ? undefined : { current: state.index + 1, total: state.items.length }
              }
              timer={
                isTimed ? (
                  <SortTimer
                    seconds={SORT_ROUND_SECONDS}
                    isPaused={isWaitingOnLearner || isRevealing}
                    onExpire={finish}
                  />
                ) : undefined
              }
            />
            {isRevealing ? (
              <NounReveal noun={revealNoun} onDone={() => meetNoun(revealNoun.word)} />
            ) : (
              <QuestionView
                key={`${state.items.length}-${state.index}-${item.question.id}`}
                item={item}
                last={state.phase === 'feedback' ? state.last : undefined}
                onAnswer={answer}
              />
            )}
            <div aria-live="polite" className="contents">
              {state.phase === 'playing' && !isRevealing && hintText && (
                <HintControl hint={hintText} isShown={state.hinted} onShow={hint} />
              )}
              {isWaitingOnLearner && state.last && (
                <FeedbackPanel
                  isCorrect={state.last.isCorrect}
                  given={state.last.given}
                  givenLabel={item.typed ? COPY.typed.youTyped : undefined}
                  correctAnswer={correctAnswerText(item.question)}
                  diff={
                    item.question.kind === 'build' && !state.last.isCorrect
                      ? diffBuiltSentence(item.question, state.last.given)
                      : undefined
                  }
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
            bestCombo={state.bestCombo}
            recordCombo={
              topicId && !isMixedMode(mode)
                ? outcome?.progress.topics[topicId]?.modes[untimed ? 'sortUntimed' : mode]
                    ?.bestCombo
                : undefined
            }
            exitHref={exitHref}
            exitLabel={exitLabel}
            topicTitles={props.topicTitles}
            graduation={props.graduation}
            onPlayAgain={start}
          />
        )}
      </main>
    </div>
  );
}
