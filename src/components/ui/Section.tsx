import type { ReactNode } from 'react';

import styles from './ui.module.css';

type SectionProps = {
  title?: string;
  children: ReactNode;
};

export const Section = ({ title, children }: SectionProps) => (
  <section className={styles.section}>
    {title && <h2 className={styles.sectionTitle}>{title}</h2>}
    {children}
  </section>
);

export const Hint = ({ children }: { children: ReactNode }) => (
  <p className={styles.hint}>{children}</p>
);

export const ErrorText = ({ children }: { children: ReactNode }) => (
  <p className={styles.error} role="alert">
    {children}
  </p>
);
