'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { useBusyText } from '@/hooks/useBusyText';
import { cx } from '@/utils/cx';

import styles from './ui.module.css';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: 'primary' | 'secondary';
  children: string;
  /** Replaces the label with `loadingText` (default "Please wait…") and blocks clicks. */
  loading?: boolean;
  loadingText?: string;
};

export const Button = ({
  variant = 'primary',
  className,
  type = 'button',
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const label = useBusyText(children, loading, loadingText);
  return (
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
      {label}
    </button>
  );
};

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
