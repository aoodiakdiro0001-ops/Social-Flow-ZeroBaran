<p align="center">
  <img src="https://img.shields.io/badge/cost-$0-success" alt="cost" />
  <img src="https://img.shields.io/badge/stack-100%25_free-informational" alt="stack" />
  <img src="https://img.shields.io/badge/platforms-TG·X·LI·FB-blue" alt="platforms" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
</p>

<h1 align="center">Social-Flow ZeroBaran</h1>

<p align="center">
  <strong>The Intelligent Self-Operating System for Social Media Management.</strong><br/>
  Schedule, publish, and analyze across Telegram, X, LinkedIn &amp; Facebook —
  on a 100% free tech stack, with zero vendor lock-in and total data sovereignty.
</p>

<p align="center">
  <strong>Author:</strong> Baran Avisat ·
  <strong>Email:</strong> Baranavisat@gmail.com ·
  <strong>WhatsApp:</strong> +90 531 326 3722
</p>

---

## Why does this project exist?

Paid social media scheduling suites cost **$480–$2,400/year** and force you
to hand your content plan, schedule, and audience analytics to third-party
marketing companies. ZeroBaran does the same job — scheduling, multi-platform
publishing, AI enhancement, and engagement analytics — using only **free-tier**
services you control.

| Capability                | Paid tools        | ZeroBaran |
| ------------------------- | ----------------- | --------- |
| Schedule across platforms | $30–$200/mo       | $0        |
| AI copy enhancement       | $20–$100/mo add-on| $0 (Gemini free tier) |
| Analytics dashboard       | $20–$80/mo        | $0        |
| Data sovereignty          | ❌ (hosted SaaS)  | ✅ (your Supabase) |
| 24/7 auto-publishing      | ✅                | ✅ (GitHub Actions cron) |

## Architecture (4 layers)

```
┌────────────────────────────────────────────────────────────┐
│  Layer 01 — Ingestion & Queue                              │
│  Telegram bot → writes a PENDING row to Supabase           │
└──────────────────────┬─────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────┐
│  Layer 02 — AI Enhancement Core (optional, pre-publish)    │
│  Gemini rewrites the hook + generates hashtags             │
└──────────────────────┬─────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────┐
│  Layer 03 — Execution & Runner                             │
│  GitHub Actions cron every 5 min → python runner.py        │
│  Pulls due posts, dispatches to each platform API          │
└──────────────────────┬─────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────┐
│  Layer 04 — Persistence & Delivery                         │
│  UPDATE post → PUBLISHED · write analytics event           │
│  → push Telegram confirmation to your phone                 │
└────────────────────────────────────────────────────────────┘
```

## Tech stack (all free)

| Layer          | Service                         | Free tier            |
| -------------- | ------------------------------- | -------------------- |
| Cron / runner  | GitHub Actions                  | 2,000 min/mo         |
| Core engine    | Python 3.12 · httpx             | open source          |
| AI brain       | Google Gemini API / Groq        | generous free tier   |
| Database       | Supabase (PostgreSQL)           | 500MB · 50k MAU      |
| Control UI     | Telegram Bot · Web Dashboard    | unlimited messages   |

## Repo layout

```
social-flow-zerobaran/
├── runner.py                          # Layer 03: GitHub Actions runner
├── bot/
│   ├── telegram_bot.py                # Layer 01: ingestion bot
│   └── requirements.txt
├── schema.sql                         # Layer 04: Supabase schema (run once)
├── .github/workflows/
│   └── zerobaran-runner.yml           # cron schedule (every 5 min)
├── requirements.txt
├── .env.example
└── README.md
```

## Deploy in 15 minutes

1. **Fork** this repo into your GitHub account.
2. **Create a Supabase project** at https://supabase.com (free).
3. **Run `schema.sql`** in Supabase SQL Editor.
4. **Talk to @BotFather** on Telegram → create a bot → copy the token.
5. **Set repository secrets** (Settings → Secrets and variables → Actions):
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
   - `GEMINI_API_KEY` (optional, for AI enhancement)
   - `X_BEARER_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, `FACEBOOK_PAGE_TOKEN`
6. **Push** the repo. GitHub Actions will start polling every 5 min.
7. **Send your bot a draft:**
   ```
   /schedule
   content: Shipping ZeroBaran v1.0 today 🚀
   platforms: telegram,x,linkedin
   at: 2026-10-30 19:00
   ```

The runner picks up the post at the scheduled time, publishes to all
listed platforms, and pushes a ✅ confirmation back to your Telegram.

## Commands

| Command                       | Description                                |
| ----------------------------- | ------------------------------------------ |
| `/schedule <multi-line>`      | Queue a new post (see example above)       |
| `/list`                       | Show the next 10 pending posts             |
| `/cancel <post_id>`           | Cancel a pending post                      |
| `/enhance <post_id>`          | Run a Gemini enhancement pass              |
| `/stats`                      | 24h KPIs (published, reach, engagement)    |

## Sovereignty & privacy

Every byte of your data — content drafts, schedule, engagement numbers —
lives in **your** Supabase project. Nothing is ever sent to marketing
vendors, advertising networks, or third-party analytics companies. The only
outbound calls go directly to the platform APIs you authorized.

## Roadmap

- [ ] Instagram connector (Graph API)
- [ ] Multi-image carousels
- [ ] Best-time-to-post ML (per-platform)
- [ ] Web dashboard (Next.js — included in this package as the `dashboard/` preview)

## License & copyright

© 2026 **Baran Avisat**. All rights reserved.

This project, its source code, documentation, and visual identity are the
intellectual property of **Baran Avisat**. Unauthorized reproduction,
redistribution, or claiming authorship is prohibited without explicit
written permission.

For licensing inquiries, support, or commercial use, contact the author:
- 📧 Email: Baranavisat@gmail.com
- 💬 WhatsApp: +90 531 326 3722 (https://wa.me/905313263722)

---

<p align="center">
  <em>Built with a 100% free stack. Sovereign by design.</em>
</p>
