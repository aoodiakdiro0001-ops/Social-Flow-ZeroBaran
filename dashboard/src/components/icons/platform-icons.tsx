import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

/** Telegram glyph */
export function TelegramIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.173-.18 3.073-2.814 3.13-3.05.008-.033.011-.154-.058-.218s-.174-.042-.249-.025c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.89-.663 3.498-1.524 5.83-2.529 6.997-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

/** X / Twitter glyph */
export function XIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** LinkedIn glyph */
export function LinkedInIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Facebook glyph */
export function FacebookIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/** Brand-color map for each platform */
export const PLATFORM_META: Record<string, {
  label: string;
  Icon: React.FC<IconProps>;
  color: string;     // hex
  ring: string;     // tailwind ring class
  text: string;     // tailwind text class
  bg: string;       // tailwind bg class
  glow: string;     // tailwind shadow class
}> = {
  telegram: {
    label: "Telegram",
    Icon: TelegramIcon,
    color: "#29B6F6",
    ring: "ring-sky-500/40",
    text: "text-sky-300",
    bg: "bg-sky-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(56,189,248,0.5)]",
  },
  x: {
    label: "X / Twitter",
    Icon: XIcon,
    color: "#E7E9EA",
    ring: "ring-zinc-300/40",
    text: "text-zinc-200",
    bg: "bg-zinc-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(244,244,245,0.3)]",
  },
  linkedin: {
    label: "LinkedIn",
    Icon: LinkedInIcon,
    color: "#0A66C2",
    ring: "ring-blue-500/40",
    text: "text-blue-300",
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(96,165,250,0.5)]",
  },
  facebook: {
    label: "Facebook",
    Icon: FacebookIcon,
    color: "#1877F2",
    ring: "ring-blue-500/40",
    text: "text-blue-300",
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(96,165,250,0.5)]",
  },
};

export function getPlatformMeta(name: string) {
  return (
    PLATFORM_META[name] ?? {
      label: name,
      Icon: XIcon,
      color: "#888",
      ring: "ring-zinc-500/40",
      text: "text-zinc-400",
      bg: "bg-zinc-500/10",
      glow: "",
    }
  );
}
