'use client';

import { useI18n } from './useI18n';

/**
 * Single source of truth for a button's label while its action runs:
 * every button (inline `Button` and Telegram's bottom button) shows text, never a spinner.
 */
export const useBusyText = (text: string, busy: boolean, busyText?: string): string => {
  const { t } = useI18n();
  return busy ? (busyText ?? t.common.wait) : text;
};
