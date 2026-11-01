"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Cpu,
  Bot,
  Database,
  GitBranch,
  Sparkles,
  Bell,
  ArrowDown,
  Layers,
} from "lucide-react";

const LAYERS = [
  {
    id: 1,
    name: "Ingestion & Queue",
    tech: "Telegram Bot + Supabase",
    role: "Send your draft + target time via Telegram → stored as a PENDING row in Supabase.",
    icon: <Bot className="h-5 w-5" />,
    color: "from-sky-500/20 to-sky-500/5 border-sky-500/40 text-sky-300",
    chip: "Layer 01",
    code: 'INSERT INTO posts (content, scheduled_at, status) VALUES (...)',
  },
  {
    id: 2,
    name: "AI Enhancement Core",
    tech: "Google Gemini / Groq API",
    role: "Optional pre-publish pass: rewrite the hook in your top-3 voice, generate hashtags, project CTR uplift.",
    icon: <Sparkles className="h-5 w-5" />,
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-300",
    chip: "Layer 02",
    code: 'gemini.complete({ system: top3_voice, prompt: draft })',
  },
  {
    id: 3,
    name: "Execution & Runner",
    tech: "Python · GitHub Actions cron",
    role: "Scheduled GitHub Actions runner pulls PENDING rows whose scheduled_at ≤ now and posts via each platform's official API.",
    icon: <GitBranch className="h-5 w-5" />,
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/40 text-emerald-300",
    chip: "Layer 03",
    code: 'on: schedule: - cron: "*/5 * * * *"',
  },
  {
    id: 4,
    name: "Persistence & Delivery",
    tech: "Supabase + Telegram notify",
    role: "Update row to PUBLISHED (or FAILED with retry), write analytics event, push a success notification to your phone.",
    icon: <Bell className="h-5 w-5" />,
    color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/40 text-cyan-300",
    chip: "Layer 04",
    code: "UPDATE posts SET status='PUBLISHED' WHERE id=$1",
  },
];

export function ArchitectureDiagram() {
  return (
    <section id="architecture" className="scroll-mt-20">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 mb-4">
          <Layers className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-300">Software Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Four layers working as one
          <span className="block text-muted-foreground text-base font-normal mt-2">
            The system is orchestrated like a full marketing team — every layer hands off cleanly to the next.
          </span>
        </h2>
      </div>

      <Card className="p-6 sm:p-8 bg-card/40 backdrop-blur-sm border-zinc-800/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative">
          {/* Source node */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-4 py-2">
              <Send className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-foreground">
                You send a post via Telegram
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                /schedule "your copy" at 19:00
              </span>
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <ArrowDown className="h-4 w-4 text-zinc-600" />
          </div>

          {/* Layer stack */}
          <div className="space-y-3">
            {LAYERS.map((layer) => (
              <React.Fragment key={layer.id}>
                <div
                  className={`rounded-xl border bg-gradient-to-br ${layer.color} backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-1 flex sm:justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-current bg-current/10">
                        <span className="text-current">{layer.icon}</span>
                      </div>
                    </div>
                    <div className="sm:col-span-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">
                          {layer.chip}
                        </span>
                      </div>
                      <div className="text-base font-semibold text-foreground">
                        {layer.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {layer.role}
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <Badge
                        variant="outline"
                        className="border-zinc-700/60 bg-zinc-900/40 text-zinc-300 font-mono text-[11px]"
                      >
                        {layer.tech}
                      </Badge>
                    </div>
                    <div className="sm:col-span-3">
                      <pre className="rounded-md border border-zinc-800/60 bg-zinc-950/70 p-2 text-[10px] font-mono text-zinc-400 overflow-x-auto scroll-thin">
                        <code>{layer.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                {layer.id < LAYERS.length && (
                  <div className="flex justify-center">
                    <ArrowDown className="h-4 w-4 text-zinc-600" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Result node */}
          <div className="flex justify-center mt-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-emerald-300">
                ✅ Pushed live · notification sent to your phone
              </span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
