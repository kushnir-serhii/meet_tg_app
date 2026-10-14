'use client';

import { useCallback, useMemo, useState } from 'react';

const sameSet = (a: ReadonlySet<string>, b: ReadonlySet<string>): boolean =>
  a.size === b.size && [...a].every((value) => b.has(value));

/** Selected slot ids + dirty tracking against the last saved value + undoable "clear all". */
export const useSlotSelection = (initial: readonly string[]) => {
  const [saved, setSaved] = useState<ReadonlySet<string>>(() => new Set(initial));
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

  const markSaved = useCallback((slots: readonly string[]) => {
    const next = new Set(slots);
    setSaved(next);
    setSelected(next);
    setBeforeClear(null);
  }, []);

  /** Drop unsaved edits: back to the last saved selection. */
  const reset = useCallback(() => {
    setSelected(saved);
    setBeforeClear(null);
  }, [saved]);

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

  const isDirty = useMemo(() => !sameSet(saved, selected), [saved, selected]);

  return {
    selected,
    setSlot,
    markSaved,
    reset,
    clear,
    undoClear,
    canUndoClear: beforeClear !== null,
    isDirty,
  };
};
