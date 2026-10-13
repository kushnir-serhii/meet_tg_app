-- Meeting time chosen by the organizer (null = not scheduled yet).
alter table public.polls
  add column if not exists scheduled_start timestamptz,
  add column if not exists scheduled_end timestamptz;

alter table public.polls drop constraint if exists polls_scheduled_check;
alter table public.polls
  add constraint polls_scheduled_check check (
    (scheduled_start is null and scheduled_end is null)
    or (scheduled_start is not null and scheduled_end > scheduled_start)
  );
