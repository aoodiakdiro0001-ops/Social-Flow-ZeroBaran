"""
Social-Flow ZeroBaran  ·  Telegram Bot (Ingestion Layer)
=========================================================

This bot is your control channel. Send it a draft + a target time and it
writes a PENDING row to Supabase. The GitHub Actions runner will pick it
up at the scheduled time and publish it.

Commands:
  /schedule <content>   — schedule a post
  /list                 — show the next 10 pending posts
  /cancel <post_id>     — cancel a pending post
  /enhance <post_id>    — run an AI enhancement pass on a post
  /stats                — show 24h KPIs
  /help                  — show this help

Example session:
  /schedule
  content: Shipping ZeroBaran v1.0 today 🚀
  platforms: telegram,x,linkedin
  at: 2026-10-30 19:00

The bot parses the multi-line payload and inserts into the posts table.

Run locally:
    python bot/telegram_bot.py
"""

from __future__ import annotations

import asyncio
import json
import os
import re
from datetime import datetime, timezone
from typing import Any

import httpx
from telegram import Update
from telegram.ext import (
    Application,
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

# ----------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------
SUPABASE_URL          = os.environ["SUPABASE_URL"].rstrip("/")
SUPABASE_SERVICE_ROLE = os.environ["SUPABASE_SERVICE_ROLE"]
TELEGRAM_BOT_TOKEN   = os.environ["TELEGRAM_BOT_TOKEN"]
GEMINI_API_KEY        = os.environ.get("GEMINI_API_KEY", "")

SUPABASE_HEADERS = {
    "apikey":         SUPABASE_SERVICE_ROLE,
    "Authorization":  f"Bearer {SUPABASE_SERVICE_ROLE}",
    "Content-Type":   "application/json",
    "Prefer":         "return=representation",
}


# ----------------------------------------------------------------------
# Supabase helpers
# ----------------------------------------------------------------------
async def insert_post(client: httpx.AsyncClient, post: dict[str, Any]) -> dict[str, Any]:
    url = f"{SUPABASE_URL}/rest/v1/posts"
    r = await client.post(url, headers=SUPABASE_HEADERS, json=post)
    r.raise_for_status()
    return r.json()[0]


async def list_pending(client: httpx.AsyncClient, limit: int = 10) -> list[dict[str, Any]]:
    url = (
        f"{SUPABASE_URL}/rest/v1/posts"
        "?select=id,title,scheduled_at,platforms,status"
        "&status=eq.PENDING&order=scheduled_at.asc&limit=" + str(limit)
    )
    r = await client.get(url, headers=SUPABASE_HEADERS)
    r.raise_for_status()
    return r.json()


async def cancel_post(client: httpx.AsyncClient, post_id: str) -> int:
    url = f"{SUPABASE_URL}/rest/v1/posts?id=eq.{post_id}"
    r = await client.patch(url, headers=SUPABASE_HEADERS, json={"status": "CANCELLED"})
    r.raise_for_status()
    return len(r.json())


async def get_stats(client: httpx.AsyncClient) -> dict[str, Any]:
    """24h KPIs."""
    now = datetime.now(timezone.utc).isoformat()
    yesterday = datetime.now(timezone.utc).timestamp() - 86400
    since = datetime.fromtimestamp(yesterday, tz=timezone.utc).isoformat()

    # Published in last 24h
    url_pub = (
        f"{SUPABASE_URL}/rest/v1/posts"
        "?select=impressions,likes,shares,comments,clicks"
        f"&status=eq.PUBLISHED&published_at=gte.{since}"
    )
    r = await client.get(url_pub, headers=SUPABASE_HEADERS)
    r.raise_for_status()
    rows = r.json()
    return {
        "published_24h": len(rows),
        "impressions":  sum(r["impressions"] for r in rows),
        "engagement":   sum(r["likes"] + r["shares"] + r["comments"] + r["clicks"] for r in rows),
    }


# ----------------------------------------------------------------------
# AI enhancement (Gemini)
# ----------------------------------------------------------------------
async def gemini_enhance(client: httpx.AsyncClient, draft: str) -> tuple[str, list[str]] | None:
    """
    Returns (enhanced_text, hashtags) or None on failure.
    """
    if not GEMINI_API_KEY:
        return None
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY
    )
    prompt = (
        "You are the AI enhancement brain of ZeroBaran, an autonomous "
        "social media engine. Rewrite the following draft so it has a "
        "strong hook, tight pacing, and reads like our best-performing "
        "posts (voice: confident, data-led, no hype words). Then on a new "
        "line prefixed with HASHTAGS:, output 3–5 relevant hashtags "
        "separated by spaces.\n\nDRAFT:\n" + draft
    )
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    try:
        r = await client.post(url, json=payload, timeout=30.0)
        r.raise_for_status()
        text = r.json()["candidates"][0]["content"]["parts"][0]["text"]
        # Split out the hashtags line if present
        if "HASHTAGS:" in text:
            body, _, tags = text.partition("HASHTAGS:")
            hashtags = [t.strip() for t in tags.split() if t.strip().startswith("#")]
            return body.strip(), hashtags
        return text.strip(), []
    except Exception as e:
        print(f"[gemini] enhancement failed: {e}")
        return None


