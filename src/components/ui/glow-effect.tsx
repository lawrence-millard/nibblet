"use client";

import { cn } from "@/lib/utils";

export type GlowEffectProps = {
  colors?: string[];
  mode?: "rotate" | "pulse" | "breathe" | "colorShift" | "flowHorizontal";
  blur?: "softest" | "soft" | "medium" | "strong" | "stronger" | "strongest";
  duration?: number;
  scale?: number;
  className?: string;
};

const blurMap = {
  softest: "8px",
  soft: "16px",
  medium: "24px",
  strong: "36px",
  stronger: "48px",
  strongest: "64px",
} as const;

/** Lightweight free stand-in for Unlumen GlowEffect (not in free registry). */
export function GlowEffect({
  colors = ["#c8f542", "#a8d12e", "#6b7368", "#c8f542"],
  blur = "strong",
  duration = 5,
  scale = 1,
  className,
}: GlowEffectProps) {
  const gradient = `conic-gradient(from 0deg, ${colors.join(", ")})`;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blurMap[blur]})`,
        background: gradient,
        animation: `nibblet-glow-spin ${duration}s linear infinite`,
        opacity: 0.55,
      }}
    />
  );
}
