/**
 * Installing the app. Android (Chromium) fires `beforeinstallprompt`, which we keep so
 * our own button can show the browser's install dialog later. iPhone has no prompt,
 * so we explain Share → Add to Home Screen instead. Neither shows once installed.
 */

/** The non-standard event Chromium fires when the app can be installed. */
export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type InstallWay = 'installed' | 'prompt' | 'ios' | 'none';

let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();

export function subscribeInstall(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  for (const listener of listeners) listener();
}

export function captureInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    notify();
  });
}

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** iPhone or iPad Safari, which can add to the home screen but never prompts. */
export function isIos(userAgent: string, maxTouchPoints: number): boolean {
  return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1);
}

/** How this browser can install the app right now. */
export function installWay(): InstallWay {
  if (isStandalone()) return 'installed';
  if (deferred) return 'prompt';
  if (isIos(navigator.userAgent, navigator.maxTouchPoints)) return 'ios';
  return 'none';
}

/** Show the browser's install dialog (Android); resolves once the learner chooses. */
export async function promptInstall(): Promise<void> {
  const event = deferred;
  if (!event) return;
  deferred = null;
  notify();
  await event.prompt();
  await event.userChoice;
}
