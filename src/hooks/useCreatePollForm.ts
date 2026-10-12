'use client';

import { addDays, format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { datesInRange } from '@/domain/dates';
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

const toInput = (values: CreatePollFormValues): unknown => ({
  title: values.title,
  dates: datesInRange(values.dateFrom, values.dateTo),
  hourFrom: values.hourFrom,
  hourTo: values.hourTo,
  slotMinutes: values.slotMinutes,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  expectedCount: values.expectedCount ? Number(values.expectedCount) : null,
});

/** Form state + validation; returns parsed input only when valid. */
export const useCreatePollForm = () => {
  const [values, setValues] = useState(initialValues);

  const setField = useCallback(
    <K extends keyof CreatePollFormValues>(key: K, value: CreatePollFormValues[K]) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        return { ...next, ...fitHourRange(next.hourFrom, next.hourTo, next.slotMinutes) };
      });
    },
    [],
  );

  const parsed = useMemo(() => createPollSchema.safeParse(toInput(values)), [values]);
  const input: CreatePollInput | null = parsed.success ? parsed.data : null;

  return { values, setField, input, minDate: today() };
};
