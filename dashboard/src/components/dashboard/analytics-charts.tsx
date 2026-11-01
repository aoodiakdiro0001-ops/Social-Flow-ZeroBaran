"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, BarChart3, Clock4, Sparkles } from "lucide-react";
import { getPlatformMeta } from "@/components/icons/platform-icons";

export type DailyStat = {
  date: string;
  postsPublished: number;
  postsFailed: number;
  totalReach: number;
  totalEngagement: number;
  aiEnhancements: number;
};

export type PerPlatform = {
  name: string;
  displayName: string;
  health: string;
  connected: boolean;
  posts: number;
  impressions: number;
  engagement: number;
  followers: number;
};

export type HourBucket = {
  hour: number;
  label: string;
  posts: number;
  reach: number;
};

type Props = {
  dailyStats: DailyStat[];
  perPlatform: PerPlatform[];
  hourBuckets: HourBucket[];
};

const CHART_COLORS = {
  emerald: "#10b981",
  cyan: "#22d3ee",
  amber: "#f59e0b",
  violet: "#a78bfa",
  rose: "#f43f5e",
};

export function AnalyticsCharts({ dailyStats, perPlatform, hourBuckets }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Reach trend - spans 2 cols */}
      <Card className="lg:col-span-2 p-5 bg-card/60 backdrop-blur-sm border-zinc-800/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-foreground">Reach &amp; Engagement</h3>
            <span className="text-xs text-muted-foreground font-mono">/ 14 days</span>
          </div>
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            +24% vs prior period
          </Badge>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyStats} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-reach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.emerald} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={CHART_COLORS.emerald} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-eng" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.cyan} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={CHART_COLORS.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                stroke="#52525b"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#52525b"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0.014 240 / 0.95)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#e4e4e7" }}
                formatter={(value: number, name: string) => [
                  new Intl.NumberFormat("en-US").format(value),
                  name === "totalReach" ? "Reach" : "Engagement",
                ]}
              />
              <Area
                type="monotone"
                dataKey="totalReach"
                stroke={CHART_COLORS.emerald}
                strokeWidth={2}
                fill="url(#grad-reach)"
                name="Reach"
              />
              <Area
                type="monotone"
                dataKey="totalEngagement"
                stroke={CHART_COLORS.cyan}
                strokeWidth={2}
                fill="url(#grad-eng)"
                name="Engagement"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <Legend2 color={CHART_COLORS.emerald} label="Reach" />
          <Legend2 color={CHART_COLORS.cyan} label="Engagement" />
        </div>
      </Card>

      {/* Per-platform distribution */}
      <Card className="p-5 bg-card/60 backdrop-blur-sm border-zinc-800/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-foreground">Posts per Platform</h3>
          </div>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={perPlatform}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis
                type="number"
                stroke="#52525b"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                stroke="#a1a1aa"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip
                cursor={{ fill: "#27272a30" }}
                contentStyle={{
                  backgroundColor: "oklch(0.16 0.014 240 / 0.95)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Bar dataKey="posts" radius={[0, 6, 6, 0]} barSize={20}>
                {perPlatform.map((p, i) => {
                  const colors = [CHART_COLORS.emerald, CHART_COLORS.cyan, CHART_COLORS.amber, CHART_COLORS.violet];
                  return (
                    <Cell key={p.name} fill={colors[i % colors.length]} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Best posting times heatmap-style chart */}
      <Card className="lg:col-span-2 p-5 bg-card/60 backdrop-blur-sm border-zinc-800/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock4 className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-foreground">Best Posting Hours (UTC)</h3>
            <span className="text-xs text-muted-foreground font-mono">/ last 30 days</span>
          </div>
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300">
            peak: 19:00 UTC
          </Badge>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourBuckets} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#52525b"
                tick={{ fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                stroke="#52525b"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "#27272a30" }}
                contentStyle={{
                  backgroundColor: "oklch(0.16 0.014 240 / 0.95)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#e4e4e7" }}
                formatter={(v: number) => [`${v} posts`, ""]}
              />
              <Bar dataKey="posts" radius={[4, 4, 0, 0]} barSize={8}>
                {hourBuckets.map((b) => {
                  const intensity = b.posts / Math.max(...hourBuckets.map((x) => x.posts), 1);
                  const color =
                    intensity > 0.7
                      ? CHART_COLORS.emerald
                      : intensity > 0.4
                      ? CHART_COLORS.cyan
                      : intensity > 0.15
                      ? CHART_COLORS.amber
                      : "#3f3f46";
                  return <Cell key={b.hour} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-mono">intensity:</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: "#3f3f46" }} />
            low
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: CHART_COLORS.amber }} />
            medium
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: CHART_COLORS.cyan }} />
            high
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: CHART_COLORS.emerald }} />
            peak
          </span>
        </div>
      </Card>

      {/* AI enhancements */}
      <Card className="p-5 bg-card/60 backdrop-blur-sm border-zinc-800/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-foreground">AI Enhancements</h3>
          </div>
        </div>
        <div className="space-y-2">
          {dailyStats.slice(-7).map((d) => {
            const max = Math.max(...dailyStats.slice(-7).map((x) => x.aiEnhancements), 1);
            const pct = (d.aiEnhancements / max) * 100;
            return (
              <div key={d.date} className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground w-12">
                  {d.date.slice(5)}
                </span>
                <div className="flex-1 h-5 rounded-md bg-zinc-800/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500/40 to-amber-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-amber-300 w-6 text-right">
                  {d.aiEnhancements}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Legend2({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}
