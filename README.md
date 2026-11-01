# 🚀 Social-Flow ZeroBaran — Autonomous Social Media Engine

> **Innovation Registry Record #018**
> The intelligent self-operating system for scheduling, publishing, and analyzing
> social media content across Telegram, X, LinkedIn & Facebook — built entirely
> on a 100% free tech stack with total data sovereignty.

> **Author & Copyright Holder:** Baran Avisat
> **Email:** Baranavisat@gmail.com
> **WhatsApp:** +90 531 326 3722

---

## 📦 Package Contents

This archive contains the **complete** Social-Flow ZeroBaran project, split into
two complementary parts:

```
Social-Flow-ZeroBaran/
│
├── README.md                          ← This file
├── AUTHOR.md                          ← Author & copyright holder info
├── LICENSE                            ← MIT License (personal/non-commercial use)
├── dashboard/                         ← Next.js 16 + TypeScript + Prisma dashboard
│   ├── src/
│   │   ├── app/                       ← App Router (page, layout, globals.css)
│   │   │   └── api/                   ← Live API routes (stats, queue, analytics, activity)
│   │   ├── components/
│   │   │   ├── dashboard/             ← 11 dashboard sections (Hero, Stats, Queue, etc.)
│   │   │   ├── icons/                 ← Platform icons (Telegram, X, LinkedIn, Facebook)
│   │   │   ├── providers/             ← React Query provider
│   │   │   └── ui/                    ← shadcn/ui (install separately)
│   │   └── lib/                       ← Prisma client + utils
│   ├── prisma/schema.prisma           ← Database schema (5 models)
│   ├── scripts/seed.ts                ← Seed realistic demo data
│   ├── package.json, tsconfig.json, ...← Next.js config
│   └── README.md (in project root)
│
└── infrastructure/                    ← Production deployable backend
    ├── runner.py                      ← GitHub Actions execution engine (Layer 03)
    ├── schema.sql                     ← Supabase schema (5 tables + RLS + functions)
    ├── bot/
    │   └── telegram_bot.py            ← Telegram bot ingestion (Layer 01)
    ├── .github/workflows/
    │   └── zerobaran-runner.yml        ← Cron workflow (every 5 min)
    ├── docs/
    │   ├── ARCHITECTURE.md
    │   └── DEPLOYMENT.md
    ├── .env.example
    ├── requirements.txt
    ├── .gitignore
    ├── LICENSE
    └── README.md
```

---

## 🎯 What is ZeroBaran?

A **self-operating system** for social media management that:

- **Schedules** posts across 4 platforms from one Telegram bot
- **Publishes automatically** at the perfect time via free GitHub Actions cron
- **Enhances copy** with Google Gemini (hook rewriting + hashtag generation)
- **Tracks engagement** and reports back to your phone
- **Costs $0** — runs entirely on free-tier services
- **Sovereign by design** — your data never leaves your Supabase project

---

## 🛠️ Tech Stack (100% Free)

| Layer                | Technology                          | Free tier              |
| -------------------- | ----------------------------------- | ---------------------- |
| Cron / Runner        | GitHub Actions                      | 2,000 min/mo           |
| Core Engine          | Python 3.12 · httpx                 | Open source            |
| AI Brain             | Google Gemini API                   | Generous free tier     |
| Database             | Supabase (PostgreSQL)               | 500MB · 50k MAU        |
| Control UI           | Telegram Bot · Next.js Dashboard    | Unlimited messages     |

**Total cost: $0** (vs $480–$2,400/year for paid scheduling suites)

---

## 🏛️ Architecture (4 Layers)

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 01 — Ingestion & Queue                                │
│ Telegram bot → PENDING row in Supabase                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ Layer 02 — AI Enhancement Core (optional, pre-publish)      │
│ Gemini rewrites hook + generates hashtags                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ Layer 03 — Execution & Runner                               │
│ GitHub Actions cron every 5 min → python runner.py          │
│ Pulls due posts, dispatches to platform APIs                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ Layer 04 — Persistence & Delivery                           │
│ UPDATE post → PUBLISHED · analytics event · Telegram notify │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (15 minutes)

### Part A — Deploy the Infrastructure

