/**
 * The learner's options in Settings: how the games behave and how pages read. Each is
 * one of a fixed set of values with a default, stored only when changed. Options that
 * change layout carry a <html> attribute, set before paint by PREFERENCES_SCRIPT and
 * read by globals.css, so a page never flashes in the wrong size or motion.
 */

import { STORAGE_CONFIG } from '@/config/app';

import { notifyPreferences, readPreference, writePreference } from './pref-store';

export interface OptionDef<T extends string = string> {
  key: string;
  values: readonly T[];
  fallback: T;
  /** <html> attribute that carries a non-default value, for CSS. */
  attribute?: string;
}

function option<const T extends string>(
  name: string,
  values: readonly T[],
  attribute?: string,
): OptionDef<T> {
  return { key: `${STORAGE_CONFIG.keyPrefix}:${name}`, values, fallback: values[0], attribute };
}

export const OPTIONS = {
  /** Blitz against the 60-second clock, or untimed (with its own bests). */
  blitzClock: option('blitz-clock', ['timed', 'untimed']),
  /** The hint button; the hint shown up front; or no hints at all. */
  hints: option('hints', ['button', 'shown', 'hidden']),
  /** After a right answer outside Blitz: wait for Weiter, or move on by itself. */
  autoAdvance: option('auto-advance', ['off', 'on']),
  /** Follow the phone's reduced-motion setting, or turn this app's motion off. */
  motion: option('motion', ['system', 'reduce'], 'data-motion'),
  textSize: option('text-size', ['normal', 'large', 'larger'], 'data-text-size'),
  /** English lines under German questions. */
  translations: option('translations', ['shown', 'hidden'], 'data-translations'),
} as const;

export type OptionValue<D> = D extends OptionDef<infer T> ? T : never;

export function readOption<T extends string>(def: OptionDef<T>): T {
  const stored = readPreference(def.key);
  return def.values.find((value) => value === stored) ?? def.fallback;
}

export function writeOption<T extends string>(def: OptionDef<T>, value: T): void {
  const isDefault = value === def.fallback;
  if (def.attribute) {
    const root = document.documentElement;
    if (isDefault) root.removeAttribute(def.attribute);
    else root.setAttribute(def.attribute, value);
  }
  writePreference(def.key, isDefault ? null : value);
  notifyPreferences();
}

/** ES5 for the pre-paint script: copy each stored layout option onto <html>. */
export function optionAttributesScript(): string {
  return Object.values(OPTIONS as Record<string, OptionDef>)
    .filter((def) => def.attribute)
    .map((def) => {
      const allowed = def.values.filter((v) => v !== def.fallback);
      const test = allowed.map((v) => `v===${JSON.stringify(v)}`).join('||');
      return `v=s.getItem(${JSON.stringify(def.key)});if(${test})d.setAttribute(${JSON.stringify(def.attribute)},v);`;
    })
    .join('');
}
