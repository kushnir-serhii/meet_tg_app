import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { cx } from '@/utils/cx';

import styles from './ui.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  /** Shows a rotating spinner instead of the label (the button keeps its size) and blocks clicks. */
  loading?: boolean;
};

/** The only button in the app: inline actions and the bottom bar both render it. */
export const Button = ({
  variant = 'primary',
  className,
  type = 'button',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cx(
      styles.button,
      variant === 'secondary' && styles.secondary,
      loading && styles.loading,
      className,
    )}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...props}
  >
    <span className={styles.buttonLabel}>{children}</span>
    {loading && <span className={styles.buttonSpinner} aria-hidden="true" />}
  </button>
);

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'secondary';
};

/** Link that looks like a button. */
export const ButtonLink = ({ variant = 'primary', className, ...props }: ButtonLinkProps) => (
  <a
    className={cx(
      styles.button,
      styles.link,
      variant === 'secondary' && styles.secondary,
      className,
    )}
    {...props}
  />
);
