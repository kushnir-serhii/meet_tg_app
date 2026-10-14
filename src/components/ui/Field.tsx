import { type ReactNode, useId } from 'react';

import { cx } from '@/utils/cx';

import styles from './ui.module.css';

type FieldProps = {
  label: string;
  /** Shown under the control; also marks the control as invalid. */
  error?: string;
  children: (id: string, className: string) => ReactNode;
};

/** Label + control (+ error). The render prop receives the input id and shared input class. */
export const Field = ({ label, error, children }: FieldProps) => {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children(id, cx(styles.input, error && styles.inputInvalid))}
      {error && (
        <span className={styles.fieldError} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export const FieldRow = ({ children }: { children: ReactNode }) => (
  <div className={styles.row}>{children}</div>
);
