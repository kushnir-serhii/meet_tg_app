'use client';

import { addMonths, format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';

import { isDayInRange, isMonthInRange, monthCells, selectableYears } from '@/domain/calendarMonth';
import { useI18n } from '@/hooks/useI18n';
import { cx } from '@/utils/cx';

import uiStyles from '../ui.module.css';
import styles from './datePicker.module.css';

type DatePickerPanelProps = {
  className: string;
  value: string;
  min: string;
  max?: string;
  onSelect: (day: string) => void;
};

const useLocalizedNames = (locale: string) =>
  useMemo(() => {
    const month = new Intl.DateTimeFormat(locale, { month: 'long' });
    const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    return {
      months: Array.from({ length: 12 }, (_, m) => month.format(new Date(2026, m, 1))),
      // 2026-01-05 is a Monday.
      weekdays: Array.from({ length: 7 }, (_, d) => weekday.format(new Date(2026, 0, 5 + d))),
    };
  }, [locale]);

export const DatePickerPanel = ({ className, value, min, max, onSelect }: DatePickerPanelProps) => {
  const { locale } = useI18n();
  const names = useLocalizedNames(locale);
  const [view, setView] = useState(() => {
    const date = parseISO(value);
    return { year: date.getFullYear(), month: date.getMonth() };
  });
  const years = selectableYears(min, max);
  const today = format(new Date(), 'yyyy-MM-dd');

  const monthAt = (delta: number) => {
    const date = addMonths(new Date(view.year, view.month, 1), delta);
    return { year: date.getFullYear(), month: date.getMonth() };
  };
  const canGo = (delta: number) => {
    const target = monthAt(delta);
    return years.includes(target.year) && isMonthInRange(target.year, target.month, min, max);
  };
  const canPrev = canGo(-1);
  const canNext = canGo(1);

  /** Jump to a year; if that month is out of range there, snap to the nearest allowed one. */
  const changeYear = (year: number) => {
    if (isMonthInRange(year, view.month, min, max)) {
      setView({ year, month: view.month });
      return;
    }
    const edge = year <= parseISO(min).getFullYear() ? min : (max ?? min);
    setView({ year, month: parseISO(edge).getMonth() });
  };

  return (
    <div className={className} role="dialog">
      <div className={styles.header}>
        <button
          type="button"
          className={styles.nav}
          disabled={!canPrev}
          aria-label="Previous month"
          onClick={() => {
            setView(monthAt(-1));
          }}
        >
          ‹
        </button>
        <select
          className={cx(uiStyles.input, styles.select)}
          value={view.month}
          onChange={(e) => {
            setView({ year: view.year, month: Number(e.target.value) });
          }}
        >
          {names.months.map((name, month) => (
            <option key={name} value={month} disabled={!isMonthInRange(view.year, month, min, max)}>
              {name}
            </option>
          ))}
        </select>
        <select
          className={cx(uiStyles.input, styles.select, styles.yearSelect)}
          value={view.year}
          onChange={(e) => {
            changeYear(Number(e.target.value));
          }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={styles.nav}
          disabled={!canNext}
          aria-label="Next month"
          onClick={() => {
            setView(monthAt(1));
          }}
        >
          ›
        </button>
      </div>
      <div className={styles.grid}>
        {names.weekdays.map((name) => (
          <span key={name} className={styles.weekday}>
            {name}
          </span>
        ))}
        {monthCells(view.year, view.month).map((day, index) =>
          day ? (
            <button
              key={day}
              type="button"
              className={cx(
                styles.day,
                day === value && styles.daySelected,
                day === today && styles.dayToday,
              )}
              disabled={!isDayInRange(day, min, max)}
              onClick={() => {
                onSelect(day);
              }}
            >
              {Number(day.slice(8))}
            </button>
          ) : (
            <span key={`pad-${String(index)}`} />
          ),
        )}
      </div>
    </div>
  );
};
