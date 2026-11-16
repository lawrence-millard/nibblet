"use client";

import {
  UNLUMEN_FULL_DEMO_NAMES,
  UnlumenFullDemo,
  hasFullDemo,
  type UnlumenFullDemoName,
} from "@/components/unlumen/UnlumenFullDemos";
import { SplitStudio } from "@/components/studio/SplitStudio";
import installed from "@/data/unlumen-installed.json";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type CatalogItem = (typeof installed.components)[number];

const DEFAULT_DEMO: UnlumenFullDemoName = hasFullDemo("glow")
  ? "glow"
  : hasFullDemo("apple-switch")
    ? "apple-switch"
    : UNLUMEN_FULL_DEMO_NAMES[0];

function resolveMeta(name: string): CatalogItem | undefined {
  const key = name.replace(/^demo-/, "");
  return (
    installed.components.find((c) => c.name === key) ??
    installed.components.find((c) => c.name.replace(/^demo-/, "") === key)
  );
}

export function UnlumenGallery() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<UnlumenFullDemoName>(DEFAULT_DEMO);

  const liveItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return UNLUMEN_FULL_DEMO_NAMES.filter((name) => {
      if (!hasFullDemo(name)) return false;
      if (!q) return true;
      const meta = resolveMeta(name);
      const importPath =
        meta && "importPath" in meta && typeof meta.importPath === "string"
          ? meta.importPath.toLowerCase()
          : "";
      return (
        name.includes(q) ||
        (meta?.kind ?? "").includes(q) ||
        importPath.includes(q)
      );
    });
  }, [query]);

  const meta = resolveMeta(selected);

  return (
    <SplitStudio
      title={selected}
      description={
        meta && "importPath" in meta && meta.importPath
          ? `Live Unlumen demo · ${meta.importPath}`
          : "Full live Unlumen preview — immersive stage, no cropped cards."
      }
      meta={
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog-muted">
          {installed.installedCount} installs · {UNLUMEN_FULL_DEMO_NAMES.length} live ·{" "}
          {meta?.kind ?? "ui"}
        </p>
      }
      actions={
        <>
          <a
            href="/components"
            className="inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-xs font-medium text-[#f2f5ee] transition hover:border-lime/40 hover:text-lime"
          >
            Nibble components
          </a>
          <span className="inline-flex h-9 items-center rounded-full bg-lime/15 px-3 font-mono text-[11px] uppercase tracking-wide text-lime">
            free · no .env
          </span>
        </>
      }
      stage={
        <div className="flex h-full min-h-[55vh] w-full items-center justify-center p-4 sm:p-8 lg:min-h-[calc(100dvh-3.5rem)]">
          <div className="flex w-full max-w-4xl items-center justify-center">
            <UnlumenFullDemo name={selected} />
          </div>
        </div>
      }
    >
      <label className="block">
        <span className="sr-only">Search demos</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search demos…"
          className="w-full rounded-lg border border-white/10 bg-charcoal-elevated px-3 py-2 text-sm text-[#f2f5ee] outline-none ring-lime/40 placeholder:text-fog-muted focus:ring-2"
        />
      </label>
      <ul
        className="max-h-[min(52vh,420px)] space-y-0.5 overflow-y-auto pr-1 lg:max-h-none lg:flex-1"
        role="listbox"
        aria-label="Unlumen demos"
      >
        {liveItems.map((name) => {
          const item = resolveMeta(name);
          return (
            <li key={name}>
              <button
                type="button"
                role="option"
                aria-selected={selected === name}
                onClick={() => setSelected(name)}
                className={cn(
                  "w-full rounded-lg px-3 py-2.5 text-left transition",
                  selected === name
                    ? "bg-lime/15 text-[#f2f5ee]"
                    : "text-fog hover:bg-white/5 hover:text-[#f2f5ee]",
                )}
              >
                <span className="block font-display text-sm font-bold">{name}</span>
                <span className="mt-0.5 block font-mono text-[10px] text-fog-muted">
                  {item?.kind ?? "demo"}
                  {"importPath" in (item ?? {}) &&
                  (item as { importPath?: string }).importPath
                    ? ` · ${(item as { importPath?: string }).importPath}`
                    : ""}
                </span>
              </button>
            </li>
          );
        })}
        {liveItems.length === 0 ? (
          <li className="px-3 py-4 text-sm text-fog-muted">No demos match.</li>
        ) : null}
      </ul>
    </SplitStudio>
  );
}
