# Deployment Guide — Social-Flow ZeroBaran

**Author:** Baran Avisat · **Email:** Baranavisat@gmail.com · **WhatsApp:** +90 531 326 3722

Total time: **~15 minutes**. Total cost: **$0**.

## Prerequisites

You'll need free accounts on:
- [GitHub](https://github.com) (any plan, including free)
- [Supabase](https://supabase.com) (free tier)
- [Telegram](https://telegram.org) (any account)

Optional (for AI enhancement):
- [Google AI Studio](https://aistudio.google.com) — free Gemini API key

Optional (for multi-platform publishing):
- [X / Twitter Developer](https://developer.twitter.com)
- [LinkedIn Developers](https://www.linkedin.com/developers)
- [Facebook for Developers](https://developers.facebook.com)

## Step 1 — Fork the repo

```bash
gh repo fork zerobaran-labs/social-flow-zerobaran --clone
cd social-flow-zerobaran
```

## Step 2 — Set up Supabase

1. Create a new project at https://supabase.com/dashboard
2. Wait ~2 minutes for provisioning
3. Open **SQL Editor** → **New query**
4. Paste the contents of `schema.sql` → **Run**
5. Open **Project Settings** → **API**
6. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE`

## Step 3 — Create the Telegram bot

1. Open Telegram → search `@BotFather`
2. Send `/newbot` → choose a name → choose a username ending in `_bot`
3. Copy the **HTTP API token** → `TELEGRAM_BOT_TOKEN`
4. Send any message to your new bot
5. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser
6. Find your `chat.id` (negative number for groups) → `TELEGRAM_CHAT_ID`

## Step 4 — Set repository secrets

GitHub → your fork → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | `https://YOUR-PROJECT.supabase.co` |
| `SUPABASE_SERVICE_ROLE` | `eyJhbGc...` |
| `TELEGRAM_BOT_TOKEN` | `123456:ABC...` |
| `TELEGRAM_CHAT_ID` | `-1001234567890` |
| `GEMINI_API_KEY` | `AIza...` (optional) |
| `X_BEARER_TOKEN` | (optional, for X publishing) |
| `LINKEDIN_ACCESS_TOKEN` | (optional, for LinkedIn publishing) |
| `FACEBOOK_PAGE_TOKEN` | (optional, for Facebook publishing) |

## Step 5 — Run the bot locally (or in a small free VM)

The bot is the ingestion layer — it needs to keep running to accept
`/schedule` commands. Options:

**Option A — Local (always-on machine)**
```bash
pip install -r bot/requirements.txt
cp .env.example .env  # fill in
python bot/telegram_bot.py
```

**Option B — Free cloud (Render, Railway, Fly.io)**
Deploy `bot/telegram_bot.py` as a long-running worker. All three have
free tiers that fit a single Python process.

## Step 6 — Test the end-to-end flow

1. Open Telegram → talk to your bot
2. Send:
   ```
   /schedule
   content: Hello world — first ZeroBaran post 🚀
   platforms: telegram
   at: <5 minutes from now, ISO format>
   ```
3. Wait 5 minutes — GitHub Actions fires, the runner picks up your post,
   publishes it to the platform, and your bot sends a ✅ confirmation.

## Step 7 — Open the web dashboard

The dashboard is a Next.js app. Run locally:

```bash
npm install
npm run dev
# open http://localhost:3000
```

Or deploy to Vercel (free tier) for a permanent URL.

## Verification checklist

- [ ] `select * from platforms;` returns 5 rows in Supabase
- [ ] `select * from fetch_due_posts(10);` returns your test post
- [ ] After 5 minutes, the post appears with `status='PUBLISHED'`
- [ ] `activity_log` has a `post_published` row for the test
- [ ] Telegram received a ✅ confirmation message

## Troubleshooting

**Bot doesn't respond**: verify `TELEGRAM_BOT_TOKEN` and that the bot
process is running (`python bot/telegram_bot.py` should print
`[bot] ZeroBaran Telegram bot starting…`).

**GitHub Actions never fires**: GitHub limits free repos to 5-min minimum
cron. The included `*/5 * * * *` schedule is already the minimum.

**Post stuck in PENDING**: check the Actions tab for the latest run — the
runner logs every step. Common issues: missing platform token, expired
LinkedIn token, X API v2 quota exceeded.

**Gemini enhancement fails**: verify `GEMINI_API_KEY` is set as a repo
secret. The free tier allows 60 requests/min — plenty for personal use.

---

## 📞 Need Help?

If you get stuck during deployment, contact the author:

- 📧 **Email:** Baranavisat@gmail.com
- 💬 **WhatsApp:** +90 531 326 3722 — [https://wa.me/905313263722](https://wa.me/905313263722)

For commercial licensing or enterprise support, reach out to the author
directly via email or WhatsApp.
