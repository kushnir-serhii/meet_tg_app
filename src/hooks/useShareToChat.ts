'use client';

import { useCallback } from 'react';

import { pollsApi } from '@/lib/api/polls';

import { useTelegram } from './useTelegram';

/**
 * Shares the poll card to a chat. Resolves `true` once it was actually sent.
 *
 * Bot API 8.0+: native chat picker with a preview (`shareMessage`).
 * Older clients (or if preparing fails): inline mode `@bot poll_<id>` — Telegram
 * closes the app for that, so the outcome is unknown (`false`).
 */
export const useShareToChat = (pollId: string) => {
  const webApp = useTelegram();

  return useCallback(async (): Promise<boolean> => {
    if (!webApp) return false;

    if (webApp.isVersionAtLeast('8.0')) {
      try {
        const { id } = await pollsApi.prepareShare(pollId);
        return await new Promise<boolean>((resolve) => {
          webApp.shareMessage(id, resolve);
        });
      } catch (error) {
        console.error('Native share failed, falling back to inline mode', error);
      }
    }

    webApp.switchInlineQuery(`poll_${pollId}`, ['users', 'groups', 'channels']);
    return false;
  }, [webApp, pollId]);
};
