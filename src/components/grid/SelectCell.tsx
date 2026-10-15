import { memo } from 'react';

import { cx } from '@/utils/cx';

import styles from './grid.module.css';

/** `syncing` — waiting for / in the middle of a save; `failed` — the save didn't go through. */
export type UnsavedState = 'syncing' | 'failed';

type SelectCellProps = {
  slot: string;
  selected: boolean;
  /** Set when the cell differs from what is saved on the server. */
  unsaved?: UnsavedState | null;
};

/** Cell picked up by `useDragSelect` through `data-slot`. */
export const SelectCell = memo(function SelectCell({ slot, selected, unsaved }: SelectCellProps) {
  return (
    <div
      data-slot={slot}
      role="checkbox"
      aria-checked={selected}
      aria-label={slot}
      aria-busy={unsaved === 'syncing' ? true : undefined}
      className={cx(
        styles.cell,
        styles.selectable,
        selected && styles.selected,
        unsaved && !selected && styles.removed,
        unsaved === 'syncing' && styles.syncing,
        unsaved === 'failed' && styles.failed,
      )}
    />
  );
});
