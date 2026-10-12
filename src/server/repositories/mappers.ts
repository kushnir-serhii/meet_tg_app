import { normalizeSlotId } from '@/domain/slots';
import type { Poll, PollResponse, SlotMinutes } from '@/domain/types';
import { DEFAULT_LOCALE, isLocale } from '@/i18n';

import type { Tables } from '../db/database.types';

export const toPoll = (row: Tables<'polls'>): Poll => ({
  id: row.id,
  title: row.title,
  creatorId: row.creator_id,
  creatorName: row.creator_name,
  dates: [...row.dates].sort(),
  hourFrom: row.hour_from,
  hourTo: row.hour_to,
  slotMinutes: row.slot_minutes as SlotMinutes,
  timezone: row.timezone,
  expectedCount: row.expected_count,
  locale: isLocale(row.locale) ? row.locale : DEFAULT_LOCALE,
  createdAt: row.created_at,
});

export const toPollResponse = (row: Tables<'responses'>): PollResponse => ({
  userId: row.user_id,
  name: row.name,
  username: row.username,
  slots: row.slots.map(normalizeSlotId),
  updatedAt: row.updated_at,
});
