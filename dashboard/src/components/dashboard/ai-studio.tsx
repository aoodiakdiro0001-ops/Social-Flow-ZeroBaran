"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Wand2, Hash, MessageSquare, TrendingUp } from "lucide-react";

const SAMPLE_TRANSFORMS = [
  {
    original: "We just shipped a new feature. It schedules posts automatically.",
    enhanced:
      "Stop babysitting your calendar. ZeroBaran ships your posts on time — every time. Try the new auto-scheduler today. ⚡",
    hashtags: ["#BuildInPublic", "#Automation", "#SaaS"],
    delta: "+24% CTR",
    tone: "high-urgency hook",
  },
  {
    original: "Our product helps teams. Try it now.",
    enhanced:
      "47 posts/month. Zero missed slots. One Telegram bot. This is what autonomy looks like for your social presence.",
    hashtags: ["#Productivity", "#OpenSource", "#Growth"],
    delta: "+18% CTR",
    tone: "data-led proof",
  },
  {
    original: "We use AI to improve content.",
    enhanced:
      "Gemini reads your top-3 best posts, learns your voice, then rewrites the next one in that voice — automatically. +24% avg CTR.",
    hashtags: ["#AI", "#PromptEngineering"],
    delta: "+31% CTR",
    tone: "voice-matched rewrite",
  },
];

export function AIStudio() {
  return (
    <Card className="p-5 bg-card/60 backdrop-blur-sm border-zinc-800/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">AI Enhancement Studio</h3>
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300 gap-1">
            <Sparkles className="h-3 w-3" />
            Gemini API
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View all →
        </Button>
      </div>

      <div className="space-y-3">
        {SAMPLE_TRANSFORMS.map((t, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800/60">
              {/* Before */}
              <div className="p-4 bg-zinc-900/60">
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageSquare className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                    Original draft
                  </span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                  &ldquo;{t.original}&rdquo;
                </p>
              </div>

              {/* After */}
              <div className="p-4 bg-gradient-to-br from-amber-500/[0.04] to-zinc-900/40 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-amber-400" />
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 font-mono">
                      {t.tone}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  >
                    {t.delta}
                  </Badge>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {t.enhanced}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  <Hash className="h-3 w-3 text-amber-400/60" />
                  {t.hashtags.map((h) => (
                    <span key={h} className="text-[11px] font-mono text-amber-300/90">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-zinc-800/60">
        <div className="text-[11px] text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-3 w-3 text-emerald-400" />
          avg CTR uplift over generic rewrites: <span className="font-mono text-emerald-300">+24%</span>
        </div>
        <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
          <ArrowRight className="h-3 w-3" />
          prompts/live in the bot
        </div>
      </div>
    </Card>
  );
}
