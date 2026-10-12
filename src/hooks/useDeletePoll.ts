'use client';

import { useCallback, useState } from 'react';

import { pollsApi } from '@/lib/api/polls';
import { copy } from '@/shared/copy';

import { useConfirm } from './useConfirm';
import { useHaptics } from './useHaptics';

/** Asks for confirmation, deletes the poll, then calls `onDeleted`. */
export const useDeletePoll = (pollId: string, onDeleted: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(false);
  const confirm = useConfirm();
  const haptics = useHaptics();

  const remove = useCallback(async () => {
    if (!(await confirm(copy.poll.deleteConfirm))) return;

    setIsDeleting(true);
    setError(false);
    try {
      await pollsApi.remove(pollId);
      haptics.success();
      onDeleted();
    } catch {
      setError(true);
      haptics.error();
    } finally {
      setIsDeleting(false);
    }
  }, [confirm, pollId, onDeleted, haptics]);

  return { remove, isDeleting, error };
};
