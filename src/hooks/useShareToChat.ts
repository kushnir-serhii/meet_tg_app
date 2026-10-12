'use client';

import { useCallback } from 'react';

import { useTelegram } from './useTelegram';

/** Opens the chat picker and inserts `@bot poll_<id>` — the bot answers with the poll card. */
export const useShareToChat = (pollId: string) => {
  const webApp = useTelegram();

  return useCallback(() => {
    webApp?.switchInlineQuery(`poll_${pollId}`, ['users', 'groups', 'channels']);
  }, [webApp, pollId]);
};
