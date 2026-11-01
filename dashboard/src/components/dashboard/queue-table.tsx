"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronRight,
  ListChecks,
} from "lucide-react";
import { getPlatformMeta } from "@/components/icons/platform-icons";

export type QueuePost = {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  status: "PENDING" | "PUBLISHED" | "FAILED" | "CANCELLED";
  scheduledAt: string;
  publishedAt: string | null;
  aiEnhanced: boolean;
  hashtags: string[];
  metrics: {
    impressions: number;
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
};

const STATUS_META = {
  PENDING: {
    label: "Pending",
    icon: <Clock className="h-3 w-3" />,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  PUBLISHED: {
    label: "Published",
    icon: <CheckCircle2 className="h-3 w-3" />,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  FAILED: {
    label: "Failed",
    icon: <XCircle className="h-3 w-3" />,
    className: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="h-3 w-3" />,
    className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  },
} as const;

export function QueueTable({ posts }: { posts: QueuePost[] }) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <Card className="flex flex-col h-full bg-card/60 backdrop-blur-sm border-zinc-800/60">
      <div className="flex items-center justify-between gap-2 p-5 pb-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground">Publishing Queue</h3>
          <span className="text-xs font-mono text-muted-foreground">
            ({posts.length})
          </span>
        </div>
        <Badge variant="outline" className="border-zinc-700/50 text-zinc-400">
          Supabase · posts table
        </Badge>
      </div>
      <ScrollArea className="flex-1 max-h-[26rem] scroll-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800/60 hover:bg-transparent">
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                Post
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono w-32">
                Platforms
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono w-36">
                Schedule
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono w-28">
                Status
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono w-24 text-right">
                Reach
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-12">
                  No posts in the queue yet.
                </TableCell>
              </TableRow>
            )}
            {posts.map((post) => {
              const meta = STATUS_META[post.status];
              const isOpen = expanded === post.id;
              return (
                <React.Fragment key={post.id}>
                  <TableRow
                    className="border-zinc-800/40 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                    onClick={() => setExpanded(isOpen ? null : post.id)}
                  >
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {post.content}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {post.aiEnhanced && (
                              <Badge
                                variant="outline"
                                className="gap-0.5 px-1.5 py-0 h-5 text-[10px] border-amber-500/30 bg-amber-500/10 text-amber-300"
                              >
                                <Sparkles className="h-2.5 w-2.5" />
                                AI
                              </Badge>
                            )}
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {post.source ?? "telegram"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground mt-1 transition-transform ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1">
                        {post.platforms.map((p) => {
                          const m = getPlatformMeta(p);
                          return (
                            <span
                              key={p}
                              title={m.label}
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-md border ${m.bg} ${m.text} border-zinc-700/40`}
                            >
                              <m.Icon className="h-3 w-3" />
                            </span>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-mono text-zinc-300">
                        {formatSchedule(post.scheduledAt, post.status)}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {post.status === "PUBLISHED" && post.publishedAt
                          ? `published ${formatRelative(post.publishedAt)}`
                          : `in ${formatRelativeFromNow(post.scheduledAt)}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`gap-1 px-2 py-0.5 ${meta.className}`}
                      >
                        {meta.icon}
                        {meta.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {post.status === "PUBLISHED" ? (
                        <div className="text-sm font-semibold tabular-nums text-foreground">
                          {formatNumber(post.metrics.impressions)}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                      {post.status === "PUBLISHED" && (
                        <div className="text-[10px] text-muted-foreground">
                          {formatNumber(post.metrics.likes + post.metrics.shares + post.metrics.comments)} eng.
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  {isOpen && (
                    <TableRow className="border-zinc-800/40 bg-zinc-900/40">
                      <TableCell colSpan={5} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-3">
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">
                                Content
                              </div>
                              <p className="text-sm text-foreground/90 leading-relaxed">
                                {post.content}
                              </p>
                            </div>
                            {post.aiEnhanced && (
                              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Sparkles className="h-3 w-3 text-amber-400" />
                                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-mono">
                                    AI Enhancement
                                  </span>
                                </div>
                                <p className="text-xs text-amber-100/80 leading-relaxed">
                                  Hook rewritten for higher CTR · tone matched to top-3 historical posts · {post.hashtags.length} hashtags generated
                                </p>
                              </div>
                            )}
                            {post.hashtags.length > 0 && (
                              <div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1.5">
                                  Hashtags
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {post.hashtags.map((h) => (
                                    <span
                                      key={h}
                                      className="text-[11px] font-mono text-emerald-300"
                                    >
                                      {h}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">
                              Engagement
                            </div>
                            <MetricRow label="Impressions" value={post.metrics.impressions} />
                            <MetricRow label="Likes" value={post.metrics.likes} />
                            <MetricRow label="Shares" value={post.metrics.shares} />
                            <MetricRow label="Comments" value={post.metrics.comments} />
                            <MetricRow label="Link Clicks" value={post.metrics.clicks} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono tabular-nums text-foreground">{formatNumber(value)}</span>
    </div>
  );
}

function formatSchedule(iso: string, status: string) {
  const d = new Date(iso);
  if (status === "PUBLISHED") {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatRelativeFromNow(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "now";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m`;
  const days = Math.floor(hrs / 24);
  return `${days}d ${hrs % 24}h`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}
