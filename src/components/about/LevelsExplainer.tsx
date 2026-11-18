import { Card, SectionHeading, Ui } from '@/components/ui';
import {
  HINT_XP_PERCENT,
  LAST_TITLE_LEVEL,
  PERFECT_BONUS_XP,
  comboSteps,
  levelTable,
} from '@/lib/about/levels';
import { COPY } from '@/lib/i18n/copy';
import { cn } from '@/lib/utils/cn';

const CELL = 'px-2 py-1.5';

export function LevelsExplainer() {
  const steps = comboSteps();
  const rows = levelTable(LAST_TITLE_LEVEL);
  const [, second, third] = rows;

  return (
    <section aria-labelledby="levels-heading" className="flex flex-col gap-3">
      <SectionHeading id="levels-heading">
        <Ui {...COPY.about.levels} />
      </SectionHeading>

      <Card>
        <h3 className="text-lg leading-tight font-black text-ink uppercase">
          <Ui {...COPY.about.earningXp} />
        </h3>
        <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-ink">
          <li>
            Every right answer earns {steps[0].pointsPerAnswer} XP. Wrong answers never cost XP.
          </li>
          {steps.slice(1).map((step) => (
            <li key={step.multiplier}>
              From {step.inARow} right answers in a row, each one is worth ×{step.multiplier} (
              {step.pointsPerAnswer} XP).
            </li>
          ))}
          <li>A wrong answer resets the run back to ×1.</li>
          <li>
            After a hint, a right answer earns {HINT_XP_PERCENT}% of its XP. Your run stays where it
            was: it doesn’t reset, but it doesn’t grow either.
          </li>
          <li>
            Get every question in a round right, without hints, for a +{PERFECT_BONUS_XP} XP bonus.
          </li>
          <li>Your points for a round are the XP you earn, in every game and in mixed review.</li>
        </ul>
      </Card>

      <Card>
        <h3 className="text-lg leading-tight font-black text-ink uppercase">
          <Ui {...COPY.about.levelsTable} />
        </h3>
        <p className="mt-1 text-sm text-ink">
          Each level needs {third.stepXp - second.stepXp} XP more than the one before:{' '}
          {second.stepXp} XP to reach level 2, then {third.stepXp} more for level 3, and so on. New
          titles unlock along the way.
        </p>
        <div
          className="-mx-1 mt-3 overflow-x-auto"
          role="region"
          aria-label="Levels table"
          tabIndex={0}
        >
          <table className="w-full border-collapse text-left text-sm tabular-nums">
            <thead>
              <tr className="bg-ink text-canvas">
                <th scope="col" className={CELL}>
                  <Ui {...COPY.common.level} />
                </th>
                <th scope="col" className={CELL}>
                  <Ui {...COPY.about.xpForLevel} />
                </th>
                <th scope="col" className={CELL}>
                  <Ui {...COPY.about.totalXp} />
                </th>
                <th scope="col" className={CELL}>
                  <Ui {...COPY.about.title} />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.level}
                  className={cn('border-b border-line last:border-0', row.newTitle && 'bg-sunken')}
                >
                  <th scope="row" className={cn(CELL, 'font-semibold text-ink')}>
                    {row.level}
                  </th>
                  <td className={cn(CELL, 'text-ink')}>
                    {row.stepXp === 0 ? '–' : row.stepXp.toLocaleString('en-GB')}
                  </td>
                  <td className={cn(CELL, 'text-ink')}>{row.totalXp.toLocaleString('en-GB')}</td>
                  <td className={cn(CELL, 'font-semibold text-ink')}>
                    {row.newTitle && <Ui {...row.newTitle} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">
          Levels keep going after {LAST_TITLE_LEVEL}, each needing {third.stepXp - second.stepXp} XP
          more than the last.
        </p>
      </Card>
    </section>
  );
}
