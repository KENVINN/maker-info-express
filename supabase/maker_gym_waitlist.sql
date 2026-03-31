create table if not exists public.maker_gym_waitlist (
  email text primary key,
  name text,
  wants_tester_access boolean not null default false,
  wants_launch_updates boolean not null default true,
  source text not null default 'makergym-landing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.maker_gym_waitlist enable row level security;

drop policy if exists "anon_can_insert_maker_gym_waitlist" on public.maker_gym_waitlist;
create policy "anon_can_insert_maker_gym_waitlist"
on public.maker_gym_waitlist
for insert
to anon, authenticated
with check (true);
