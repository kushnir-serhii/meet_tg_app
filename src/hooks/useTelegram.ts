'use client';

import { useSyncExternalStore } from 'react';

import { getWebApp, type WebApp } from '@/lib/telegram/webApp';

const subscribe = () => () => undefined;
const getServerSnapshot = () => null;

/** Telegram WebApp object on the client, `null` during SSR or outside Telegram. */
export const useTelegram = (): WebApp | null =>
  useSyncExternalStore(subscribe, getWebApp, getServerSnapshot);
