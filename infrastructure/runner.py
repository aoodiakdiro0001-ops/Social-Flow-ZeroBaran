"""
Social-Flow ZeroBaran  ·  Execution Runner
============================================

This is the brain of the GitHub Actions cron job. Every 5 minutes it:
  1. Pulls due posts from Supabase (status=PENDING AND scheduled_at <= now()).
  2. For each post, dispatches it to every target platform via the
     platform connectors (Telegram, X, LinkedIn, Facebook).
  3. On success -> calls mark_post_published() and pushes a Telegram
     confirmation to the owner.
  4. On failure -> calls mark_post_failed() with the error and schedules
     an automatic retry (up to 3 attempts).

Run locally:
    python runner.py

Run inside GitHub Actions:
    Defined in .github/workflows/zerobaran-runner.yml
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
import traceback
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

import httpx

# ----------------------------------------------------------------------
# Configuration (provided via env / GitHub Secrets)
# ----------------------------------------------------------------------
SUPABASE_URL            = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE   = os.environ["SUPABASE_SERVICE_ROLE"]
TELEGRAM_BOT_TOKEN      = os.environ["TELEGRAM_BOT_TOKEN"]
TELEGRAM_CHAT_ID        = os.environ["TELEGRAM_CHAT_ID"]          # your personal chat id
GEMINI_API_KEY          = os.environ.get("GEMINI_API_KEY", "")
X_BEARER_TOKEN          = os.environ.get("X_BEARER_TOKEN", "")
LINKEDIN_ACCESS_TOKEN   = os.environ.get("LINKEDIN_ACCESS_TOKEN", "")
FACEBOOK_PAGE_TOKEN    = os.environ.get("FACEBOOK_PAGE_TOKEN", "")

MAX_RETRIES             = 3
HTTP_TIMEOUT            = 30.0


# ----------------------------------------------------------------------
# Data model
# ----------------------------------------------------------------------
@dataclass
class Post:
    id: str
    title: str
    content: str
    platforms: list[str]
    scheduled_at: str
    enhanced_content: str | None
    hashtags: list[str]
    media_urls: list[str]
    retry_count: int

    @property
    def publish_content(self) -> str:
        """Use AI-enhanced version if available, else the original."""
        body = self.enhanced_content or self.content
        if self.hashtags:
            body = body + "\n\n" + " ".join(self.hashtags)
        return body


# ----------------------------------------------------------------------
# Supabase client (thin wrapper around the REST API)
# ----------------------------------------------------------------------
class Supabase:
    def __init__(self, client: httpx.AsyncClient):
        self.client = client
        self.headers = {
            "apikey": SUPABASE_SERVICE_ROLE,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    async def fetch_due_posts(self) -> list[Post]:
        """Call the fetch_due_posts() SQL function — returns posts due now."""
        url = f"{SUPABASE_URL}/rest/v1/rpc/fetch_due_posts"
        r = await self.client.post(url, headers=self.headers, json={"p_limit": 50})
        r.raise_for_status()
        rows = r.json()
        return [
            Post(
                id=row["id"],
                title=row["title"],
                content=row["content"],
                platforms=row.get("platforms", []),
                scheduled_at=row["scheduled_at"],
                enhanced_content=row.get("enhanced_content"),
                hashtags=row.get("hashtags", []),
                media_urls=row.get("media_urls", []),
                retry_count=row.get("retry_count", 0),
            )
            for row in rows
        ]

    async def mark_published(self, post: Post, metrics: dict[str, int]) -> None:
        url = f"{SUPABASE_URL}/rest/v1/rpc/mark_post_published"
        await self.client.post(url, headers=self.headers, json={
            "p_post_id":     post.id,
            "p_impressions": metrics.get("impressions", 0),
            "p_likes":       metrics.get("likes", 0),
            "p_shares":      metrics.get("shares", 0),
            "p_comments":    metrics.get("comments", 0),
            "p_clicks":      metrics.get("clicks", 0),
        })

    async def mark_failed(self, post: Post, error: str) -> None:
        url = f"{SUPABASE_URL}/rest/v1/rpc/mark_post_failed"
        await self.client.post(url, headers=self.headers, json={
            "p_post_id": post.id,
            "p_error":   error[:500],
        })

    async def write_log(self, post_id: str | None, type_: str, message: str, level: str = "info") -> None:
        url = f"{SUPABASE_URL}/rest/v1/activity_log"
        await self.client.post(url, headers=self.headers, json={
            "post_id": post_id,
            "type":    type_,
            "message": message,
            "level":   level,
        })


# ----------------------------------------------------------------------
# Platform connectors
# ----------------------------------------------------------------------
async def post_telegram(client: httpx.AsyncClient, content: str) -> dict[str, int]:
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    r = await client.post(url, json={
        "chat_id":    TELEGRAM_CHAT_ID,
        "text":       content,
        "parse_mode": "Markdown",
    })
    r.raise_for_status()
    # Telegram doesn't expose reach; mark as 1 delivery
    return {"impressions": 1, "likes": 0, "shares": 0, "comments": 0, "clicks": 0}


async def post_x(client: httpx.AsyncClient, content: str) -> dict[str, int]:
    url = "https://api.twitter.com/2/tweets"
    headers = {"Authorization": f"Bearer {X_BEARER_TOKEN}"}
    r = await client.post(url, headers=headers, json={"text": content[:280]})
    r.raise_for_status()
    return {"impressions": 0, "likes": 0, "shares": 0, "comments": 0, "clicks": 0}


async def post_linkedin(client: httpx.AsyncClient, content: str) -> dict[str, int]:
    # Step 1: fetch current user URN
    me = await client.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}"},
    )
    me.raise_for_status()
    author_urn = f"urn:li:person:{me.json()['sub']}"

    r = await client.post(
        "https://api.linkedin.com/v2/ugcPosts",
        headers={
            "Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}",
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
        },
        json={
            "author": author_urn,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {"text": content},
                    "shareMediaCategory": "NONE",
                }
            },
            "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
        },
    )
    r.raise_for_status()
    return {"impressions": 0, "likes": 0, "shares": 0, "comments": 0, "clicks": 0}


async def post_facebook(client: httpx.AsyncClient, content: str) -> dict[str, int]:
    # Posts to the page feed (FACEBOOK_PAGE_TOKEN is the page access token)
    url = f"https://graph.facebook.com/v19.0/me/feed"
    r = await client.post(url, data={"message": content, "access_token": FACEBOOK_PAGE_TOKEN})
    r.raise_for_status()
    return {"impressions": 0, "likes": 0, "shares": 0, "comments": 0, "clicks": 0}


PLATFORM_DISPATCH = {
    "telegram": post_telegram,
    "x":        post_x,
    "linkedin": post_linkedin,
    "facebook": post_facebook,
}


# ----------------------------------------------------------------------
# Owner notification
# ----------------------------------------------------------------------
async def notify_owner(client: httpx.AsyncClient, text: str) -> None:
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        await client.post(url, json={
            "chat_id":    TELEGRAM_CHAT_ID,
            "text":       text,
            "parse_mode": "Markdown",
        })
    except Exception:
        # Never fail the runner because of a notification error
        pass


# ----------------------------------------------------------------------
# Main loop
# ----------------------------------------------------------------------
async def process_post(supabase: Supabase, client: httpx.AsyncClient, post: Post) -> None:
    print(f"[runner] processing post {post.id} -> {post.platforms}")
    successful_platforms: list[str] = []
    failed_platforms: list[str] = []
    total_metrics: dict[str, int] = {"impressions": 0, "likes": 0, "shares": 0, "comments": 0, "clicks": 0}

    for platform in post.platforms:
        handler = PLATFORM_DISPATCH.get(platform)
        if not handler:
            failed_platforms.append(f"{platform} (no connector)")
            continue
        try:
            metrics = await handler(client, post.publish_content)
            successful_platforms.append(platform)
            for k, v in metrics.items():
                total_metrics[k] += v
        except Exception as e:
            failed_platforms.append(f"{platform} ({type(e).__name__})")
            print(f"  ! {platform} failed: {e}")

    if failed_platforms and not successful_platforms:
        # Total failure
        await supabase.mark_failed(post, f"All platforms failed: {', '.join(failed_platforms)}")
        await notify_owner(
            client,
            f"❌ *Post failed*\n*{post.title}*\n\nFailed on: {', '.join(failed_platforms)}\n"
            f"Retry count: {post.retry_count + 1}/{MAX_RETRIES}",
        )
    else:
        # At least one platform succeeded
        await supabase.mark_published(post, total_metrics)
        if failed_platforms:
            await supabase.write_log(
                post.id, "post_failed",
                f"Partial failures: {', '.join(failed_platforms)}", "warning",
            )
        await notify_owner(
            client,
            f"✅ *Published successfully*\n*{post.title}*\n\n"
            f"Platforms: {', '.join(successful_platforms)}"
            + (f"\nPartial failures: {', '.join(failed_platforms)}" if failed_platforms else "")
            + f"\n\nPublished at: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        )


async def main() -> int:
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE:
        print("[runner] MISSING_SUPABASE_CONFIG — set SUPABASE_URL and SUPABASE_SERVICE_ROLE")
        return 2

    async with httpx.AsyncClient(timeout=HTTP_TIMEOUT) as client:
        supabase = Supabase(client)
        try:
            posts = await supabase.fetch_due_posts()
        except Exception as e:
            print(f"[runner] failed to fetch due posts: {e}")
            traceback.print_exc()
            return 1

        if not posts:
            print(f"[runner] {datetime.now(timezone.utc).isoformat()} — no due posts.")
            return 0

        print(f"[runner] {datetime.now(timezone.utc).isoformat()} — {len(posts)} due posts.")
        for post in posts:
            try:
                await process_post(supabase, client, post)
            except Exception as e:
                print(f"[runner] post {post.id} raised: {e}")
                traceback.print_exc()
                await supabase.mark_failed(post, f"Runner exception: {type(e).__name__}: {e}")
        return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
