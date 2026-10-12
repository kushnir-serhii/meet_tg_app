import type { ButtonHTMLAttributes } from 'react';

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
