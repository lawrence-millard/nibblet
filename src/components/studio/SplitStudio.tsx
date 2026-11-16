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
};

/**
 * Nibblet-style component stage: immersive preview left, slim control rail right.
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
}: SplitStudioProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col lg:flex-row lg:items-stretch",
        "min-h-[calc(100dvh-3.5rem)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex min-h-[55vh] flex-1 items-center justify-center overflow-hidden",
          "bg-[#070907] lg:min-h-[calc(100dvh-3.5rem)]",
          stageClassName,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div className="relative z-0 flex h-full w-full items-center justify-center">
          {stage}
        </div>
      </div>

      <aside
        className={cn(
          "flex w-full shrink-0 flex-col gap-5 border-t border-white/5 bg-charcoal/95 px-5 py-6",
          "lg:w-[min(360px,100%)] lg:border-l lg:border-t-0 lg:px-6 lg:py-8",
          railClassName,
        )}
      >
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#f2f5ee]">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-fog">{description}</p>
          {meta}
        </div>

        {children ? <div className="flex min-h-0 flex-1 flex-col gap-3">{children}</div> : null}

        {actions ? <div className="mt-auto flex flex-wrap gap-2 pt-2">{actions}</div> : null}
      </aside>
    </div>
  );
}
