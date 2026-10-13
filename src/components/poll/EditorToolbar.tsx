'use client';

import { useI18n } from '@/hooks/useI18n';
import { cx } from '@/utils/cx';

import styles from './poll.module.css';

type EditorToolbarProps = {
  count: number;
  canUndo: boolean;
  onClear: () => void;
  onUndo: () => void;
};

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UndoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** "Selected: N" + clear-all (with undo instead of a confirm dialog). */
export const EditorToolbar = ({ count, canUndo, onClear, onUndo }: EditorToolbarProps) => {
  const { t } = useI18n();
  let statusText = t.poll.nothingSelected;
  if (canUndo) statusText = t.poll.cleared;
  else if (count > 0) statusText = t.poll.selectedCount(count);

  return (
    <div className={styles.toolbar}>
      <span className={styles.counter} aria-live="polite">
        {statusText}
      </span>
      {canUndo ? (
        <button type="button" className={styles.toolButton} onClick={onUndo}>
          <UndoIcon />
          {t.poll.undo}
        </button>
      ) : (
        count > 0 && (
          <button
            type="button"
            className={cx(styles.toolButton, styles.toolButtonDanger)}
            onClick={onClear}
          >
            <ClearIcon />
            {t.poll.clearAll}
          </button>
        )
      )}
    </div>
  );
};
