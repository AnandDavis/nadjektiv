/**
 * How much of the layout viewport an on-screen keyboard covers. iOS (and Android
 * with interactive-widget=overlays-content) leaves the layout viewport full height
 * and shrinks only the visual viewport, so bottom-pinned UI ends up behind the
 * keyboard. The covered part is what lies below the visual viewport's bottom edge.
 */
export interface ViewportBox {
  height: number;
  offsetTop: number;
}

export function keyboardInset(layoutHeight: number, visual: ViewportBox | null): number {
  if (!visual) return 0;
  return Math.max(0, Math.round(layoutHeight - visual.height - visual.offsetTop));
}

/** CSS custom property the `bottom-keyboard` utility reads (see globals.css). */
export const KEYBOARD_INSET_VAR = '--keyboard-inset';
