import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { cx } from '@/utils/cx';

import styles from './ui.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button = ({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cx(styles.button, variant === 'secondary' && styles.secondary, className)}
    {...props}
  />
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