1. **Fork** the `infrastructure/` folder into a new GitHub repo
2. **Create a Supabase project** at https://supabase.com (free)
3. **Run `schema.sql`** in Supabase SQL Editor
4. **Talk to @BotFather** on Telegram → create a bot → copy the token
5. **Set repository secrets** (Settings → Secrets → Actions):
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
   - `GEMINI_API_KEY` (optional)
   - `X_BEARER_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, `FACEBOOK_PAGE_TOKEN`
6. **Push** the repo — GitHub Actions starts polling every 5 min
7. **Run the bot locally** (or on Render/Railway free tier):
   ```bash
   cd infrastructure
   pip install -r requirements.txt -r bot/requirements.txt
   cp .env.example .env  # fill in
   python bot/telegram_bot.py
   ```
8. **Send your first scheduled post:**
   ```
   /schedule
   content: Hello world — first ZeroBaran post 🚀
   platforms: telegram,x,linkedin
   at: 2026-10-30 19:00
   ```

### Part B — Deploy the Dashboard

1. **Move** the `dashboard/` folder to its own repo (or subfolder)
2. **Install dependencies:**
   ```bash
   cd dashboard
   bun install     # or npm install
   ```
3. **Set up the database:**
   ```bash
   # Create a .env file with:
   DATABASE_URL="file:./db/custom.db"
   bun run db:push
   bun run scripts/seed.ts
   ```
4. **Run the dev server:**
   ```bash
   bun run dev     # opens on http://localhost:3000
   ```
5. **Deploy to Vercel** (free tier) for a permanent URL.

---

## 📊 Dashboard Features

The Next.js dashboard includes 11 live sections:

| Section                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| Hero                   | Logo, countdown to next publish, "System Online" indicator|
| Stats Cards (4)        | Pending today, Published 24h, Reach 24h, AI enhancements   |
| Publishing Queue       | Expandable rows with content, hashtags, metrics           |
| Platform Status        | Telegram, X, LinkedIn, Facebook with health + followers   |
| Reach & Engagement     | 14-day area chart (Reach vs Engagement)                   |
| Posts per Platform     | Horizontal bar chart                                       |
| Best Posting Hours     | 24-hour heatmap bar chart                                  |
| AI Enhancements        | 7-day mini bar chart                                       |
| AI Enhancement Studio  | Before/after copy transformations with CTR uplift           |
| Live Activity Log      | Streaming event log                                        |
| Architecture Diagram   | Visual 4-layer flow with code snippets                     |
| Tech Stack Grid        | Cost breakdown cards + "$0" total                         |
| Setup Guide            | 4-step deployment with copyable code blocks                |
| Footer                 | Innovation Registry #018, copyright, owner placeholders    |

---

## 🤖 Telegram Bot Commands

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `/schedule <payload>`  | Queue a new post (multi-line format)      |
| `/list`                | Show next 10 pending posts                 |
| `/cancel <post_id>`    | Cancel a pending post                      |
| `/enhance <post_id>`   | Run Gemini AI enhancement on a post        |
| `/stats`               | Show 24h KPIs                              |
| `/help`                | Show command help                          |

---

## 🔐 Security

- All credentials live in GitHub Secrets, never in the repo
- Supabase RLS is enabled on every table
- Service role key never reaches the browser
- Platform API tokens read from env at runtime
- Original draft preserved when AI enhancement runs

---

## 📝 Author & Support Information

| Field     | Value                          |
| --------- | ------------------------------ |
| **Author**  | Baran Avisat                   |
| **Email**   | Baranavisat@gmail.com          |
| **WhatsApp** | +90 531 326 3722              |
| **WhatsApp Link** | https://wa.me/905313263722 |

The dashboard footer (`dashboard/src/components/dashboard/footer-section.tsx`)
is pre-populated with the author's contact details. All three contact methods
(email, WhatsApp, docs) are clickable in the live dashboard.

For support, feature requests, licensing inquiries, or commercial use, reach
out to the author via any of the channels above.

---

## 📄 License & Copyright

© 2026 **Baran Avisat**. All rights reserved.

This project, its source code, documentation, and visual identity are the
intellectual property of **Baran Avisat**. Unauthorized reproduction,
redistribution, or claiming authorship is prohibited without explicit
written permission.

For licensing inquiries, support, or commercial use, contact the author:
- 📧 Email: Baranavisat@gmail.com
- 💬 WhatsApp: +90 531 326 3722 (https://wa.me/905313263722)

See [AUTHOR.md](./AUTHOR.md) for full author & copyright details.

---

<p align="center">
  <strong>Built with a 100% free stack. Sovereign by design.</strong>
</p>

---

## 🧾 بيانات المالك وحقوق الملكية (Owner & Copyright)

| الحقل | القيمة |
|---|---|
| **المؤلف / Owner** | **Baran Avisat** |
| **البريد / Email** | [baranavisat@gmail.com](mailto:baranavisat@gmail.com) |
| **واتساب / WhatsApp** | +90 531 326 37 22 |
| **الحساب البنكي / IBAN** | `TR10 0001 0090 1008 4013 0050 01` |
| **GitHub** | [github.com/aoodiakdiro0001-ops](https://github.com/aoodiakdiro0001-ops) |
| **المتجر / Store** | [baranavi.gumroad.com](https://baranavi.gumroad.com/) |
| **الترخيص / License** | MIT License (personal / non-commercial use) |

**© 2026 Baran Avisat — جميع الحقوق محفوظة / All Rights Reserved.**
