"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPlatformMeta, PLATFORM_META } from "@/components/icons/platform-icons";
import { RefreshCw, Server, Users, Activity } from "lucide-react";

export type PlatformInfo = {
  name: string;
  displayName: string;
  connected: boolean;
  health: "ok" | "degraded" | "down";
  followers: number;
  postsCount: number;
  lastSyncAt: string | null;
};

export function PlatformStatus({ platforms }: { platforms: PlatformInfo[] }) {
  return (
    <Card className="flex flex-col bg-card/60 backdrop-blur-sm border-zinc-800/60">
      <div className="flex items-center justify-between gap-2 p-5 pb-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground">Platform Connections</h3>
        </div>
        <Badge variant="outline" className="border-zinc-700/50 text-zinc-400 gap-1">
          <Activity className="h-3 w-3" />
          live
        </Badge>
      </div>

      <div className="divide-y divide-zinc-800/40">
        {platforms.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No platforms configured.
          </div>
        )}
        {platforms.map((p) => {
          const meta = getPlatformMeta(p.name);
          const Icon = meta.Icon;
          const healthDot =
            p.health === "ok"
              ? "bg-emerald-400"
              : p.health === "degraded"
              ? "bg-amber-400"
              : "bg-rose-400";
          return (
            <div key={p.name} className="p-4 hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border ${meta.bg} ${meta.text} border-zinc-700/40 ${meta.glow}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {p.displayName}
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full ${healthDot} opacity-75 animate-ping`}
                      />
                      <span className={`relative inline-flex h-2 w-2 rounded-full ${healthDot}`} />
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    @{p.name} · {p.connected ? "connected" : "disconnected"}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                    <div>
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                        <Users className="h-2.5 w-2.5" />
                        Followers
                      </div>
                      <div className="text-sm font-semibold tabular-nums text-foreground">
                        {formatNumber(p.followers)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                        <RefreshCw className="h-2.5 w-2.5" />
                        Posts
                      </div>
                      <div className="text-sm font-semibold tabular-nums text-foreground">
                        {formatNumber(p.postsCount)}
                      </div>
                    </div>
                  </div>

                  {p.lastSyncAt && (
                    <div className="mt-2 text-[10px] font-mono text-muted-foreground">
                      last sync: {formatRelative(p.lastSyncAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto p-3 border-t border-zinc-800/60 text-[11px] text-muted-foreground font-mono">
        {platforms.filter((p) => p.health === "ok").length}/{platforms.length} healthy
        {platforms.some((p) => p.health === "degraded") && (
          <span className="text-amber-300 ml-2">
            · {platforms.filter((p) => p.health === "degraded").length} degraded
          </span>
        )}
      </div>
    </Card>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
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

// Re-export to satisfy tree-shaking warnings on unused imports
export const _icons = { PLATFORM_META };
