'use client';

import { useCallback, useEffect, useState } from 'react';

import type { PollDetails } from '@/domain/types';
import { pollsApi } from '@/lib/api/polls';

type State =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; data: PollDetails };

export const usePollDetails = (pollId: string) => {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    pollsApi
      .get(pollId, controller.signal)
      .then((data) => {
        setState({ status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
        });
      });

    return () => {
      controller.abort();
    };
  }, [pollId, attempt]);

  const reload = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  /** Replace data after a mutation (e.g. saved availability). */
  const update = useCallback((data: PollDetails) => {
    setState({ status: 'ready', data });
  }, []);

  return { state, reload, update };
};
