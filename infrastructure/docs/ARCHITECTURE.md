# Architecture — Social-Flow ZeroBaran

This document describes the four-layer architecture, data flow, and design
decisions behind ZeroBaran.

## Design principles

1. **Free by construction** — every component must run on a free tier indefinitely.
2. **Sovereign by design** — no data ever leaves your Supabase project except
   to platform APIs you explicitly authorized.
3. **Idempotent execution** — the runner can be triggered twice without
   double-posting. Each post moves through `PENDING → PUBLISHED` exactly once.
4. **Self-healing** — transient API failures trigger an automatic retry with
   exponential backoff (up to `MAX_RETRIES`).
5. **Observable** — every state change writes a row to `activity_log`.

## The four layers

### Layer 01 — Ingestion & Queue

**Tech**: Telegram Bot API + Supabase `posts` table.

**Why**: Telegram is the lowest-friction mobile control surface — the bot is
your universal inbox for content. You can send a draft from anywhere with
zero app installation overhead (the official Telegram app is already on
your phone).

**Data flow**: a `/schedule` command parses the multi-line payload and
inserts a row with `status=PENDING`. The row is now visible in the
dashboard and visible to the runner.

### Layer 02 — AI Enhancement Core

**Tech**: Google Gemini API (or Groq).

**Why**: Hook quality drives 60–80% of social CTR. ZeroBaran asks Gemini
to rewrite your draft in the voice of your top-3 historical posts (loaded
from Supabase) and to generate 3–5 relevant hashtags. The result is
written back to `posts.enhanced_content` and `posts.hashtags`.

**Opt-in**: enhancement only runs when you `/enhance <post_id>` — the
original draft is preserved as `posts.content`.

### Layer 03 — Execution & Runner

**Tech**: Python 3.12 + httpx, executed by GitHub Actions cron every 5 min.

**Why**: GitHub Actions gives you 2,000 free minutes per month — enough for
a 5-minute polling cadence (12 runs/hour × 24 × 30 = ~8,640 min/mo, well
within free limits if you batch runs).

**Idempotency**: the runner calls `fetch_due_posts()` SQL function, which
returns rows where `status='PENDING' AND scheduled_at <= now()`. After
publishing, it calls `mark_post_published()` which atomically moves the
status to `PUBLISHED` and writes an `analytics_events` row.

**Failure handling**: if every platform returns an error, the runner calls
`mark_post_failed()`, increments `retry_count`, and notifies the owner via
Telegram. Partial failures (some platforms succeeded, some failed) still
mark the post as `PUBLISHED` but log a warning.

### Layer 04 — Persistence & Delivery

**Tech**: Supabase PostgreSQL + Telegram Bot.

**Why**: Supabase gives you Postgres + REST + RLS + auth in one free tier.
The `posts` table is the source of truth for the queue, the
`analytics_events` table records engagement snapshots over time, and the
`activity_log` table provides a full audit trail.

## Data model

```
posts (id, title, content, platforms[], status, scheduled_at, published_at,
       enhanced_content, hashtags[], media_urls[], source, author_handle,
       impressions, likes, shares, comments, clicks,
       error_message, retry_count, created_at, updated_at)

platforms (id, name, display_name, icon, connected, health,
           posts_count, followers, last_sync_at, metadata)

analytics_events (id, post_id, impressions, likes, shares, comments, clicks, captured_at)

activity_log (id, post_id, type, message, level, metadata, created_at)

daily_stats (date, posts_published, posts_failed, total_reach,
             total_engagement, ai_enhancements)
```

## Security

- All credentials live in GitHub Secrets, never in the repo.
- Supabase RLS is enabled on every table — only authenticated dashboard
  users can read; only the service role (used by the runner) can write.
- The Supabase service role key never reaches the browser.
- Platform API tokens (X, LinkedIn, Facebook) are read from env at runtime.

## Limits & scaling

The free tier comfortably supports:
- 100–500 posts/month per platform
- 4 platforms connected simultaneously
- 50k monthly dashboard users (Supabase MAU limit)
- 2,000 GitHub Actions minutes/month (~6,000 runner invocations)

Beyond that, you'd upgrade Supabase to the Pro tier ($25/mo) and GitHub
Actions to a paid plan — still a fraction of typical SaaS scheduling tools.
