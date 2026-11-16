"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SplitStudioProps = {
  title: string;
  description: string;
  stage: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
  stageClassName?: string;
  railClassName?: string;
  meta?: ReactNode;
  brand?: ReactNode;
};

/**
 * Full-viewport component stage: immersive preview, composed control rail.
 */
export function SplitStudio({
  title,
  description,
  stage,
  children,
  actions,
  className,
  stageClassName,
  railClassName,
  meta,
  brand,
}: SplitStudioProps) {
  return (
    <div
      className={cn(
        "grid h-full min-h-0 w-full grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-1",
        className,
      )}
    >
      <section
        className={cn(
          "relative min-h-0 overflow-hidden bg-[#080a08]",
          stageClassName,
        )}
        aria-label="Component preview"
      >
        {/* Soft atmosphere — not a hard vignette chop */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 40%, rgba(200,245,66,0.04) 0%, transparent 55%), linear-gradient(180deg, rgba(5,7,5,0.35) 0%, transparent 18%, transparent 82%, rgba(5,7,5,0.45) 100%)",
          }}
        />
        <div className="absolute inset-0 z-0">{stage}</div>
      </section>

      <aside
        className={cn(
          "flex max-h-[46dvh] min-h-0 flex-col border-t border-white/[0.06] bg-[#0a0c0a] lg:max-h-none lg:border-l lg:border-t-0",
          railClassName,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
          {brand}
          {actions}
        </div>

        <div className="space-y-3 border-b border-white/[0.06] px-5 py-5">
          {meta}
          <h1 className="font-display text-[1.65rem] font-extrabold leading-[1.05] tracking-tight text-[#f2f5ee]">
            {title}
          </h1>
          <p className="text-[13px] leading-relaxed text-fog line-clamp-3">
            {description}
          </p>
        </div>

        {children ? (
          <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-4">{children}</div>
        ) : null}
      </aside>
    </div>
  );
}
