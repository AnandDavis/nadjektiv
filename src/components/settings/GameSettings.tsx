import { Card, Ui } from '@/components/ui';
import { GAME_CONFIG } from '@/config/game';
import { COPY, untimedBlitzHint } from '@/lib/i18n/copy';
import { OPTIONS } from '@/lib/storage/options';

import { OptionControl } from './OptionControl';

const S = COPY.settings;

/** How the games behave: the Blitz clock, hints, and the pause after a right answer. */
export function GameSettings() {
  return (
    <Card className="flex flex-col gap-6">
      <h2 className="text-xs font-extrabold tracking-widest text-ink uppercase">
        <Ui {...S.playing} />
      </h2>
      <OptionControl
        option={OPTIONS.blitzClock}
        legend={S.blitzClock}
        hint={untimedBlitzHint(GAME_CONFIG.untimedSortLength)}
        labels={{ timed: S.blitzTimed, untimed: S.blitzUntimed }}
      />
      <OptionControl
        option={OPTIONS.hints}
        legend={S.hints}
        hint={S.hintsHint}
        labels={{ button: S.hintsButton, shown: S.hintsShown, hidden: S.hintsHidden }}
      />
      <OptionControl
        option={OPTIONS.autoAdvance}
        legend={S.autoAdvance}
        hint={S.autoAdvanceHint}
        labels={{ off: S.autoAdvanceOff, on: S.autoAdvanceOn }}
      />
    </Card>
  );
}
