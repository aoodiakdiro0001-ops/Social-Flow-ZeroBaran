import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/activity
 * Returns the latest activity log entries.
 */
export async function GET() {
  const logs = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    include: { post: { select: { title: true } } },
  });

  return NextResponse.json({
    logs: logs.map((l) => ({
      id: l.id,
      type: l.type,
      message: l.message,
      level: l.level,
      postTitle: l.post?.title,
      createdAt: l.createdAt,
    })),
  });
}
