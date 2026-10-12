import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';

export const MAX_POLL_DAYS = 14;

/** Inclusive list of `YYYY-MM-DD` between two dates (capped). */
export const datesInRange = (from: string, to: string, max = MAX_POLL_DAYS): string[] => {
  const start = parseISO(from);
  const length = Math.min(differenceInCalendarDays(parseISO(to), start) + 1, max);
  return Array.from({ length: Math.max(length, 0) }, (_, index) =>
    format(addDays(start, index), 'yyyy-MM-dd'),
  );
};

export const isValidTimezone = (timezone: string): boolean => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};
