-- Allow 2, 3 and 4 hour slots.
alter table public.polls drop constraint if exists polls_slot_minutes_check;
alter table public.polls
  add constraint polls_slot_minutes_check check (slot_minutes in (30, 60, 120, 180, 240));
