'use client';

import { useCallback, useState } from 'react';

import { pollsApi } from '@/lib/api/polls';

import { useConfirm } from './useConfirm';
import { useHaptics } from './useHaptics';
import { useI18n } from './useI18n';

/** Asks for confirmation, deletes the poll, then calls `onDeleted`. */
export const useDeletePoll = (pollId: string, onDeleted: () => void) => {
  const { t } = useI18n();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(false);
  const confirm = useConfirm();
  const haptics = useHaptics();

  const remove = useCallback(async () => {
    const ok = await confirm(t.poll.deleteConfirm, {
      confirmText: t.poll.deleteAction,
      destructive: true,
    });
    if (!ok) return;

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
  }, [confirm, pollId, onDeleted, haptics, t]);

  return { remove, isDeleting, error };
};
