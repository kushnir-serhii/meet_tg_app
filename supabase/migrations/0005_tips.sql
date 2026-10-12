-- Telegram Stars tips. One row per successful payment.
create table public.tips (
  id                          bigint generated always as identity primary key,
  user_id                     bigint      not null,
  amount                      integer     not null check (amount > 0),
  telegram_payment_charge_id  text        not null unique,
  created_at                  timestamptz not null default now()
);

create index tips_user_idx on public.tips (user_id);

alter table public.tips enable row level security;
