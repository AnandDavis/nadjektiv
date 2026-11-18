'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

import type { GridScreen as GridScreenComponent } from '../grid/GridScreen';
import type { GameScreen as GameScreenComponent } from './GameScreen';

// Each game loads in its own bundle, so a Lückentext round doesn't download grid fill
// and a grid round doesn't download the question games. Both still render on the
// server, so their chunks are in the page and precached for offline use.
const GameScreen = dynamic(() => import('./GameScreen').then((m) => m.GameScreen));
const GridScreen = dynamic(() => import('../grid/GridScreen').then((m) => m.GridScreen));

type PlayScreenProps =
  | { grid: ComponentProps<typeof GridScreenComponent> }
  | { game: ComponentProps<typeof GameScreenComponent> };

/** The play page's screen: grid fill or one of the question games. */
export function PlayScreen(props: PlayScreenProps) {
  return 'grid' in props ? <GridScreen {...props.grid} /> : <GameScreen {...props.game} />;
}
