/**
 * Seed script for Social-Flow ZeroBaran dashboard
 * Seeds realistic demo data representing a live system state.
 */
import { db } from "@/lib/db";

const PLATFORMS = [
  { name: "telegram", displayName: "Telegram", icon: "telegram", followers: 12840 },
  { name: "x", displayName: "X / Twitter", icon: "x", followers: 8420 },
  { name: "linkedin", displayName: "LinkedIn", icon: "linkedin", followers: 4210 },
  { name: "facebook", displayName: "Facebook", icon: "facebook", followers: 3120 },
];

const SAMPLE_POSTS = [
  {
    title: "Product Launch — ZeroBaran v1.0",
    content: "Today we ship ZeroBaran — your fully-free autonomous social media engine. Schedule across Telegram, X, LinkedIn, and Facebook from one Telegram bot. Zero cost. Zero vendors. Total sovereignty over your audience.",
    platforms: ["telegram", "x", "linkedin"],
    scheduledInHours: 2,
    enhanced: true,
    hashtags: ["#BuildInPublic", "#OpenSource", "#Automation", "#SaaS"],
    engagement: { impressions: 4820, likes: 312, shares: 88, comments: 41, clicks: 142 },
  },
  {
    title: "Engineering Deep-Dive — Cronless Scheduling on GitHub Actions",
    content: "How we run a 24/7 publishing pipeline on free GitHub Actions minutes: matrix builds, idempotent posting, retry-on-failure, and Supabase as the source of truth. No servers. No bills.",
    platforms: ["linkedin", "x"],
    scheduledInHours: 6,
    enhanced: true,
    hashtags: ["#DevOps", "#GitHubActions", "#Serverless", "#Engineering"],
    engagement: { impressions: 2840, likes: 198, shares: 52, comments: 27, clicks: 96 },
  },
  {
    title: "Weekly Digest — Audience Growth Report",
    content: "This week we reached 28,590 unique accounts across all platforms. Top performing slot: Tue 19:00 UTC. AI-suggested next slot: Thu 21:30 UTC (+18% projected reach).",
    platforms: ["telegram", "linkedin"],
    scheduledInHours: 23,
    enhanced: false,
    hashtags: ["#GrowthReport", "#Analytics"],
    engagement: { impressions: 1820, likes: 124, shares: 36, comments: 19, clicks: 58 },
  },
  {
    title: "Customer Story — How Studio Nile tripled posting consistency",
    content: "Before ZeroBaran: 4 posts/month, 3 platforms, manual. After: 47 posts/month, fully autonomous, 0 missed slots. The shift took 6 days and zero dollars.",
    platforms: ["telegram", "x", "linkedin", "facebook"],
    scheduledInHours: -2,
    enhanced: true,
    hashtags: ["#CaseStudy", "#CustomerStory", "#ZeroCost"],
    engagement: { impressions: 3210, likes: 248, shares: 71, comments: 38, clicks: 121 },
  },
  {
    title: "AI Tip — Prompting Gemini for higher CTR",
    content: "Pro tip: ask Gemini to rewrite your hook in the voice of your top-3 best-performing posts. Our internal benchmark shows +24% average CTR over generic rewrites.",
    platforms: ["x", "linkedin"],
    scheduledInHours: -6,
    enhanced: true,
    hashtags: ["#AI", "#PromptEngineering", "#Growth"],
    engagement: { impressions: 2640, likes: 201, shares: 64, comments: 22, clicks: 88 },
  },
  {
    title: "Community Spotlight — Top contributor of the week",
    content: "Shoutout to @ahmed_codes for contributing the new Instagram connector draft. Merging next sprint. Open source wins again.",
    platforms: ["telegram", "x"],
    scheduledInHours: -12,
    enhanced: false,
    hashtags: ["#OpenSource", "#Community"],
    engagement: { impressions: 1420, likes: 89, shares: 21, comments: 12, clicks: 34 },
  },
];

function iso(hoursFromNow: number): Date {
  const d = new Date();
  d.setHours(d.getHours() + hoursFromNow);
  return d;
}

function isoHoursAgo(hours: number): Date {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
}

