'use client';

import { useCallback, useState } from 'react';

/**
 * Selected slot ids + undoable "clear all".
 * `selected` keeps its identity until its content changes (auto-save relies on it).
 */
export const useSlotSelection = (initial: readonly string[]) => {
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set(initial));
  /** Selection right before "clear all", until the user changes anything else. */
  const [beforeClear, setBeforeClear] = useState<ReadonlySet<string> | null>(null);

  const setSlot = useCallback((slot: string, value: boolean) => {
    setBeforeClear(null);
    setSelected((prev) => {
      if (prev.has(slot) === value) return prev;
      const next = new Set(prev);
      if (value) next.add(slot);
      else next.delete(slot);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    if (selected.size === 0) return;
    setBeforeClear(selected);
    setSelected(new Set());
  }, [selected]);

  const undoClear = useCallback(() => {
    if (!beforeClear) return;
    setSelected(beforeClear);
    setBeforeClear(null);
  }, [beforeClear]);

  return { selected, setSlot, clear, undoClear, canUndoClear: beforeClear !== null };
};
