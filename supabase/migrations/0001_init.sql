-- Meet TG App — initial schema
-- All access goes through the Next.js API with the service_role key,
-- so RLS is enabled with no policies (anon/authenticated get nothing).

create table public.polls (
  id             text primary key,
  title          text        not null check (char_length(title) between 1 and 80),
  creator_id     bigint      not null,
  creator_name   text        not null,
  dates          date[]      not null check (cardinality(dates) between 1 and 14),
  hour_from      smallint    not null check (hour_from between 0 and 23),
  hour_to        smallint    not null check (hour_to between 1 and 24 and hour_to > hour_from),
  slot_minutes   smallint    not null check (slot_minutes in (30, 60)),
  timezone       text        not null,
  expected_count smallint    check (expected_count between 2 and 200),
  created_at     timestamptz not null default now()
);

create index polls_creator_idx on public.polls (creator_id, created_at desc);

-- Where the poll was posted. One poll can live in many chats.
create table public.poll_messages (
  id                bigint generated always as identity primary key,
  poll_id           text        not null references public.polls (id) on delete cascade,
  source            text        not null check (source in ('inline', 'group')),
  inline_message_id text        unique,
  chat_id           bigint,
  message_id        integer,
  created_at        timestamptz not null default now(),
  constraint poll_messages_target_check check (
    (source = 'inline' and inline_message_id is not null)
    or (source = 'group' and chat_id is not null and message_id is not null)
  ),
  constraint poll_messages_group_unique unique (chat_id, message_id)
);

create index poll_messages_poll_idx on public.poll_messages (poll_id);

-- One row per participant; slots = UTC start times of the slots they can attend.
create table public.responses (
  poll_id    text        not null references public.polls (id) on delete cascade,
  user_id    bigint      not null,
  name       text        not null,
  username   text,
  slots      timestamptz[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (poll_id, user_id)
);

alter table public.polls         enable row level security;
alter table public.poll_messages enable row level security;
alter table public.responses     enable row level security;
