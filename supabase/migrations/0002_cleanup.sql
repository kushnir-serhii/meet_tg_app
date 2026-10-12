-- Auto-cleanup of finished meetings (runs daily via pg_cron).
-- A poll is removed 7 days after its last date, or 60 days after creation.
-- Responses and chat message links are removed by ON DELETE CASCADE.

create extension if not exists pg_cron;

create or replace function public.cleanup_old_polls()
returns integer
language sql
security definer
set search_path = public
as $$
  with deleted as (
    delete from public.polls p
    where (select max(d) from unnest(p.dates) as d) < current_date - 7
       or p.created_at < now() - interval '60 days'
    returning 1
  )
  select count(*)::integer from deleted;
$$;

revoke all on function public.cleanup_old_polls() from public, anon, authenticated;

-- Every day at 03:00 UTC. Re-running this file updates the existing job.
select cron.schedule('cleanup-old-polls', '0 3 * * *', $$select public.cleanup_old_polls()$$);
