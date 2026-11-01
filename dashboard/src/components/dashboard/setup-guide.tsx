"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Rocket, Terminal, Database, Cpu } from "lucide-react";

const STEPS = [
  {
    n: 1,
    title: "Fork the repo & set secrets",
    body: "Fork zerobaran-labs/social-flow into your GitHub account. Add these repository secrets:",
    code: `# Repository → Settings → Secrets and variables → Actions
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGc...
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=-1001234567890
GEMINI_API_KEY=AIza...
X_BEARER_TOKEN=...
LINKEDIN_ACCESS_TOKEN=...`,
  },
  {
    n: 2,
    title: "Create Supabase project",
    body: "Create a free Supabase project. Run the schema SQL to provision the posts, daily_stats, platforms, analytics_events and activity_log tables.",
    code: `-- Run in Supabase SQL editor
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  platforms jsonb default '[]',
  status text default 'PENDING',
  scheduled_at timestamptz not null,
  published_at timestamptz,
  enhanced_content text,
  hashtags jsonb,
  metrics jsonb default '{}'
);
-- + indexes on (status, scheduled_at)`,
  },
  {
    n: 3,
    title: "Deploy the GitHub Actions runner",
    body: "Push the workflow file to .github/workflows/zerobaran-runner.yml — every 5 minutes it picks up due posts.",
    code: `name: ZeroBaran Runner
on:
  schedule:
    - cron: "*/5 * * * *"
  workflow_dispatch:
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r requirements.txt
      - run: python runner.py`,
  },
  {
    n: 4,
    title: "Connect your Telegram bot",
    body: "Talk to @BotFather to create a bot, set the token as a secret, and start sending posts with the /schedule command.",
    code: `/schedule
content: "Shipping ZeroBaran v1.0 today 🚀"
platforms: telegram,x,linkedin
at: 2026-10-30 19:00

→ stored as PENDING → picked up by cron → published`,
  },
];

export function SetupGuide() {
  return (
    <section id="deploy" className="scroll-mt-20">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 mb-3">
          <Rocket className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-300">Deploy in 15 minutes</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          From fork to first auto-publish
          <span className="block text-muted-foreground text-base font-normal mt-2">
            Four steps. Zero paid accounts. The entire pipeline is yours.
          </span>
        </h2>
      </div>

      <Card className="bg-card/40 backdrop-blur-sm border-zinc-800/60 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800/40">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-card/60 p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-sm font-bold">
                  {s.n}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
              <CodeBlock code={s.code} />
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResourceCard
          icon={<Terminal className="h-4 w-4" />}
          title="Python runner.py"
          desc="The execution engine. Pulls due posts, posts to each platform API, updates Supabase."
          file="download/social-flow-zerobaran/runner.py"
        />
        <ResourceCard
          icon={<Database className="h-4 w-4" />}
          title="schema.sql"
          desc="Supabase schema with posts, daily_stats, platforms, analytics_events, activity_log tables."
          file="download/social-flow-zerobaran/schema.sql"
        />
        <ResourceCard
          icon={<Cpu className="h-4 w-4" />}
          title="zerobaran-runner.yml"
          desc="GitHub Actions workflow running every 5 minutes — the free cron replacement."
          file="download/social-flow-zerobaran/.github/workflows/zerobaran-runner.yml"
        />
      </div>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-950/80 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/60 bg-zinc-900/60">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <button
          onClick={copy}
          className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" /> copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> copy
            </>
          )}
        </button>
      </div>
      <pre className="p-3 text-[11px] font-mono text-zinc-300 overflow-x-auto scroll-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ResourceCard({
  icon,
  title,
  desc,
  file,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  file: string;
}) {
  return (
    <Card className="p-4 bg-card/60 border-zinc-800/60 hover:border-zinc-700 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-emerald-400">{icon}</span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{desc}</p>
      <div className="rounded-md bg-zinc-900/60 border border-zinc-800/60 px-2 py-1.5 font-mono text-[11px] text-emerald-300/90 truncate">
        {file}
      </div>
    </Card>
  );
}
