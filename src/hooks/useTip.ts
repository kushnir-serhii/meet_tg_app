'use client';

import { useCallback, useState } from 'react';

import type { TipAmount } from '@/domain/tips';
import { tipsApi } from '@/lib/api/tips';
import type { InvoiceStatus } from '@/lib/telegram/webApp';

import { useHaptics } from './useHaptics';
import { useTelegram } from './useTelegram';

type Status = 'idle' | 'loading' | 'paid' | 'error';

/** Creates a Stars invoice and opens Telegram's native payment sheet. */
export const useTip = () => {
  const webApp = useTelegram();
  const haptics = useHaptics();
  const [status, setStatus] = useState<Status>('idle');

  const handleResult = useCallback(
    (result: InvoiceStatus) => {
      if (result === 'paid') {
        setStatus('paid');
        haptics.success();
      } else {
        setStatus(result === 'failed' ? 'error' : 'idle');
      }
    },
    [haptics],
  );

  const tip = useCallback(
    async (amount: TipAmount) => {
      if (!webApp) return;
      setStatus('loading');
      try {
        const { link } = await tipsApi.createInvoice(amount);
        webApp.openInvoice(link, handleResult);
      } catch {
        setStatus('error');
        haptics.error();
      }
    },
    [webApp, handleResult, haptics],
  );

  return { tip, status };
};