# ----------------------------------------------------------------------
# Command handlers
# ----------------------------------------------------------------------
async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "*Social-Flow ZeroBaran* — your autonomous social engine is online.\n\n"
        "Send me a draft and I'll queue it for publishing.\n\n"
        "Use /help to see all commands.",
        parse_mode="Markdown",
    )


async def cmd_help(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    help_text = (
        "*ZeroBaran commands*\n\n"
        "/schedule — schedule a post (multi-line format, see below)\n"
        "/list — show next 10 pending posts\n"
        "/cancel <post_id> — cancel a pending post\n"
        "/enhance <post_id> — run AI enhancement on a post\n"
        "/stats — 24h KPIs\n\n"
        "*Schedule format:*\n"
        "```\n/schedule\ncontent: Your post text here\nplatforms: telegram,x,linkedin\nat: 2026-10-30 19:00\n```"
    )
    await update.message.reply_text(help_text, parse_mode="Markdown")


def parse_schedule_payload(text: str) -> dict[str, Any] | None:
    """Parse a multi-line /schedule payload."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    fields: dict[str, str] = {}
    for line in lines:
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        fields[key.strip().lower()] = value.strip()
    if "content" not in fields or "at" not in fields:
        return None
    platforms = [p.strip() for p in fields.get("platforms", "telegram").split(",") if p.strip()]
    try:
        # Parse as naive then assume UTC
        scheduled_at = datetime.fromisoformat(fields["at"]).replace(tzinfo=timezone.utc)
    except ValueError:
        return None
    return {
        "title":        fields["content"][:60] + ("…" if len(fields["content"]) > 60 else ""),
        "content":      fields["content"],
        "platforms":    platforms,
        "scheduled_at": scheduled_at.isoformat(),
    }


async def cmd_schedule(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    payload_text = update.message.text.replace("/schedule", "", 1).strip()
    if not payload_text:
        await update.message.reply_text(
            "Send the schedule payload after the command:\n\n"
            "```\n/schedule\ncontent: Your post\nplatforms: telegram,x\nat: 2026-10-30 19:00\n```",
            parse_mode="Markdown",
        )
        return

    parsed = parse_schedule_payload(payload_text)
    if not parsed:
        await update.message.reply_text("⚠️ Couldn't parse. Required fields: `content`, `at` (ISO). Optional: `platforms`.", parse_mode="Markdown")
        return

    post = {
        **parsed,
        "source":       "telegram",
        "author_handle": f"@{update.effective_user.username}",
        "status":       "PENDING",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            created = await insert_post(client, post)
        except Exception as e:
            await update.message.reply_text(f"❌ Failed to queue: `{e}`", parse_mode="Markdown")
            return

    when_local = parsed["scheduled_at"]
    await update.message.reply_text(
        f"✅ Queued!\n\n*{created['title']}*\n"
        f"Platforms: {', '.join(parsed['platforms'])}\n"
        f"Scheduled at: `{when_local}`\n"
        f"Post ID: `{created['id']}`\n\n"
        f"Use /enhance {created['id']} to run an AI pass on this post.",
        parse_mode="Markdown",
    )


async def cmd_list(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            pending = await list_pending(client, limit=10)
        except Exception as e:
            await update.message.reply_text(f"❌ {e}")
            return

    if not pending:
        await update.message.reply_text("📭 No pending posts in the queue.")
        return

    lines = ["*Next 10 pending posts:*\n"]
    for p in pending:
        platforms = ", ".join(p["platforms"]) if p["platforms"] else "—"
        when = p["scheduled_at"][:16].replace("T", " ")
        lines.append(f"• `{p['id'][:8]}` — *{p['title']}* [{platforms}] @ {when} UTC")
    await update.message.reply_text("\n".join(lines), parse_mode="Markdown")


async def cmd_cancel(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not ctx.args:
        await update.message.reply_text("Usage: /cancel <post_id>")
        return
    post_id = ctx.args[0]
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            n = await cancel_post(client, post_id)
        except Exception as e:
            await update.message.reply_text(f"❌ {e}")
            return
    if n:
        await update.message.reply_text(f"✅ Cancelled post `{post_id}`.", parse_mode="Markdown")
    else:
        await update.message.reply_text("No matching PENDING post found.")


async def cmd_enhance(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not ctx.args:
        await update.message.reply_text("Usage: /enhance <post_id>")
        return
    post_id = ctx.args[0]
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Fetch the post content
        url = f"{SUPABASE_URL}/rest/v1/posts?id=eq.{post_id}&select=content"
        r = await client.get(url, headers=SUPABASE_HEADERS)
        r.raise_for_status()
        rows = r.json()
        if not rows:
            await update.message.reply_text("Post not found.")
            return
        draft = rows[0]["content"]

        await update.message.reply_text("🤖 Running Gemini enhancement…")
        result = await gemini_enhance(client, draft)
        if not result:
            await update.message.reply_text("⚠️ Enhancement failed (check GEMINI_API_KEY).")
            return
        enhanced, hashtags = result

        # Update the post row
        patch_url = f"{SUPABASE_URL}/rest/v1/posts?id=eq.{post_id}"
        await client.patch(patch_url, headers=SUPABASE_HEADERS, json={
            "enhanced_content": enhanced,
            "hashtags":         hashtags,
        })

    await update.message.reply_text(
        f"✨ *Enhanced!*\n\n{enhanced}\n\nHashtags: {' '.join(hashtags)}",
        parse_mode="Markdown",
    )


async def cmd_stats(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            stats = await get_stats(client)
        except Exception as e:
            await update.message.reply_text(f"❌ {e}")
            return
    await update.message.reply_text(
        "*24h Stats*\n\n"
        f"Published: {stats['published_24h']}\n"
        f"Impressions: {stats['impressions']:,}\n"
        f"Engagement: {stats['engagement']:,}",
        parse_mode="Markdown",
    )


# ----------------------------------------------------------------------
# Boot
# ----------------------------------------------------------------------
def build_app() -> Application:
    app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start",    cmd_start))
    app.add_handler(CommandHandler("help",     cmd_help))
    app.add_handler(CommandHandler("schedule", cmd_schedule))
    app.add_handler(CommandHandler("list",     cmd_list))
    app.add_handler(CommandHandler("cancel",   cmd_cancel))
    app.add_handler(CommandHandler("enhance",  cmd_enhance))
    app.add_handler(CommandHandler("stats",    cmd_stats))
    return app


if __name__ == "__main__":
    print("[bot] ZeroBaran Telegram bot starting…")
    app = build_app()
    app.run_polling()
