'use client';

import { useCallback, useState } from 'react';

import type { Poll } from '@/domain/types';
import type { CreatePollInput } from '@/domain/validation';
import { pollsApi } from '@/lib/api/polls';

export const useCreatePoll = (onCreated: (poll: Poll) => void) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (input: CreatePollInput) => {
      setIsPending(true);
      setError(null);
      try {
        const { poll } = await pollsApi.create(input);
        onCreated(poll);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setIsPending(false);
      }
    },
    [onCreated],
  );

  return { create, isPending, error };
};
