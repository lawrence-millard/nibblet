"use client";

import { useMemo, useState } from "react";
import installed from "@/data/unlumen-installed.json";
import {
  SMOKE_DEMO_NAMES,
  UnlumenSmokeDemo,
} from "@/components/unlumen/UnlumenSmokeDemos";

type CatalogItem = (typeof installed.components)[number];

const KIND_ORDER = ["ui", "primitive", "hook", "lib", "demo"] as const;

export function UnlumenGallery() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof KIND_ORDER)[number] | "all">("ui");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return installed.components.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (!q) return true;
      return item.name.includes(q);
    });
  }, [query, kind]);

  const smokeSet = useMemo(() => new Set<string>(SMOKE_DEMO_NAMES), []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-fog-muted">
            {installed.installedCount} free installs · {installed.failed.length}{" "}
            skipped
          </p>
          <p className="text-sm text-fog">
            Showing {items.length} of {installed.components.length}. Interactive
            smoke demos for a lightweight subset; others are import-listed.
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
        {(["all", ...KIND_ORDER] as const).map((k) => (
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

      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <GalleryCard
            key={item.name}
            item={item}
            hasDemo={smokeSet.has(item.name)}
          />
        ))}
      </ul>
    </div>
  );
}

function GalleryCard({
  item,
  hasDemo,
}: {
  item: CatalogItem;
  hasDemo: boolean;
}) {
  return (
    <li
      id={item.name}
      className="scroll-mt-24 space-y-3 rounded-2xl border border-white/10 bg-charcoal-elevated/80 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h2 className="font-display text-base font-bold tracking-tight text-[#f2f5ee]">
            {item.name}
          </h2>
          <p className="font-mono text-[11px] text-fog-muted">
            {item.kind}
            {"importPath" in item && item.importPath
              ? ` · ${item.importPath}`
              : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-fog">
          {hasDemo ? "demo" : "listed"}
        </span>
      </div>

      {hasDemo ? (
        <div className="flex min-h-16 items-center justify-center rounded-xl border border-dashed border-white/10 bg-charcoal/60 p-4">
          <UnlumenSmokeDemo name={item.name} />
        </div>
      ) : (
        <p className="text-sm text-fog">
          Installed free component
          {"file" in item && item.file ? (
            <>
              {" "}
              at <code className="text-lime-dim">src/{item.file}</code>
            </>
          ) : (
            <> (source on disk under unlumen-ui).</>
          )}
        </p>
      )}
    </li>
  );
}
