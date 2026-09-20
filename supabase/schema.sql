-- Run once in Supabase SQL Editor. No public read/write policies are created.
create extension if not exists pgcrypto;
create table if not exists public.campaign_submissions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  reference_number text not null unique,
  submission_type text not null check (submission_type in ('inquiry','issue','invitation')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (phone ~ '^\+?[0-9]{8,15}$'),
  email text,
  location text not null,
  pdm text,
  payload jsonb not null default '{}'::jsonb,
  consent boolean not null check (consent = true),
  consent_version text not null,
  status text not null default 'new' check (status in ('new','in_progress','closed')),
  notification_status text not null default 'pending' check (notification_status in ('pending','sent','failed')),
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
alter table public.campaign_submissions enable row level security;
revoke all on public.campaign_submissions from anon, authenticated;
grant select, insert, update, delete on public.campaign_submissions to service_role;
create index if not exists submissions_created on public.campaign_submissions(created_at desc);
create index if not exists submissions_notifications on public.campaign_submissions(notification_status, created_at);

-- Persistent, atomic rate limit across all Vercel instances: 5 attempts / 15 minutes.
-- Only a daily rotating HMAC identifier is stored, never a raw IP address.
create table if not exists public.submission_rate_limits (
  key_hash text primary key,
  window_start timestamptz not null default now(),
  attempts integer not null default 1
);
alter table public.submission_rate_limits enable row level security;
revoke all on public.submission_rate_limits from anon, authenticated;
grant all on public.submission_rate_limits to service_role;

create or replace function public.consume_submission_rate(p_key text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  if p_key !~ '^[a-f0-9]{64}$' then return false; end if;
  insert into public.submission_rate_limits as r(key_hash, window_start, attempts)
  values(p_key, now(), 1)
  on conflict(key_hash) do update set
    attempts = case when r.window_start < now() - interval '15 minutes' then 1 else r.attempts + 1 end,
    window_start = case when r.window_start < now() - interval '15 minutes' then now() else r.window_start end
  returning attempts into n;
  return n <= 5;
end;
$$;
revoke all on function public.consume_submission_rate(text) from public, anon, authenticated;
grant execute on function public.consume_submission_rate(text) to service_role;

create or replace function public.cleanup_submission_rate()
returns void language sql security definer set search_path = '' as $$
  delete from public.submission_rate_limits where window_start < now() - interval '24 hours';
$$;
revoke all on function public.cleanup_submission_rate() from public, anon, authenticated;
grant execute on function public.cleanup_submission_rate() to service_role;

-- Run the protected /api/notifications/retry job daily (see vercel.json).
-- Operational privacy retention: review closed_at and remove/anonymize records
-- within 12 months after closure. Do not export personal data into public files.
