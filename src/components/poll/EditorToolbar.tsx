'use client';

import { useI18n } from '@/hooks/useI18n';
import { cx } from '@/utils/cx';

import styles from './poll.module.css';

type EditorToolbarProps = {
  erase: boolean;
  onEraseChange: (erase: boolean) => void;
  canClear: boolean;
  onClear: () => void;
};

/** Mark / erase switch for drag-painting + "clear all". */
export const EditorToolbar = ({ erase, onEraseChange, canClear, onClear }: EditorToolbarProps) => {
  const { t } = useI18n();
  const modes = [
    { value: false, label: t.poll.modeSelect },
    { value: true, label: t.poll.modeErase },
  ];

  return (
    <div className={styles.toolbar}>
      <div className={styles.segmented} role="radiogroup">
        {modes.map(({ value, label }) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={erase === value}
            className={cx(styles.segment, erase === value && styles.segmentActive)}
            onClick={() => {
              onEraseChange(value);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <button type="button" className={styles.clearButton} disabled={!canClear} onClick={onClear}>
        {t.poll.clearAll}
      </button>
    </div>
  );
};
