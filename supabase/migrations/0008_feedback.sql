-- User reviews / testimonials. One row per Telegram user; re-sending updates it.
create table public.feedback (
  user_id      bigint      primary key,
  name         text        not null,
  username     text,
  rating       smallint    not null check (rating between 1 and 5),
  text         text        not null default '' check (char_length(text) <= 500),
  can_publish  boolean     not null default false,
  locale       text        not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index feedback_publishable_idx on public.feedback (created_at desc) where can_publish;

alter table public.feedback enable row level security;
