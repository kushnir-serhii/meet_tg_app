'use client';

import { useCallback, useState } from 'react';

import type { PollDetails } from '@/domain/types';
import { pollsApi } from '@/lib/api/polls';

import { useHaptics } from './useHaptics';

type Status = 'idle' | 'saving' | 'saved' | 'error';

export const useSaveAvailability = (pollId: string, onSaved: (data: PollDetails) => void) => {
  const [status, setStatus] = useState<Status>('idle');
  const haptics = useHaptics();

  const save = useCallback(
    async (slots: string[]): Promise<boolean> => {
      setStatus('saving');
      try {
        onSaved(await pollsApi.saveResponse(pollId, slots));
        setStatus('saved');
        haptics.success();
        return true;
      } catch {
        setStatus('error');
        haptics.error();
        return false;
      }
    },
    [pollId, onSaved, haptics],
  );

  const resetStatus = useCallback(() => {
    setStatus('idle');
  }, []);

  return { save, status, resetStatus };
};
