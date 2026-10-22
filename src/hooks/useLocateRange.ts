'use client';

import { useEffect, useRef, useState } from 'react';

import { findRangeWithSlot } from '@/domain/ranges';
import type { SlotRange } from '@/domain/types';

/** "Show this heatmap slot in the list"; `seq` makes repeated requests for one slot distinct. */
export type LocateRequest = { slot: string; seq: number };

/**
 * Scrolls a results list to the range containing the requested slot and flashes it.
 * Items must carry `data-range={range.start}`; `reveal` expands the list if the range is hidden.
 */
export const useLocateRange = <T extends SlotRange, E extends HTMLElement = HTMLDivElement>(
  ranges: T[],
  request: LocateRequest | null,
  reveal: (range: T) => void,
) => {
  const listRef = useRef<E>(null);
  const [handled, setHandled] = useState<LocateRequest | null>(null);
  const [flashedSeq, setFlashedSeq] = useState<number | null>(null);
  const target = handled ? findRangeWithSlot(ranges, handled.slot) : undefined;

  // A new request: reveal its range in this same render (React's "adjust state on prop change").
  if (request !== handled) {
    setHandled(request);
    const range = request ? findRangeWithSlot(ranges, request.slot) : undefined;
    if (range) reveal(range);
  }

  const targetStart = target?.start;
  const seq = handled?.seq;
  useEffect(() => {
    if (!targetStart) return;
    listRef.current
      ?.querySelector(`[data-range="${targetStart}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [targetStart, seq]);

  return {
    listRef,
    /** Start of the range to flash, until its animation ends. */
    highlightedStart: target && seq !== flashedSeq ? target.start : null,
    onFlashEnd: () => {
      setFlashedSeq(seq ?? null);
    },
  };
};
