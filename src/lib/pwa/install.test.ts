import { describe, expect, it, vi } from 'vitest';

import {
  captureInstallPrompt,
  installWay,
  isIos,
  promptInstall,
  subscribeInstall,
} from './install';

describe('install', () => {
  it('recognises iPhone, iPad and iPadOS Safari', () => {
    expect(isIos('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', 5)).toBe(true);
    expect(isIos('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5)).toBe(true);
    expect(isIos('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0)).toBe(false);
    expect(isIos('Mozilla/5.0 (Linux; Android 14; Pixel 7)', 5)).toBe(false);
  });

  it('keeps the browser’s install prompt for our button, and uses it once', async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    captureInstallPrompt();
    expect(installWay()).toBe('none');

    const listener = vi.fn();
    const unsubscribe = subscribeInstall(listener);
    const prompt = vi.fn().mockResolvedValue(undefined);
    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(installWay()).toBe('prompt');

    await promptInstall();
    expect(prompt).toHaveBeenCalledOnce();
    expect(installWay()).toBe('none');
    await promptInstall();
    expect(prompt).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it('says installed when running from the home screen', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    expect(installWay()).toBe('installed');
  });
});
