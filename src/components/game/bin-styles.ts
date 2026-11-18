import { genderShape } from '@/lib/ui/shapes';

const GENDER_TEXT: Record<string, string> = { der: 'text-der', die: 'text-die', das: 'text-das' };
const GENDER_FILL: Record<string, string> = {
  der: 'bg-blue text-on-blue',
  die: 'bg-red text-on-red',
  das: 'bg-yellow text-on-yellow',
};

/** Text colour for an option: gender colours for der/die/das, ink otherwise. */
export function optionTextClass(option: string): string {
  return GENDER_TEXT[option.toLowerCase()] ?? 'text-ink';
}

/** Solid fill for a sort bin: the gender's primary for der/die/das, plain paper otherwise. */
export function binFillClass(bin: string): string | undefined {
  return genderShape(bin) ? GENDER_FILL[bin.toLowerCase()] : undefined;
}

/** A, B, C … keys for option lists. */
export function optionKey(index: number): string {
  return String.fromCharCode(65 + index);
}
