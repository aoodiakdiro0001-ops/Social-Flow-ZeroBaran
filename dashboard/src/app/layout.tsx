import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Social-Flow ZeroBaran — Autonomous Social Media Engine",
  description:
    "The fully-free intelligent self-operating system for scheduling, publishing, and analyzing social media content across Telegram, X, LinkedIn, and Facebook. Zero vendors. Total sovereignty.",
  keywords: [
    "Social-Flow ZeroBaran",
    "social media automation",
    "GitHub Actions scheduler",
    "Supabase",
    "Telegram bot",
    "Gemini API",
    "open source social media tool",
    "free social media scheduler",
  ],
  authors: [{ name: "Baran Avisat", url: "mailto:Baranavisat@gmail.com" }],
  applicationName: "Social-Flow ZeroBaran",
  openGraph: {
    title: "Social-Flow ZeroBaran — Autonomous Social Media Engine",
    description:
      "Schedule, publish, and analyze across every platform — zero cost, full sovereignty, AI-enhanced.",
    siteName: "Social-Flow ZeroBaran",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social-Flow ZeroBaran",
    description: "Autonomous social media engine — 100% free tech stack.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
