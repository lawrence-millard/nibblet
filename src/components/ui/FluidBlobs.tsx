"use client";

import { cn } from "@/lib/utils";

export type FluidBlobOrigin = { x: number; y: number };

export type FluidBlobsProps = {
  lightColors?: string[];
  darkColors?: string[];
  origins?: FluidBlobOrigin[];
  margin?: number;
  blur?: number;
  className?: string;
};

/** Lightweight free stand-in for Unlumen FluidBlobs (not in free registry). */
export function FluidBlobs({
  lightColors = ["#c8f542", "#a8d12e", "#6b7368", "#e8ebe6"],
  darkColors,
  origins = [
    { x: 30, y: 20 },
    { x: 70, y: 40 },
    { x: 50, y: 70 },
  ],
  blur = 40,
  className,
}: FluidBlobsProps) {
  const colors = darkColors?.length ? darkColors : lightColors;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {origins.map((origin, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-70"
          style={{
            left: `${origin.x}%`,
            top: `${origin.y}%`,
            width: "45%",
            height: "45%",
            transform: "translate(-50%, -50%)",
            background: colors[i % colors.length],
            filter: `blur(${blur}px)`,
          }}
        />
      ))}
    </div>
  );
}
