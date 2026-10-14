'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { PollDetails } from '@/domain/types';
import { pollsApi } from '@/lib/api/polls';

import { useHaptics } from './useHaptics';
import { useTelegram } from './useTelegram';

/** Wait after the last change before saving — a drag produces many changes. */
const DEBOUNCE_MS = 1000;

export type AutoSaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

const toKey = (slots: Iterable<string>): string => [...slots].sort().join(',');

/**
 * Saves the selection automatically: debounced, one request at a time, always the latest value.
 * `flush()` saves right now (before leaving the tab, closing the app or sharing).
 * While something is unsaved, Telegram asks before closing the app.
 */
export const useAutoSave = (
  pollId: string,
  selected: ReadonlySet<string>,
  initialSlots: readonly string[],
  onSaved: (data: PollDetails) => void,
) => {
  const webApp = useTelegram();
  const haptics = useHaptics();
  const [status, setStatus] = useState<AutoSaveStatus>('idle');

  const latest = useRef<string[]>([...selected]);
  const savedKey = useRef(toKey(initialSlots));
  /** Saved at least once in this session — tells "saved" apart from "untouched". */
  const savedOnce = useRef(false);
  const queue = useRef<Promise<boolean>>(Promise.resolve(true));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSavedRef = useRef(onSaved);
  useEffect(() => {
    onSavedRef.current = onSaved;
  }, [onSaved]);

  /** Queues a save of the latest selection (no-op if it's already stored). */
  const run = useCallback((): Promise<boolean> => {
    queue.current = queue.current.then(async () => {
      const slots = latest.current;
      const key = toKey(slots);
      if (key === savedKey.current) {
        // Edited and then reverted before the save: nothing to send.
        setStatus((prev) => (prev === 'pending' ? (savedOnce.current ? 'saved' : 'idle') : prev));
        return true;
      }

      setStatus('saving');
      try {
        const data = await pollsApi.saveResponse(pollId, slots);
        savedKey.current = key;
        savedOnce.current = true;
        onSavedRef.current(data);
        // Changed again while saving → the scheduled save will pick it up.
        setStatus(toKey(latest.current) === key ? 'saved' : 'pending');
        return true;
      } catch {
        setStatus('error');
        haptics.error();
        return false;
      }
    });
    return queue.current;
  }, [pollId, haptics]);

  const flush = useCallback((): Promise<boolean> => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    return run();
  }, [run]);

  // `selected` keeps its identity until its content changes (see useSlotSelection).
  useEffect(() => {
    latest.current = [...selected];
    if (toKey(selected) === savedKey.current) return;

    setStatus('pending');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      void run();
    }, DEBOUNCE_MS);
  }, [selected, run]);

  // App goes to background (or the page unloads): save right away.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') void flush();
    };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [flush]);

  // Unsaved changes → Telegram asks "close anyway?" instead of silently losing them.
  const hasUnsaved = status === 'pending' || status === 'saving' || status === 'error';
  useEffect(() => {
    if (!webApp?.isVersionAtLeast('6.2')) return;
    if (hasUnsaved) webApp.enableClosingConfirmation();
    else webApp.disableClosingConfirmation();
  }, [webApp, hasUnsaved]);

  return { status, flush };
};
