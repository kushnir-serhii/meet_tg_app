'use client';

import { useCallback, useState } from 'react';

import type { FeedbackInput } from '@/domain/feedback';
import { feedbackApi } from '@/lib/api/feedback';

import { useHaptics } from './useHaptics';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Sends the user's review to the backend. */
export const useFeedback = () => {
  const haptics = useHaptics();
  const [status, setStatus] = useState<Status>('idle');

  const send = useCallback(
    async (input: FeedbackInput) => {
      setStatus('sending');
      try {
        await feedbackApi.send(input);
        setStatus('sent');
        haptics.success();
      } catch {
        setStatus('error');
        haptics.error();
      }
    },
    [haptics],
  );

  return { send, status };
};
