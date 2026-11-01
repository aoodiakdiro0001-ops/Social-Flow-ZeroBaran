-- =====================================================================
-- Social-Flow ZeroBaran  ·  Supabase Schema
-- The intelligent self-operating system for social media management.
-- Run in Supabase SQL Editor to provision the production database.
-- =====================================================================

-- Enable extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- POSTS  ·  The publishing queue (mirrors Prisma `Post` model)
-- ---------------------------------------------------------------------
create table if not exists posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  content         text not null,
  platforms       jsonb default '[]'::jsonb,            -- ["telegram","x","linkedin","facebook"]
  status          text not null default 'PENDING'         -- PENDING | PUBLISHED | FAILED | CANCELLED
                  check (status in ('PENDING','PUBLISHED','FAILED','CANCELLED')),
  scheduled_at    timestamptz not null,
  published_at    timestamptz,
  enhanced_content text,                                   -- AI-enhanced version (from Gemini)
  hashtags        jsonb default '[]'::jsonb,              -- ["#BuildInPublic", ...]
  media_urls      jsonb default '[]'::jsonb,
  source          text not null default 'telegram',       -- telegram | dashboard | api
  author_handle   text,
  impressions     integer default 0,
  likes           integer default 0,
  shares          integer default 0,
  comments        integer default 0,
  clicks          integer default 0,
  error_message   text,                                    -- populated on FAILED
  retry_count     integer default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Indexes for the runner's hot path:
-- SELECT … WHERE status='PENDING' AND scheduled_at <= now() ORDER BY scheduled_at;
create index if not exists posts_status_scheduled_idx
  on posts (status, scheduled_at);
create index if not exists posts_published_at_idx
  on posts (published_at desc);
create index if not exists posts_platforms_idx
  on posts using gin (platforms);

-- ---------------------------------------------------------------------
-- PLATFORMS  ·  Per-platform connection / health state
-- ---------------------------------------------------------------------
create table if not exists platforms (
  id            uuid primary key default gen_random_uuid(),
  name          text unique not null,        -- telegram | x | linkedin | facebook | instagram
  display_name  text not null,
  icon          text,
  connected     boolean default false,
  health        text default 'ok'            -- ok | degraded | down
                check (health in ('ok','degraded','down')),
  posts_count   integer default 0,
  followers     integer default 0,
  last_sync_at  timestamptz,
  metadata      jsonb default '{}'::jsonb,   -- API tokens (encrypted at app layer), etc.
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

insert into platforms (name, display_name, icon) values
  ('telegram','Telegram','telegram'),
  ('x','X / Twitter','x'),
  ('linkedin','LinkedIn','linkedin'),
  ('facebook','Facebook','facebook'),
  ('instagram','Instagram','instagram')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------
-- ANALYTICS_EVENTS  ·  Per-post engagement snapshots over time
-- ---------------------------------------------------------------------
create table if not exists analytics_events (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references posts(id) on delete cascade,
  impressions   integer default 0,
  likes         integer default 0,
  shares        integer default 0,
  comments      integer default 0,
  clicks        integer default 0,
  captured_at   timestamptz not null default now()
);
create index if not exists analytics_events_post_idx on analytics_events (post_id);
create index if not exists analytics_events_captured_idx on analytics_events (captured_at desc);

-- ---------------------------------------------------------------------
-- ACTIVITY_LOG  ·  System audit trail (publish events, AI calls, errors)
-- ---------------------------------------------------------------------
create table if not exists activity_log (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid references posts(id) on delete set null,
  type        text not null,    -- post_scheduled | post_published | post_failed | ai_enhanced | platform_sync | system_event
  message     text not null,
  level       text not null default 'info'  -- info | success | warning | error
              check (level in ('info','success','warning','error')),
  metadata    jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists activity_log_type_idx on activity_log (type, created_at desc);
create index if not exists activity_log_post_idx on activity_log (post_id);

-- ---------------------------------------------------------------------
-- DAILY_STATS  ·  Aggregated per-day metrics for dashboard charts
-- ---------------------------------------------------------------------
create table if not exists daily_stats (
  date              date primary key,
  posts_published   integer default 0,
  posts_failed      integer default 0,
  total_reach       integer default 0,
  total_engagement  integer default 0,
  ai_enhancements   integer default 0,
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- FUNCTIONS  ·  The runner's hot path
-- ---------------------------------------------------------------------

-- Returns posts that are PENDING and due now (or overdue). Called by the
-- GitHub Actions runner every 5 minutes.
create or replace function fetch_due_posts(p_limit int default 50)
returns setof posts
language sql
security definer
as $$
  select *
  from posts
  where status = 'PENDING'
    and scheduled_at <= now()
  order by scheduled_at asc
  limit p_limit;
$$;

-- Atomically marks a post as PUBLISHED and writes an activity log entry.
create or replace function mark_post_published(p_post_id uuid, p_impressions int default 0, p_likes int default 0, p_shares int default 0, p_comments int default 0, p_clicks int default 0)
returns void
language plpgsql
security definer
as $$
begin
  update posts
     set status      = 'PUBLISHED',
         published_at = now(),
         impressions = p_impressions,
         likes       = p_likes,
         shares      = p_shares,
         comments    = p_comments,
         clicks      = p_clicks,
         updated_at  = now()
   where id = p_post_id;

  insert into activity_log (post_id, type, message, level)
  values (p_post_id, 'post_published', 'Published to platforms', 'success');

  insert into analytics_events (post_id, impressions, likes, shares, comments, clicks)
  values (p_post_id, p_impressions, p_likes, p_shares, p_comments, p_clicks);
end;
$$;

-- Marks a post as FAILED with an error message and bumps retry_count.
create or replace function mark_post_failed(p_post_id uuid, p_error text)
returns void
language plpgsql
security definer
as $$
begin
  update posts
     set status        = 'FAILED',
         error_message = p_error,
         retry_count   = retry_count + 1,
         updated_at    = now()
   where id = p_post_id;

  insert into activity_log (post_id, type, message, level)
  values (p_post_id, 'post_failed', p_error, 'warning');
end;
$$;

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY  ·  Only your service role can write; reads are
-- open to authenticated dashboard users.
-- ---------------------------------------------------------------------
alter table posts             enable row level security;
alter table platforms         enable row level security;
alter table analytics_events  enable row level security;
alter table activity_log      enable row level security;
alter table daily_stats       enable row level security;

-- Service role bypasses RLS by default. For dashboard users:
create policy "Authenticated can read posts"
  on posts for select to authenticated using (true);

create policy "Authenticated can read platforms"
  on platforms for select to authenticated using (true);

create policy "Authenticated can read analytics"
  on analytics_events for select to authenticated using (true);

create policy "Authenticated can read activity"
  on activity_log for select to authenticated using (true);

create policy "Authenticated can read daily stats"
  on daily_stats for select to authenticated using (true);

-- ---------------------------------------------------------------------
-- TRIGGERS  ·  Auto-update updated_at on every row change
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in select unnest(array['posts','platforms','daily_stats']) loop
    execute format('drop trigger if exists set_updated_at_%I on %I;', t, t);
    execute format('create trigger set_updated_at_%I before update on %I for each row execute function set_updated_at();', t, t);
  end loop;
end$$;

-- =====================================================================
-- Done. Verify with:
--   select * from platforms;
--   select * from fetch_due_posts(10);
-- =====================================================================
