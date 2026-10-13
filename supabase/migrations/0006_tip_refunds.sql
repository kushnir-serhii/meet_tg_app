-- Set by `npm run refund` after a successful refundStarPayment.
alter table public.tips add column if not exists refunded_at timestamptz;
