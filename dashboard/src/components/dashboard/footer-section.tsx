"use client";

import * as React from "react";
import { Heart, Shield, Github, Mail, Globe, Code2, MessageCircle, User } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="mt-20 border-t border-zinc-800/60 bg-zinc-950/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Top strip — innovation registry record */}
        <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.04] via-zinc-900/40 to-cyan-500/[0.04] p-5 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-300 mb-1">
                Innovation Registry · Record #018
              </div>
              <div className="text-base font-semibold text-foreground">
                Social-Flow ZeroBaran — Autonomous Social Media Engine
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Saved to the software innovation registry to guarantee originality &amp; prevent duplication.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                  status
                </div>
                <div className="text-sm font-semibold text-emerald-200">registered</div>
              </div>
              <div className="rounded-md border border-zinc-700/60 bg-zinc-900/40 px-3 py-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  version
                </div>
                <div className="text-sm font-semibold text-foreground">v1.0.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-950" fill="none">
                  <path
                    d="M4 6h16M4 12h10M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="18" cy="12" r="2.2" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Social-Flow ZeroBaran
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  by ZeroBaran Labs
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              The intelligent self-operating system for social media scheduling,
              publishing, and analytics — built entirely on free, open, sovereign
              infrastructure. Zero cost. Zero vendors. Total control.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <SocialLink icon={<Mail className="h-3.5 w-3.5" />} label="Email" href="mailto:Baranavisat@gmail.com" />
              <SocialLink icon={<MessageCircle className="h-3.5 w-3.5" />} label="WhatsApp" href="https://wa.me/905313263722" />
              <SocialLink icon={<Globe className="h-3.5 w-3.5" />} label="Docs" href="#architecture" />
            </div>
          </div>

          {/* Project info */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-3">
              Project
            </div>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>
                <a href="#dashboard" className="hover:text-emerald-300 transition-colors">
                  Live Dashboard
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-emerald-300 transition-colors">
                  Architecture
                </a>
              </li>
              <li>
                <a href="#deploy" className="hover:text-emerald-300 transition-colors">
                  Deploy Guide
                </a>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">Changelog</span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">Roadmap</span>
              </li>
            </ul>
          </div>

          {/* Support / contact owner */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-3">
              Owner &amp; Support
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <User className="h-3 w-3" />
                Author
              </div>
              <div className="text-foreground font-semibold">
                Baran Avisat
              </div>

              <div className="text-muted-foreground mt-3 flex items-center gap-1.5">
                <Mail className="h-3 w-3" />
                Email
              </div>
              <a
                href="mailto:Baranavisat@gmail.com"
                className="font-mono text-emerald-300 text-xs hover:text-emerald-200 transition-colors break-all"
              >
                Baranavisat@gmail.com
              </a>

              <div className="text-muted-foreground mt-3 flex items-center gap-1.5">
                <MessageCircle className="h-3 w-3" />
                WhatsApp
              </div>
              <a
                href="https://wa.me/905313263722"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-emerald-300 text-xs hover:text-emerald-200 transition-colors"
              >
                +90 531 326 3722
              </a>

              <div className="pt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Shield className="h-3 w-3 text-emerald-400" />
                Sovereign deployment
              </div>
            </div>
          </div>
        </div>

        {/* Copyright strip */}
        <div className="pt-6 border-t border-zinc-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span>© {new Date().getFullYear()} Baran Avisat · Social-Flow ZeroBaran. All rights reserved.</span>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <span>Innovation Registry Record #018</span>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <span className="font-mono">v1.0.0</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>Built with</span>
            <Code2 className="h-3 w-3 text-emerald-400" />
            <span className="font-mono text-emerald-300">100% free stack</span>
            <Heart className="h-3 w-3 text-rose-400 fill-rose-400/50" />
          </div>
        </div>

        {/* License note */}
        <div className="mt-4 text-[10px] text-muted-foreground font-mono leading-relaxed">
          {"// This project, its source code, documentation, and visual identity are the intellectual property of Baran Avisat (Baranavisat@gmail.com). Unauthorized reproduction, redistribution, or claiming authorship is prohibited without explicit written permission. To license or fork for commercial use, contact the author via email or WhatsApp."}
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, label, href = "#" }: { icon: React.ReactNode; label: string; href?: string }) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto");
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700/60 bg-zinc-900/40 hover:border-emerald-500/40 hover:bg-emerald-500/10 px-2.5 py-1 text-[11px] text-zinc-300 hover:text-emerald-300 transition-colors"
    >
      {icon}
      {label}
    </a>
  );
}
