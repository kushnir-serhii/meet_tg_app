'use client';

import { useCallback, useState } from 'react';

import { hasEnded } from '@/domain/pastTime';
import { findRangeWithSlot } from '@/domain/ranges';
import { getListedRanges } from '@/domain/results';
import type { PollResults } from '@/domain/types';

import { useI18n } from './useI18n';

export type SlotAction = 'locate' | 'add';

const addMinutes = (iso: string, minutes: number): string =>
  new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();

type SlotActionOptions = {
  results: PollResults;
  slotMinutes: number;
  /** Scroll the options list to the range with this slot. */
  onLocate?: (slot: string) => void;
  /** Organizer: add an unlisted, not yet ended slot to the options. */
  onAdd?: (slot: string) => void;
};

/** What a heatmap click (desktop) or double tap (phone) does to a slot, if anything. */
export const useSlotAction = ({ results, slotMinutes, onLocate, onAdd }: SlotActionOptions) => {
  const { t } = useI18n();
  const [now] = useState(() => new Date());
  const listed = getListedRanges(results);

  const actionFor = useCallback(
    (slot: string): SlotAction | null => {
      if (onLocate && findRangeWithSlot(listed, slot)) return 'locate';
      const ended = hasEnded({ start: slot, end: addMinutes(slot, slotMinutes) }, now);
      return onAdd && !ended ? 'add' : null;
    },
    [listed, onLocate, onAdd, slotMinutes, now],
  );

  const act = useCallback(
    (slot: string) => {
      const action = actionFor(slot);
      if (action === 'locate') onLocate?.(slot);
      if (action === 'add') onAdd?.(slot);
    },
    [actionFor, onLocate, onAdd],
  );

  /** Card footnote telling how to locate or add the slot (click on desktop, double tap on phone). */
  const hintFor = (slot: string, canHover: boolean): string | undefined => {
    const action = actionFor(slot);
    if (!action) return undefined;
    if (action === 'locate') return canHover ? t.results.locateClick : t.results.locateDoubleTap;
    return canHover ? t.results.addClick : t.results.addDoubleTap;
  };

  return { actionFor, act, hintFor };
};
