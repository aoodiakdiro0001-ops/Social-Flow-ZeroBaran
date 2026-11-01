import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/queue
 * Returns the full post queue (pending + recently published/failed) ordered by scheduledAt.
 */
export async function GET() {
  const posts = await db.post.findMany({
    orderBy: [{ scheduledAt: "desc" }],
    take: 30,
    include: {
      _count: { select: { logs: true } },
    },
  });

  const result = posts.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    platforms: JSON.parse(p.platforms || "[]") as string[],
    status: p.status,
    scheduledAt: p.scheduledAt,
    publishedAt: p.publishedAt,
    aiEnhanced: !!p.enhancedContent,
    enhancedContent: p.enhancedContent,
    hashtags: JSON.parse(p.hashtags || "[]") as string[],
    source: p.source,
    authorHandle: p.authorHandle,
    metrics: {
      impressions: p.impressions,
      likes: p.likes,
      shares: p.shares,
      comments: p.comments,
      clicks: p.clicks,
    },
    logCount: p._count.logs,
  }));

  return NextResponse.json({ posts: result });
}
