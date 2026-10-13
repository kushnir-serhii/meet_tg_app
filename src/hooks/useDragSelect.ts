'use client';

import { type PointerEvent, useCallback, useRef } from 'react';

const SLOT_ATTR = 'data-slot';

const slotFromPoint = (x: number, y: number): string | null =>
  document.elementFromPoint(x, y)?.closest(`[${SLOT_ATTR}]`)?.getAttribute(SLOT_ATTR) ?? null;

type Options = {
  isSelected: (slot: string) => boolean;
  setSlot: (slot: string, value: boolean) => void;
  onChange?: () => void;
  /** `false` = eraser: every touched cell is cleared. Otherwise the first cell decides. */
  erase?: boolean;
};

/**
 * "Paint" selection by dragging over cells marked with `data-slot`.
 * The first touched cell decides whether the drag selects or clears (unless `erase` is on).
 */
export const useDragSelect = ({ isSelected, setSlot, onChange, erase = false }: Options) => {
  const mode = useRef<boolean | null>(null);
  const lastSlot = useRef<string | null>(null);

  const paint = useCallback(
    (slot: string | null) => {
      if (slot === null || mode.current === null || slot === lastSlot.current) return;
      lastSlot.current = slot;
      setSlot(slot, mode.current);
      onChange?.();
    },
    [setSlot, onChange],
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const slot = slotFromPoint(event.clientX, event.clientY);
      if (slot === null) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      mode.current = erase ? false : !isSelected(slot);
      paint(slot);
    },
    [isSelected, paint, erase],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      paint(slotFromPoint(event.clientX, event.clientY));
    },
    [paint],
  );

  const stop = useCallback(() => {
    mode.current = null;
    lastSlot.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp: stop, onPointerCancel: stop };
};
