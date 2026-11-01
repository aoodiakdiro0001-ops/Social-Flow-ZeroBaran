"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Radio, ShieldCheck, Zap, Activity, Github, Cpu, Database } from "lucide-react";

type Props = {
  nextPost: {
    title: string;
    scheduledAt: string;
    platforms: string[];
  } | null;
  systemOnline: boolean;
};

function useCountdown(targetIso: string | null) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!targetIso) return null;
  const target = new Date(targetIso).getTime();
  const diff = target - now;
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, overdue: true };
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { hours, minutes, seconds, overdue: false };
}

export function HeroSection({ nextPost, systemOnline }: Props) {
  const cd = useCountdown(nextPost?.scheduledAt ?? null);

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      {/* Floating gradient orbs */}
      <div
        aria-hidden
        className="absolute -top-32 left-1/4 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ background: "oklch(0.78 0.18 165)" }}
      />
      <div
        aria-hidden
        className="absolute -top-20 right-1/4 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: "oklch(0.78 0.16 200)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-12">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                ZeroBaran Labs // Innovation Registry #018
              </div>
              <div className="text-sm font-semibold text-foreground/90">
                Social-Flow ZeroBaran
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`gap-1.5 px-2.5 py-1 ${
                systemOnline
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-300"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${systemOnline ? "bg-emerald-400" : "bg-amber-400"} opacity-75 animate-ping`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${systemOnline ? "bg-emerald-400" : "bg-amber-400"}`} />
              </span>
              {systemOnline ? "System Online" : "Degraded"}
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-2.5 py-1 border-zinc-700/50 bg-zinc-900/40 text-zinc-300">
              <Github className="h-3 w-3" />
              v1.0.0
            </Badge>
          </div>
        </div>

        {/* Main hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">
                100% Free Tech Stack · Sovereign by Design
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              The Autonomous
              <br />
              <span className="bg-gradient-to-br from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Social Media Engine
              </span>
              <br />
              that runs itself.
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Schedule once across Telegram, X, LinkedIn &amp; Facebook. ZeroBaran
              publishes at the perfect moment, refines copy with Gemini, and
              reports back to your phone — without paid tools and without giving
              your data to anyone.
            </p>

            {/* Feature chips */}
            <div className="mt-7 flex flex-wrap gap-2">
              <FeatureChip icon={<Zap className="h-3.5 w-3.5" />} label="Zero-Touch Publishing" />
              <FeatureChip icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Full Data Sovereignty" />
              <FeatureChip icon={<Cpu className="h-3.5 w-3.5" />} label="Gemini-Powered Copy" />
              <FeatureChip icon={<Database className="h-3.5 w-3.5" />} label="Supabase Backbone" />
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold px-5 py-2.5 text-sm shadow-lg shadow-emerald-500/20 transition-colors"
              >
                <Activity className="h-4 w-4" />
                Open Live Dashboard
              </a>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 rounded-md border border-zinc-700 hover:border-zinc-500 bg-zinc-900/40 hover:bg-zinc-800/40 text-zinc-200 font-medium px-5 py-2.5 text-sm transition-colors"
              >
                View Architecture
              </a>
              <a
                href="#deploy"
                className="inline-flex items-center gap-2 rounded-md text-zinc-400 hover:text-zinc-200 font-medium px-2 py-2.5 text-sm transition-colors"
              >
                Deploy guide →
              </a>
            </div>
          </div>

          {/* Next-post countdown card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 to-zinc-950/60 backdrop-blur-sm p-6 shadow-2xl">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span className="text-sm font-mono uppercase tracking-wider text-emerald-300">
                    Next Auto-Publish
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  GitHub Actions · cron
                </span>
              </div>

              {cd ? (
                <div className="mt-5 flex items-center gap-2 sm:gap-3">
                  <TimeBlock label="hrs" value={cd.hours} />
                  <span className="text-3xl font-bold text-zinc-600">:</span>
                  <TimeBlock label="min" value={cd.minutes} />
                  <span className="text-3xl font-bold text-zinc-600">:</span>
                  <TimeBlock label="sec" value={cd.seconds} />
                </div>
              ) : (
                <div className="mt-5 text-2xl font-mono text-muted-foreground">
                  --:--:--
                </div>
              )}

              {nextPost ? (
                <>
                  <div className="mt-5 text-sm font-semibold text-foreground line-clamp-2">
                    {nextPost.title}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {nextPost.platforms.slice(0, 4).map((p) => (
                        <span
                          key={p}
                          className="rounded-md border border-zinc-700/60 bg-zinc-900/60 px-2 py-0.5 text-[11px] font-mono text-zinc-300"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {new Date(nextPost.scheduledAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </>
              ) : (
                <div className="mt-5 text-sm text-muted-foreground">
                  No pending posts in the queue.
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Runner polling every 5 min · Supabase synced
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-950" fill="none">
        <path
          d="M4 6h16M4 12h10M4 18h16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="18" cy="12" r="2.2" fill="currentColor" />
      </svg>
      <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-zinc-950 border-2 border-emerald-400 flex items-center justify-center">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-ring" />
      </span>
    </div>
  );
}

function FeatureChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-300">
      <span className="text-emerald-400">{icon}</span>
      {label}
    </span>
  );
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[3.5rem] sm:min-w-[4rem] rounded-lg border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-zinc-900/60 px-2 py-2 text-center">
        <span className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-emerald-300">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
