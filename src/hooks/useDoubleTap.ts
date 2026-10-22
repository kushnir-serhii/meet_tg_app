'use client';

import { useCallback, useEffect, useRef } from 'react';

/** Max gap between the two taps of a double tap. */
const DOUBLE_TAP_MS = 300;

type DoubleTapOptions = {
  onSingle: (key: string) => void;
  onDouble: (key: string) => void;
  /** Keys without a double-tap action fire `onSingle` at once instead of waiting. */
  hasDouble: (key: string) => boolean;
};

/** Tells a single tap from a double tap on the same key; returns the tap handler. */
export const useDoubleTap = ({ onSingle, onDouble, hasDouble }: DoubleTapOptions) => {
  const options = useRef({ onSingle, onDouble, hasDouble });
  const pending = useRef<{ key: string; timer: number } | null>(null);

  useEffect(() => {
    options.current = { onSingle, onDouble, hasDouble };
  });

  useEffect(
    () => () => {
      if (pending.current) window.clearTimeout(pending.current.timer);
    },
    [],
  );

  return useCallback((key: string) => {
    const { onSingle: single, onDouble: double, hasDouble: canDouble } = options.current;
    const last = pending.current;
    if (last) window.clearTimeout(last.timer);
    pending.current = null;

    if (last?.key === key) {
      double(key);
      return;
    }
    if (!canDouble(key)) {
      single(key);
      return;
    }
    pending.current = {
      key,
      timer: window.setTimeout(() => {
        pending.current = null;
        single(key);
      }, DOUBLE_TAP_MS),
    };
  }, []);
};
