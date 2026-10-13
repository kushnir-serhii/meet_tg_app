import { z } from 'zod';

import { isValidTimezone, MAX_POLL_DAYS } from './dates';
import { isTipAmount } from './tips';
import { SLOT_MINUTES, type SlotMinutes } from './types';

const isSlotMinutes = (value: number): value is SlotMinutes =>
  (SLOT_MINUTES as readonly number[]).includes(value);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const createPollSchema = z
  .object({
    title: z.string().trim().min(1).max(80),
    dates: z
      .array(isoDate)
      .min(1)
      .max(MAX_POLL_DAYS)
      .transform((dates) => [...new Set(dates)].sort()),
    hourFrom: z.number().int().min(0).max(23),
    hourTo: z.number().int().min(1).max(24),
    slotMinutes: z.number().refine(isSlotMinutes, 'Unsupported slot size'),
    timezone: z.string().refine(isValidTimezone, 'Unknown timezone'),
    expectedCount: z.number().int().min(2).max(200).nullable().default(null),
  })
  .refine((data) => (data.hourTo - data.hourFrom) * 60 >= data.slotMinutes, {
    message: 'The hour range must fit at least one slot',
    path: ['hourTo'],
  });

export type CreatePollInput = z.infer<typeof createPollSchema>;

export const saveResponseSchema = z.object({
  slots: z.array(z.iso.datetime({ offset: true })).max(MAX_POLL_DAYS * 48),
});

export type SaveResponseInput = z.infer<typeof saveResponseSchema>;

export const createTipSchema = z.object({
  amount: z.number().int().refine(isTipAmount, 'Unsupported tip amount'),
});

/** `range: null` clears the scheduled time. */
export const schedulePollSchema = z.object({
  range: z
    .object({ start: z.iso.datetime({ offset: true }), end: z.iso.datetime({ offset: true }) })
    .nullable(),
});
