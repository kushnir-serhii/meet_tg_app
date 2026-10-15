'use client';

import { useCallback, useSyncExternalStore } from 'react';

const DISMISSED_KEY = 'pik:feedback-dismissed-at';
const SENT_KEY = 'pik:feedback-sent';
const DISMISS_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable; the section simply shows again next time.
  }
};

const checkHidden = (): boolean => {
  if (readStorage(SENT_KEY) === '1') return true;
  const at = Date.parse(readStorage(DISMISSED_KEY) ?? '');
  return !Number.isNaN(at) && Date.now() - at < DISMISS_DAYS * DAY_MS;
};

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Remembers that the user dismissed or already sent the feedback prompt.
 * The server snapshot is "hidden", so SSR markup matches and nothing flashes before storage is read.
 */
export const useFeedbackDismiss = () => {
  const isDismissed = useSyncExternalStore(subscribe, checkHidden, () => true);

  const dismiss = useCallback(() => {
    writeStorage(DISMISSED_KEY, new Date().toISOString());
    listeners.forEach((listener) => {
      listener();
    });
  }, []);

  /** Persists "sent" without notifying, so the current "thank you" message stays visible. */
  const markSent = useCallback(() => {
    writeStorage(SENT_KEY, '1');
  }, []);

  return { isDismissed, dismiss, markSent };
};
