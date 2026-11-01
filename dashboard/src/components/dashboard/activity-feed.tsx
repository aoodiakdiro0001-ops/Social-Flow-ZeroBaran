"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Cpu,
  XCircle,
} from "lucide-react";

export type ActivityLogItem = {
  id: string;
  type: string;
  message: string;
  level: "info" | "success" | "warning" | "error";
  postTitle?: string;
  createdAt: string;
};

const ICONS: Record<string, React.ReactNode> = {
  post_scheduled: <Clock className="h-3.5 w-3.5" />,
  post_published: <CheckCircle2 className="h-3.5 w-3.5" />,
  post_failed: <XCircle className="h-3.5 w-3.5" />,
  ai_enhanced: <Sparkles className="h-3.5 w-3.5" />,
  platform_sync: <RefreshCw className="h-3.5 w-3.5" />,
  system_event: <Cpu className="h-3.5 w-3.5" />,
};

const COLORS: Record<string, string> = {
  info: "text-sky-300 bg-sky-500/10 border-sky-500/30",
  success: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  warning: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  error: "text-rose-300 bg-rose-500/10 border-rose-500/30",
};

export function ActivityFeed({ logs }: { logs: ActivityLogItem[] }) {
  return (
    <Card className="flex flex-col h-full bg-card/60 backdrop-blur-sm border-zinc-800/60">
      <div className="flex items-center justify-between gap-2 p-5 pb-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground">Live Activity Log</h3>
        </div>
        <Badge variant="outline" className="border-zinc-700/50 text-zinc-400 gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          streaming
        </Badge>
      </div>
      <ScrollArea className="flex-1 max-h-[24rem] scroll-thin">
        <div className="p-4 space-y-2">
          {logs.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No recent activity.
            </div>
          )}
          {logs.map((log) => {
            const icon = ICONS[log.type] ?? <Activity className="h-3.5 w-3.5" />;
            const colorClass = COLORS[log.level] ?? COLORS.info;
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-lg border border-zinc-800/40 bg-zinc-900/30 p-3 hover:bg-zinc-800/30 transition-colors"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${colorClass}`}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-foreground/90 leading-snug">
                    {log.message}
                  </div>
                  {log.postTitle && (
                    <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      ↳ {log.postTitle}
                    </div>
                  )}
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">
                    {log.type} · {formatRelative(log.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
