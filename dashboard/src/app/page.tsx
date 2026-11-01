"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/dashboard/hero-section";
import { StatsCards, type StatsData } from "@/components/dashboard/stats-cards";
import { QueueTable, type QueuePost } from "@/components/dashboard/queue-table";
import { PlatformStatus, type PlatformInfo } from "@/components/dashboard/platform-status";
import { AnalyticsCharts, type DailyStat, type PerPlatform, type HourBucket } from "@/components/dashboard/analytics-charts";
import { AIStudio } from "@/components/dashboard/ai-studio";
import { ArchitectureDiagram } from "@/components/dashboard/architecture-diagram";
import { TechStackGrid } from "@/components/dashboard/tech-stack";
import { SetupGuide } from "@/components/dashboard/setup-guide";
import { ActivityFeed, type ActivityLogItem } from "@/components/dashboard/activity-feed";
import { FooterSection } from "@/components/dashboard/footer-section";

type StatsResponse = StatsData & {
  nextPending: {
    title: string;
    scheduledAt: string;
    platforms: string[];
  } | null;
  dailyStats: DailyStat[];
  platforms: PlatformInfo[];
};

type QueueResponse = { posts: QueuePost[] };
type AnalyticsResponse = {
  perPlatform: PerPlatform[];
  dailyStats: DailyStat[];
  hourBuckets: HourBucket[];
};
type ActivityResponse = { logs: ActivityLogItem[] };

async function fetchJSON<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`);
  return r.json() as Promise<T>;
}

export default function Home() {
  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ["stats"],
    queryFn: () => fetchJSON<StatsResponse>("/api/stats"),
    refetchInterval: 30_000,
  });

  const { data: queue } = useQuery<QueueResponse>({
    queryKey: ["queue"],
    queryFn: () => fetchJSON<QueueResponse>("/api/queue"),
    refetchInterval: 30_000,
  });

  const { data: analytics } = useQuery<AnalyticsResponse>({
    queryKey: ["analytics"],
    queryFn: () => fetchJSON<AnalyticsResponse>("/api/analytics"),
    refetchInterval: 60_000,
  });

  const { data: activity } = useQuery<ActivityResponse>({
    queryKey: ["activity"],
    queryFn: () => fetchJSON<ActivityResponse>("/api/activity"),
    refetchInterval: 15_000,
  });

  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection
        nextPost={stats?.nextPending ?? null}
        systemOnline={stats?.platforms?.every((p) => p.health !== "down") ?? true}
      />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 space-y-12 pb-8">
        {/* KPI cards */}
        <StatsCards data={stats ?? null} />

        {/* Queue + platforms */}
        <section id="dashboard" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <QueueTable posts={queue?.posts ?? []} />
          </div>
          <div className="lg:col-span-1">
            <PlatformStatus platforms={stats?.platforms ?? []} />
          </div>
        </section>

        {/* Analytics */}
        <section className="scroll-mt-20">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span className="text-xs font-medium text-cyan-300">Audience Analytics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Know your audience.
              <span className="block text-muted-foreground text-base font-normal mt-2">
                Reach, engagement, best posting hours, and AI-driven recommendations — all live, all yours.
              </span>
            </h2>
          </div>
          <AnalyticsCharts
            dailyStats={analytics?.dailyStats ?? []}
            perPlatform={analytics?.perPlatform ?? []}
            hourBuckets={analytics?.hourBuckets ?? []}
          />
        </section>

        {/* AI Studio + Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AIStudio />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed logs={activity?.logs ?? []} />
          </div>
        </section>

        {/* Architecture */}
        <ArchitectureDiagram />

        {/* Tech Stack */}
        <TechStackGrid />

        {/* Setup Guide */}
        <SetupGuide />
      </div>

      <div className="mt-auto">
        <FooterSection />
      </div>
    </main>
  );
}
