import { z } from 'zod';

import { isValidTimezone, MAX_POLL_DAYS } from './dates';

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
    slotMinutes: z.union([z.literal(30), z.literal(60)]),
    timezone: z.string().refine(isValidTimezone, 'Unknown timezone'),
    expectedCount: z.number().int().min(2).max(200).nullable().default(null),
  })
  .refine((data) => data.hourTo > data.hourFrom, {
    message: 'hourTo must be greater than hourFrom',
    path: ['hourTo'],
  });

export type CreatePollInput = z.infer<typeof createPollSchema>;

export const saveResponseSchema = z.object({
  slots: z.array(z.iso.datetime({ offset: true })).max(MAX_POLL_DAYS * 48),
});

export type SaveResponseInput = z.infer<typeof saveResponseSchema>;
