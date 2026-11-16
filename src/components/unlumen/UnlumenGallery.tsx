"use client";

import { useMemo, useState } from "react";
import installed from "@/data/unlumen-installed.json";
import {
  UNLUMEN_FULL_DEMO_NAMES,
  UnlumenFullDemo,
  hasFullDemo,
} from "@/components/unlumen/UnlumenFullDemos";

type CatalogItem = (typeof installed.components)[number];

const KIND_ORDER = ["ui", "primitive", "hook", "lib", "demo"] as const;

const TALL_DEMOS = new Set([
  "pixel-liquid-bg",
  "aurora-bars",
  "vertical-marquee",
  "sidebar-001",
  "orbital-image-wheel",
  "perspective-flow",
  "cursor-image-trail",
  "page-transition",
  "matrix",
  "matrix-image",
  "video-ambient",
  "progressive-blur",
  "dock",
  "command-menu",
  "hover-feature-cards",
]);

export function UnlumenGallery() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof KIND_ORDER)[number] | "all" | "live">(
    "live",
  );

  const displayItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byName = new Map<string, CatalogItem>();

    for (const item of installed.components) {
      const key = item.name.replace(/^demo-/, "");
      const existing = byName.get(key);
      if (
        !existing ||
        (existing.name.startsWith("demo-") && !item.name.startsWith("demo-"))
      ) {
        byName.set(
          key,
          item.name.startsWith("demo-") ? { ...item, name: key } : item,
        );
      }
    }

    return [...byName.values()].filter((item) => {
      if (kind === "live" && !hasFullDemo(item.name)) return false;
      if (kind !== "live" && kind !== "all" && item.kind !== kind) return false;
      if (!q) return true;
      return item.name.includes(q);
    });
  }, [query, kind]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-fog-muted">
            {installed.installedCount} free installs · {UNLUMEN_FULL_DEMO_NAMES.length}{" "}
            live demos · {installed.failed.length} skipped
          </p>
          <p className="text-sm text-fog">
            Showing {displayItems.length}. Live demos use the official Unlumen
            preview stages — full height, no cropped boxes.
          </p>
        </div>
        <label className="block w-full max-w-xs">
          <span className="sr-only">Filter components</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name…"
            className="w-full rounded-full border border-white/10 bg-charcoal-elevated px-4 py-2 text-sm text-[#f2f5ee] outline-none ring-lime/40 placeholder:text-fog-muted focus:ring-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Kind">
        {(["live", "all", ...KIND_ORDER] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            onClick={() => setKind(k)}
            className={
              kind === k
                ? "rounded-full bg-lime px-3 py-1.5 font-display text-sm font-bold text-charcoal"
                : "rounded-full border border-white/10 px-3 py-1.5 text-sm text-fog hover:bg-white/5 hover:text-[#f2f5ee]"
            }
          >
            {k}
          </button>
        ))}
      </div>

      <ul className="grid gap-6">
        {displayItems.map((item) => (
          <GalleryCard key={item.name} item={item} />
        ))}
      </ul>
    </div>
  );
}

function GalleryCard({ item }: { item: CatalogItem }) {
  const live = hasFullDemo(item.name);
  const tall = TALL_DEMOS.has(item.name);

  return (
    <li
      id={item.name}
      className="scroll-mt-24 overflow-visible rounded-3xl border border-white/10 bg-charcoal-elevated/90 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-start justify-between gap-3 border-b border-white/5 px-5 py-4">
        <div className="min-w-0 space-y-1">
          <h2 className="font-display text-lg font-bold tracking-tight text-[#f2f5ee]">
            {item.name}
          </h2>
          <p className="font-mono text-[11px] text-fog-muted">
            {item.kind}
            {"importPath" in item && item.importPath
              ? ` · ${item.importPath}`
              : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-lime/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-lime">
          {live ? "live demo" : "source"}
        </span>
      </div>

      {live ? (
        <div
          className={`relative w-full overflow-visible bg-[#0a0d0a] ${
            tall ? "min-h-[420px]" : "min-h-[280px]"
          }`}
        >
          <div className="flex h-full min-h-[inherit] w-full items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-4xl">
              <UnlumenFullDemo name={item.name} />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 py-6 text-sm text-fog">
          Installed free component
          {"file" in item && item.file ? (
            <>
              {" "}
              at <code className="text-lime-dim">src/{item.file}</code>
            </>
          ) : (
            <> under <code className="text-lime-dim">src/components/unlumen-ui</code>.</>
          )}
        </div>
      )}
    </li>
  );
}
