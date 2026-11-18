import { BookIcon, Card, Ui } from '@/components/ui';
import type { RuleCard } from '@/content/types';
import { COPY } from '@/lib/i18n/copy';

export function RuleCards({ rules }: { rules: RuleCard[] }) {
  return (
    <section aria-labelledby="rules-heading">
      <h2
        id="rules-heading"
        className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-ink"
      >
        <BookIcon /> <Ui {...COPY.topic.rules} />
      </h2>
      <div className="flex flex-col gap-3">
        {rules.map((rule) => (
          <Card key={rule.heading}>
            <h3 className="font-display text-lg font-bold text-ink">{rule.heading}</h3>
            {rule.body && <p className="mt-1 text-ink">{rule.body}</p>}
            {rule.table && (
              <div className="-mx-1 mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr>
                      {rule.table.head.map((cell, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="border-b-2 border-line px-1 py-1.5 font-semibold text-muted"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rule.table.rows.map((row, r) => (
                      <tr key={r} className="border-b border-line last:border-0">
                        {row.map((cell, c) =>
                          c === 0 ? (
                            <th key={c} scope="row" className="px-1 py-1.5 font-semibold text-ink">
                              {cell}
                            </th>
                          ) : (
                            <td key={c} className="px-1 py-1.5 text-ink">
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
              <ul className="mt-3 flex flex-col gap-2">
                {rule.examples.map((example) => (
                  <li key={example.de} className="rounded-2xl bg-sunken px-3 py-2">
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
