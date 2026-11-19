const GENDER_TEXT: Record<string, string> = { der: 'text-der', die: 'text-die', das: 'text-das' };
const ARTICLE_FILL: Record<string, string> = {
  der: 'bg-blue text-on-blue',
  die: 'bg-red text-on-red',
  das: 'bg-yellow text-on-yellow',
  // The case forms get colours of their own, so no two article bins look alike.
  den: 'bg-den text-on-den',
  dem: 'bg-orange text-on-orange',
};

/** Text colour for an option: gender colours for der/die/das, ink otherwise. */
export function optionTextClass(option: string): string {
  return GENDER_TEXT[option.toLowerCase()] ?? 'text-ink';
}

/** Solid fill for a sort bin: one colour per article (der, die, das, den, dem), plain paper otherwise. */
export function binFillClass(bin: string): string | undefined {
  return ARTICLE_FILL[bin.toLowerCase()];
}

/** A, B, C … keys for option lists. */
export function optionKey(index: number): string {
  return String.fromCharCode(65 + index);
}
