'use client';

import { format, parseISO } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

import { cx } from '@/utils/cx';

import styles from './datePicker.module.css';
import { DatePickerPanel } from './DatePickerPanel';

type DatePickerProps = {
  id: string;
  className: string;
  /** `YYYY-MM-DD` */
  value: string;
  min: string;
  max?: string;
  /** Which edge the popover aligns to (right for the right-hand field). */
  align?: 'left' | 'right';
  onChange: (value: string) => void;
};

/** Custom date picker: no past years, any month, future years via the year select. */
export const DatePicker = ({
  id,
  className,
  value,
  min,
  max,
  align = 'left',
  onChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        id={id}
        type="button"
        className={cx(className, styles.trigger)}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        {format(parseISO(value), 'dd.MM.yyyy')}
        <span className={styles.icon} aria-hidden>
          📅
        </span>
      </button>
      {open && (
        <DatePickerPanel
          className={cx(styles.popover, align === 'right' && styles.popoverRight)}
          value={value}
          min={min}
          max={max}
          onSelect={(day) => {
            onChange(day);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};
