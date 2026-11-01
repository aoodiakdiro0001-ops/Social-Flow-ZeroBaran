"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  Code2,
  Sparkles,
  Database,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

const STACK = [
  {
    role: "Execution & Scheduling Engine",
    tech: "GitHub Actions",
    icon: <GitBranch className="h-5 w-5" />,
    color: "text-zinc-300 border-zinc-600/40 bg-zinc-500/10",
    desc: "Free cloud runner executes the queue check + publishing step on cron. No servers, no uptime costs.",
    free: "2,000 min/mo free",
  },
  {
    role: "Core Logic & Posting Engine",
    tech: "Python · HTTPX",
    icon: <Code2 className="h-5 w-5" />,
    color: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    desc: "Async client calls each platform API directly, posts text + media, parses responses, retries on transient errors.",
    free: "100% open source",
  },
  {
    role: "AI Optimization Brain",
    tech: "Gemini · Groq API",
    icon: <Sparkles className="h-5 w-5" />,
    color: "text-amber-300 border-amber-500/40 bg-amber-500/10",
    desc: "Suggests best posting slots, rewrites hooks in your top-3 voice, generates hashtags, projects CTR uplift.",
    free: "Free tier generous",
  },
  {
    role: "Database & Timeline Log",
    tech: "Supabase (PostgreSQL)",
    icon: <Database className="h-5 w-5" />,
    color: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    desc: "Source-of-truth for the queue, post states, engagement events, and the activity log. Auth + RLS built in.",
    free: "500MB · 50k MAU",
  },
  {
    role: "Control Channel & UI",
    tech: "Telegram Bot · Web Dashboard",
    icon: <Smartphone className="h-5 w-5" />,
    color: "text-sky-300 border-sky-500/40 bg-sky-500/10",
    desc: "Send drafts from your phone, get push confirmations, and browse this dashboard for analytics + scheduling.",
    free: "Unlimited messages",
  },
];

export function TechStackGrid() {
  return (
    <section className="scroll-mt-20">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 mb-3">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-300">100% Free Tech Stack</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          No subscriptions. No vendor lock-in.
          <span className="block text-muted-foreground text-base font-normal mt-2">
            Every component runs on a free tier. Your data stays in your Supabase project, never sold or shared.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STACK.map((s) => (
          <Card
            key={s.role}
            className="p-5 bg-card/60 backdrop-blur-sm border-zinc-800/60 hover:border-zinc-700 transition-colors group relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors" />
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${s.color}`}
              >
                {s.icon}
              </div>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono"
              >
                {s.free}
              </Badge>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-1">
              {s.role}
            </div>
            <div className="text-base font-semibold text-foreground mb-2">
              {s.tech}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.desc}
            </p>
          </Card>
        ))}

        {/* Total cost card */}
        <Card className="p-5 bg-gradient-to-br from-emerald-500/[0.08] to-zinc-900/40 border-emerald-500/30 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-8 -right-8 h-32 w-32 rounded-full blur-2xl opacity-30"
            style={{ background: "#10b981" }}
          />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-mono mb-1">
              Total cost
            </div>
            <div className="text-5xl font-bold tabular-nums text-emerald-300">
              $0
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              vs $480–$2,400/yr for comparable paid scheduling suites.
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300/80">
              {"// Sovereign by design"}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
