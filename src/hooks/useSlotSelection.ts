'use client';

import { useCallback, useMemo, useState } from 'react';

const sameSet = (a: ReadonlySet<string>, b: ReadonlySet<string>): boolean =>
  a.size === b.size && [...a].every((value) => b.has(value));

/** Selected slot ids + dirty tracking against the last saved value. */
export const useSlotSelection = (initial: readonly string[]) => {
  const [saved, setSaved] = useState<ReadonlySet<string>>(() => new Set(initial));
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set(initial));

  const setSlot = useCallback((slot: string, value: boolean) => {
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
  }, []);

  const clear = useCallback(() => {
    setSelected((prev) => (prev.size === 0 ? prev : new Set()));
  }, []);

  const isDirty = useMemo(() => !sameSet(saved, selected), [saved, selected]);

  return { selected, setSlot, markSaved, clear, isDirty };
};