async function main() {
  console.log("Seeding Social-Flow ZeroBaran database...");

  for (const p of PLATFORMS) {
    await db.platform.upsert({
      where: { name: p.name },
      update: {
        displayName: p.displayName,
        icon: p.icon,
        connected: true,
        health: p.name === "facebook" ? "degraded" : "ok",
        followers: p.followers,
        postsCount: Math.floor(p.followers / 80),
        lastSyncAt: isoHoursAgo(1),
      },
      create: {
        name: p.name,
        displayName: p.displayName,
        icon: p.icon,
        connected: true,
        health: p.name === "facebook" ? "degraded" : "ok",
        followers: p.followers,
        postsCount: Math.floor(p.followers / 80),
        lastSyncAt: isoHoursAgo(1),
      },
    });
  }
  console.log(`✓ Upserted ${PLATFORMS.length} platforms`);

  let pendingCount = 0;
  let publishedCount = 0;
  let aiCount = 0;

  for (const sp of SAMPLE_POSTS) {
    const isPending = sp.scheduledInHours >= 0;
    const scheduledAt = iso(sp.scheduledInHours);
    const publishedAt = isPending ? null : scheduledAt;
    const status = isPending ? "PENDING" : "PUBLISHED";

    const post = await db.post.create({
      data: {
        title: sp.title,
        content: sp.content,
        platforms: JSON.stringify(sp.platforms),
        status,
        scheduledAt,
        publishedAt,
        enhancedContent: sp.enhanced
          ? `[AI-Enhanced] ${sp.content.slice(0, 80)}... -> Hook rewritten for ${sp.platforms.length} platforms`
          : null,
        hashtags: JSON.stringify(sp.hashtags),
        mediaUrls: "[]",
        source: "telegram",
        authorHandle: "@founder",
        impressions: status === "PUBLISHED" ? sp.engagement.impressions : 0,
        likes: status === "PUBLISHED" ? sp.engagement.likes : 0,
        shares: status === "PUBLISHED" ? sp.engagement.shares : 0,
        comments: status === "PUBLISHED" ? sp.engagement.comments : 0,
        clicks: status === "PUBLISHED" ? sp.engagement.clicks : 0,
      },
    });

    if (status === "PENDING") {
      pendingCount++;
      await db.activityLog.create({
        data: {
          postId: post.id,
          type: "post_scheduled",
          message: `Scheduled "${sp.title}" for ${scheduledAt.toISOString()}`,
          level: "info",
        },
      });
    } else {
      publishedCount++;
      await db.activityLog.create({
        data: {
          postId: post.id,
          type: "post_published",
          message: `Published "${sp.title}" to ${sp.platforms.join(", ")}`,
          level: "success",
        },
      });
      await db.analyticsEvent.create({
        data: {
          postId: post.id,
          impressions: sp.engagement.impressions,
          likes: sp.engagement.likes,
          shares: sp.engagement.shares,
          comments: sp.engagement.comments,
          clicks: sp.engagement.clicks,
        },
      });
    }

    if (sp.enhanced) {
      aiCount++;
      await db.activityLog.create({
        data: {
          postId: post.id,
          type: "ai_enhanced",
          message: `Gemini refined hook + generated ${sp.hashtags.length} hashtags`,
          level: "info",
        },
      });
    }
  }
  console.log(`✓ Created ${SAMPLE_POSTS.length} posts (${pendingCount} pending, ${publishedCount} published, ${aiCount} AI-enhanced)`);

  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const postsPub = 4 + Math.floor(Math.random() * 6);
    const postsFailed = Math.random() > 0.7 ? 1 : 0;
    const reach = postsPub * (1800 + Math.floor(Math.random() * 1800));
    const engagement = Math.floor(reach * (0.07 + Math.random() * 0.04));
    const aiEnh = Math.floor(postsPub * (0.6 + Math.random() * 0.3));
    await db.dailyStat.upsert({
      where: { date: key },
      update: {},
      create: {
        date: key,
        postsPublished: postsPub,
        postsFailed,
        totalReach: reach,
        totalEngagement: engagement,
        aiEnhancements: aiEnh,
      },
    });
  }
  console.log("✓ Seeded 14 days of daily analytics");

  await db.activityLog.create({
    data: {
      type: "post_failed",
      message: "LinkedIn API returned 429 — auto-retry queued in 15 min",
      level: "warning",
      createdAt: isoHoursAgo(3),
    },
  });
  await db.activityLog.create({
    data: {
      type: "platform_sync",
      message: "Synced engagement metrics from 6 published posts",
      level: "info",
      createdAt: isoHoursAgo(1),
    },
  });
  await db.activityLog.create({
    data: {
      type: "system_event",
      message: "GitHub Actions runner started — checked queue of 8 pending posts",
      level: "info",
      createdAt: isoHoursAgo(0.1),
    },
  });
  console.log("✓ Seeded activity logs");

  console.log("\n✅ Seed complete. Dashboard is ready to render live data.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
