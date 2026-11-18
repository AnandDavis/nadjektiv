import type { LastAnswer } from '@/lib/game/game-reducer';
import type { SessionItem } from '@/lib/game/session';

import { BuildQuestionView } from './BuildQuestionView';
import { GapQuestionView } from './GapQuestionView';
import { SortQuestionView } from './SortQuestionView';
import { TypeQuestionView } from './TypeQuestionView';

interface QuestionViewProps {
  item: SessionItem;
  last?: LastAnswer;
  onAnswer: (isCorrect: boolean, given: string) => void;
}

export function QuestionView({ item, last, onAnswer }: QuestionViewProps) {
  const { question } = item;
  switch (question.kind) {
    case 'sort':
      return (
        <SortQuestionView
          question={question}
          bins={item.bins ?? []}
          instruction={item.instruction}
          last={last}
          onAnswer={onAnswer}
        />
      );
    case 'gap':
      return item.typed ? (
        <TypeQuestionView question={question} last={last} onAnswer={onAnswer} />
      ) : (
        <GapQuestionView question={question} last={last} onAnswer={onAnswer} />
      );
    case 'build':
      return <BuildQuestionView question={question} last={last} onAnswer={onAnswer} />;
    default: {
      const exhaustive: never = question;
      throw new Error(`Unknown question kind: ${JSON.stringify(exhaustive)}`);
    }
  }
}
