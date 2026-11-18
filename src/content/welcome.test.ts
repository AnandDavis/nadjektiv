import { describe, expect, it } from 'vitest';

import { GAME_MODES } from './index';
import { WELCOME_GAMES, welcomeIntro } from './welcome';

describe('welcome intro', () => {
  it('counts the topics in both languages', () => {
    expect(welcomeIntro(24)).toEqual({
      de: expect.stringContaining('24 Themen'),
      en: expect.stringContaining('24 topics'),
    });
  });

  it('introduces every game', () => {
    expect(WELCOME_GAMES.map((g) => g.mode).sort()).toEqual([...GAME_MODES].sort());
  });
});
