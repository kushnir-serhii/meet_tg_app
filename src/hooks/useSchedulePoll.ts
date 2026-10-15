'use client';

import { useCallback, useState } from 'react';

import type { PollDetails, SlotRange } from '@/domain/types';
import { pollsApi } from '@/lib/api/polls';

import { useHaptics } from './useHaptics';

/** Organizer sets or clears the meeting time (and the optional call link). */
export const useSchedulePoll = (pollId: string, onDone: (data: PollDetails) => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const haptics = useHaptics();

  const schedule = useCallback(
    async (range: SlotRange | null, meetingUrl: string | null = null): Promise<boolean> => {
      setIsSaving(true);
      setError(false);
      try {
        onDone(await pollsApi.schedule(pollId, range, meetingUrl));
        haptics.success();
        return true;
      } catch {
        setError(true);
        haptics.error();
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [pollId, onDone, haptics],
  );

  return { schedule, isSaving, error };
};
