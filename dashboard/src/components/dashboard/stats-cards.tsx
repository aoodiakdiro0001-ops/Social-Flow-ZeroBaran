"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import {
  Clock,
  CheckCircle2,
  Eye,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export type StatsData = {
  pendingToday: number;
  published24h: number;
  failed24h: number;
  aiEnhanced24h: number;
  reach24h: number;
  engagement24h: number;
  clicks24h: number;
  successRate: number;
};

const TREND: Record<keyof StatsData, number> = {
  pendingToday: 12,
  published24h: 18,
  failed24h: -50,
  aiEnhanced24h: 33,
  reach24h: 24,
  engagement24h: 9,
  clicks24h: 16,
  successRate: 2,
};

export function StatsCards({ data }: { data: StatsData | null }) {
  const stats: Array<{
    key: keyof StatsData;
    label: string;
    value: string;
    sub: string;
    icon: React.ReactNode;
    accent: string; // tailwind classes for the icon tile
    trend: number;
  }> = [
    {
      key: "pendingToday",
      label: "Scheduled Today",
      value: data ? String(data.pendingToday) : "—",
      sub: "Posts queued for the next 24h",
      icon: <Clock className="h-4 w-4" />,
      accent: "from-sky-500/20 to-sky-500/5 text-sky-300 border-sky-500/30",
      trend: TREND.pendingToday,
    },
    {
      key: "published24h",
      label: "Published (24h)",
      value: data ? String(data.published24h) : "—",
      sub: `${data?.successRate ?? 100}% success rate`,
      icon: <CheckCircle2 className="h-4 w-4" />,
      accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/30",
      trend: TREND.published24h,
    },
    {
      key: "reach24h",
      label: "Total Reach (24h)",
      value: data ? formatNumber(data.reach24h) : "—",
      sub: `${data ? formatNumber(data.engagement24h) : "—"} engagements`,
      icon: <Eye className="h-4 w-4" />,
      accent: "from-cyan-500/20 to-cyan-500/5 text-cyan-300 border-cyan-500/30",
      trend: TREND.reach24h,
    },
    {
      key: "aiEnhanced24h",
      label: "AI Enhancements (24h)",
      value: data ? String(data.aiEnhanced24h) : "—",
      sub: "Gemini-refined posts",
      icon: <Sparkles className="h-4 w-4" />,
      accent: "from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-500/30",
      trend: TREND.aiEnhanced24h,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card
          key={s.key}
          className="relative overflow-hidden p-5 bg-card/60 backdrop-blur-sm border-zinc-800/60 hover:border-zinc-700/80 transition-colors group"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
          <div className="flex items-start justify-between">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-br ${s.accent}`}
            >
              {s.icon}
            </div>
            <TrendBadge value={s.trend} />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {s.value}
            </div>
            <div className="mt-1 text-sm font-medium text-foreground/80">{s.label}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
          </div>
          <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br from-white/0 to-white/[0.02] group-hover:to-white/[0.04] transition-all" />
        </Card>
      ))}
    </section>
  );
}

function TrendBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-mono font-medium ${
        positive
          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
          : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      )}
      {Math.abs(value)}%
    </span>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}
