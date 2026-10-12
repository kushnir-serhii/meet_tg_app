import { type ReactNode, useId } from 'react';

import styles from './ui.module.css';

type FieldProps = {
  label: string;
  children: (id: string, className: string) => ReactNode;
};

/** Label + control. The render prop receives the input id and shared input class. */
export const Field = ({ label, children }: FieldProps) => {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children(id, styles.input ?? '')}
    </div>
  );
};

export const FieldRow = ({ children }: { children: ReactNode }) => (
  <div className={styles.row}>{children}</div>
);
