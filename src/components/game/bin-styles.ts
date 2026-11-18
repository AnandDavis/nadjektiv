/** Gendered articles get their own colour so der/die/das become visual habits. */
const GENDER_TEXT: Record<string, string> = {
  der: 'text-der',
  die: 'text-die',
  das: 'text-das',
  Der: 'text-der',
  Die: 'text-die',
  Das: 'text-das',
};

export function optionTextClass(option: string): string {
  return GENDER_TEXT[option] ?? 'text-ink';
}
