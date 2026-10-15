-- Optional video call link (Meet, Zoom, Teams…) set together with the scheduled time.
alter table public.polls
  add column if not exists meeting_url text;

alter table public.polls drop constraint if exists polls_meeting_url_check;
alter table public.polls
  add constraint polls_meeting_url_check check (
    meeting_url is null
    or (
      scheduled_start is not null
      and meeting_url ~ '^https://'
      and char_length(meeting_url) <= 500
    )
  );
