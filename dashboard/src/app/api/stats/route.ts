import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/stats
 * Returns aggregated top-level KPIs for the dashboard hero stats cards.
 */
export async function GET() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOf24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const startOf14d = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    pendingToday,
    published24h,
    failed24h,
    recentEvents,
    aiEnhanced24h,
    totalReach24h,
    dailyStats,
    platforms,
  ] = await Promise.all([
    db.post.count({ where: { status: "PENDING", scheduledAt: { gte: startOfDay } } }),
    db.post.count({ where: { status: "PUBLISHED", publishedAt: { gte: startOf24h } } }),
    db.post.count({ where: { status: "FAILED", updatedAt: { gte: startOf24h } } }),
    db.analyticsEvent.findMany({ where: { capturedAt: { gte: startOf24h } } }),
    db.post.count({
      where: {
        enhancedContent: { not: null },
        updatedAt: { gte: startOf24h },
      },
    }),
    db.post.aggregate({
      where: { status: "PUBLISHED", publishedAt: { gte: startOf24h } },
      _sum: { impressions: true, likes: true, shares: true, comments: true, clicks: true },
    }),
    db.dailyStat.findMany({
      where: { date: { gte: startOf14d.toISOString().slice(0, 10) } },
      orderBy: { date: "asc" },
    }),
    db.platform.findMany({ orderBy: { followers: "desc" } }),
  ]);

  const totalEngagement24h =
    (totalReach24h._sum.likes ?? 0) +
    (totalReach24h._sum.shares ?? 0) +
    (totalReach24h._sum.comments ?? 0) +
    (totalReach24h._sum.clicks ?? 0);

  const successRate =
    published24h + failed24h > 0
      ? Math.round((published24h / (published24h + failed24h)) * 100)
      : 100;

  const nextPending = await db.post.findFirst({
    where: { status: "PENDING", scheduledAt: { gte: now } },
    orderBy: { scheduledAt: "asc" },
    select: { scheduledAt: true, title: true, platforms: true },
  });

  return NextResponse.json({
    pendingToday,
    published24h,
    failed24h,
    aiEnhanced24h,
    reach24h: totalReach24h._sum.impressions ?? 0,
    engagement24h: totalEngagement24h,
    clicks24h: totalReach24h._sum.clicks ?? 0,
    successRate,
    nextPending: nextPending
      ? {
          title: nextPending.title,
          scheduledAt: nextPending.scheduledAt,
          platforms: JSON.parse(nextPending.platforms || "[]"),
        }
      : null,
    dailyStats: dailyStats.map((d) => ({
      date: d.date,
      postsPublished: d.postsPublished,
      postsFailed: d.postsFailed,
      totalReach: d.totalReach,
      totalEngagement: d.totalEngagement,
      aiEnhancements: d.aiEnhancements,
    })),
    platforms: platforms.map((p) => ({
      name: p.name,
      displayName: p.displayName,
      connected: p.connected,
      health: p.health,
      followers: p.followers,
      postsCount: p.postsCount,
      lastSyncAt: p.lastSyncAt,
    })),
  });
}
