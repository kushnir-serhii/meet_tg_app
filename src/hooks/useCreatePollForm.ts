'use client';

import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { datesInRange, MAX_POLL_DAYS } from '@/domain/dates';
import { fitHourRange } from '@/domain/slots';
import type { SlotMinutes } from '@/domain/types';
import { type CreatePollInput, createPollSchema } from '@/domain/validation';

export type CreatePollFormValues = {
  title: string;
  dateFrom: string;
  dateTo: string;
  hourFrom: number;
  hourTo: number;
  slotMinutes: SlotMinutes;
  expectedCount: string;
};

const today = () => format(new Date(), 'yyyy-MM-dd');

const initialValues = (): CreatePollFormValues => ({
  title: '',
  dateFrom: today(),
  dateTo: format(addDays(new Date(), 6), 'yyyy-MM-dd'),
  hourFrom: 9,
  hourTo: 21,
  slotMinutes: 60,
  expectedCount: '',
});

/** Keeps the end date within [from, from + MAX_POLL_DAYS - 1], preserving the span when possible. */
const fitDateRange = (prevFrom: string, from: string, to: string): string => {
  const latest = format(addDays(parseISO(from), MAX_POLL_DAYS - 1), 'yyyy-MM-dd');
  if (to >= from && to <= latest) return to;
  const span = Math.max(0, differenceInCalendarDays(parseISO(to), parseISO(prevFrom)));
  return format(addDays(parseISO(from), Math.min(span, MAX_POLL_DAYS - 1)), 'yyyy-MM-dd');
};

const toInput = (values: CreatePollFormValues): unknown => ({
  title: values.title,
  dates: datesInRange(values.dateFrom, values.dateTo),
  hourFrom: values.hourFrom,
  hourTo: values.hourTo,
  slotMinutes: values.slotMinutes,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  expectedCount: values.expectedCount ? Number(values.expectedCount) : null,
});

/** Form state + validation; returns parsed input only when valid, plus invalid fields. */
export const useCreatePollForm = () => {
  const [values, setValues] = useState(initialValues);

  const setField = useCallback(
    <K extends keyof CreatePollFormValues>(key: K, value: CreatePollFormValues[K]) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        next.dateTo = fitDateRange(prev.dateFrom, next.dateFrom, next.dateTo);
        return { ...next, ...fitHourRange(next.hourFrom, next.hourTo, next.slotMinutes) };
      });
    },
    [],
  );

  const parsed = useMemo(() => createPollSchema.safeParse(toInput(values)), [values]);
  const input: CreatePollInput | null = parsed.success ? parsed.data : null;
  /** Fields the user can fix (dates/hours are always kept valid by `setField`). */
  const invalid = useMemo(() => {
    const paths = new Set(parsed.error?.issues.map((issue) => issue.path[0]));
    return { title: paths.has('title'), expectedCount: paths.has('expectedCount') };
  }, [parsed]);

  return { values, setField, input, invalid, minDate: today() };
};
