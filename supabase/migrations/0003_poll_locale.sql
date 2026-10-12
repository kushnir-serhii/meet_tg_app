-- Organizer's language for chat messages (en / uk).
alter table public.polls
  add column if not exists locale text not null default 'en'
  check (locale in ('en', 'uk'));
