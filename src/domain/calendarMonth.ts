import { addDays, endOfMonth, format, getDay, parseISO, startOfMonth } from 'date-fns';

export const YEARS_AHEAD = 5;

/** `YYYY-MM-DD` days of a month, padded with `null` so weeks start on Monday. */
export const monthCells = (year: number, month: number): (string | null)[] => {
  const first = startOfMonth(new Date(year, month, 1));
  const last = endOfMonth(first);
  const lead = (getDay(first) + 6) % 7;
  const days = Array.from({ length: last.getDate() }, (_, index) =>
    format(addDays(first, index), 'yyyy-MM-dd'),
  );
  return [...Array<null>(lead).fill(null), ...days];
};

const monthKey = (year: number, month: number): string =>
  `${year}-${String(month + 1).padStart(2, '0')}`;

/** Whether any day of the month falls inside [min, max] (ISO strings compare lexically). */
export const isMonthInRange = (year: number, month: number, min: string, max?: string): boolean => {
  const key = monthKey(year, month);
  return key >= min.slice(0, 7) && (!max || key <= max.slice(0, 7));
};

export const isDayInRange = (day: string, min: string, max?: string): boolean =>
  day >= min && (!max || day <= max);

/** Years selectable in the picker: from `min` year (no past years) forward. */
export const selectableYears = (min: string, max?: string): number[] => {
  const from = parseISO(min).getFullYear();
  const to = max ? parseISO(max).getFullYear() : from + YEARS_AHEAD;
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
};
