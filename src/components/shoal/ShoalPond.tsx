"use client";

import { Shoal } from "@/components/nibble/shoal/Component";
import { cn } from "@/lib/utils";

export type ShoalPondProps = {
  className?: string;
  /** Maps roughly to koi count (0–10). */
  density?: number;
  /** Kept for API compat; real Shoal uses engine speed settings. */
  speed?: number;
  compact?: boolean;
  seed?: number;
  appearance?: "auto" | "dark" | "light";
  height?: number | string;
};

/** Thin wrapper around the real Nibble Shoal single-file export. */
export function ShoalPond({
  className,
  density = 1,
  compact = false,
  seed = 7,
  appearance = "dark",
  height,
}: ShoalPondProps) {
  const count = Math.max(1, Math.min(10, Math.round(2 + density * 3)));
  const resolvedHeight = height ?? (compact ? 320 : "100%");

  return (
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <Shoal
        count={count}
        seed={seed}
        appearance={appearance}
        height={resolvedHeight}
      />
    </div>
  );
}
