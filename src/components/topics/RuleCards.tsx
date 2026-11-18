import { BookIcon, Card, SectionHeading, Ui } from '@/components/ui';
import type { RuleCard } from '@/content/types';
import { COPY } from '@/lib/i18n/copy';
import { RULES_HEADING_ID } from '@/lib/routes';

import { GlossaryText } from '../glossary/GlossaryText';

export function RuleCards({ rules }: { rules: RuleCard[] }) {
  return (
    <section aria-labelledby={RULES_HEADING_ID}>
      <SectionHeading id={RULES_HEADING_ID} mark={<BookIcon />}>
        <Ui {...COPY.topic.rules} />
      </SectionHeading>
      <div className="flex flex-col gap-4">
        {rules.map((rule, index) => (
          <Card key={rule.heading}>
            <h3 className="flex items-baseline gap-2 text-lg leading-tight font-black text-ink">
              <span className="text-sm text-muted tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              {rule.heading}
            </h3>
            {rule.body && (
              <p className="mt-1 text-ink">
                <GlossaryText text={rule.body} />
              </p>
            )}
            {rule.table && (
              <div
                className="-mx-1 mt-3 overflow-x-auto"
                role="region"
                aria-label={`${rule.heading} (table)`}
                tabIndex={0}
              >
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr>
                      {rule.table.head.map((cell, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="bg-ink px-2 py-1.5 text-xs font-extrabold tracking-wider text-canvas uppercase"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rule.table.rows.map((row, r) => (
                      <tr key={r} className="border-b-2 border-ink last:border-0">
                        {row.map((cell, c) =>
                          c === 0 ? (
                            <th key={c} scope="row" className="px-2 py-1.5 font-extrabold text-ink">
                              {cell}
                            </th>
                          ) : (
                            <td key={c} className="px-2 py-1.5 text-ink">
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {rule.examples && (
              <ul className="mt-3 border-t-2 border-ink">
                {rule.examples.map((example) => (
                  <li key={example.de} className="border-b border-line py-2 last:border-b-0">
                    <p lang="de" className="font-semibold text-ink">
                      {example.de}
                    </p>
                    <p className="text-sm text-muted">{example.en}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
