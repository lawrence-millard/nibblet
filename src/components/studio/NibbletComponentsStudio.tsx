"use client";

import { SplitStudio } from "@/components/studio/SplitStudio";
import {
  nibbleCatalog,
  nibbleDemoLoaders,
  type NibbleComponentMeta,
} from "@/components/nibble/registry";
import { cn } from "@/lib/utils";
import {
  Suspense,
  lazy,
  useMemo,
  useState,
  type ComponentType,
} from "react";

const demoCache = new Map<string, ComponentType>();

function loadDemo(id: string): ComponentType {
  const cached = demoCache.get(id);
  if (cached) return cached;
  const loader = nibbleDemoLoaders[id];
  if (!loader) {
    const Missing = () => (
      <p className="px-4 font-mono text-sm text-fog-muted">Missing demo: {id}</p>
    );
    demoCache.set(id, Missing);
    return Missing;
  }
  const LazyDemo = lazy(loader);
  demoCache.set(id, LazyDemo);
  return LazyDemo;
}

function DemoStage({ id, wide }: { id: string; wide?: boolean }) {
  const Demo = loadDemo(id);
  return (
    <div
      className={cn(
        "relative flex h-full min-h-[55vh] w-full items-center justify-center overflow-hidden lg:min-h-[calc(100dvh-3.5rem)]",
        wide && "items-stretch",
      )}
    >
      <Suspense
        fallback={
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-fog-muted">
            Loading {id}…
          </p>
        }
      >
        <div
          className={cn(
            "h-full w-full",
            wide ? "absolute inset-0" : "flex items-center justify-center p-4",
          )}
        >
          <Demo />
        </div>
      </Suspense>
    </div>
  );
}

export function NibbletComponentsStudio() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(nibbleCatalog[0]?.id ?? "shoal");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nibbleCatalog;
    return nibbleCatalog.filter(
      (d: NibbleComponentMeta) =>
        d.name.toLowerCase().includes(q) ||
        d.id.includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q),
    );
  }, [query]);

  const active =
    nibbleCatalog.find((d) => d.id === selected) ?? nibbleCatalog[0];

  if (!active) return null;

  return (
    <SplitStudio
      title={active.name}
      description={active.description}
      meta={
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog-muted">
          Nibble · {active.category} · real source
        </p>
      }
      actions={
        <>
          <a
            href="/unlumen"
            className="inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-xs font-medium text-[#f2f5ee] transition hover:border-lime/40 hover:text-lime"
          >
            Unlumen gallery
          </a>
          <a
            href={`https://nibble.lat/components/${active.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center rounded-full bg-lime px-3 font-display text-xs font-bold text-charcoal transition hover:bg-[#d6ff5c]"
          >
            On nibble.lat
          </a>
        </>
      }
      stage={<DemoStage id={active.id} wide={active.wide || active.id === "shoal"} />}
    >
      <label className="block">
        <span className="sr-only">Search components</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Nibble components…"
          className="w-full rounded-lg border border-white/10 bg-charcoal-elevated px-3 py-2 text-sm text-[#f2f5ee] outline-none ring-lime/40 placeholder:text-fog-muted focus:ring-2"
        />
      </label>
      <ul className="max-h-[min(52vh,420px)] space-y-0.5 overflow-y-auto pr-1 lg:max-h-none lg:flex-1">
        {filtered.map((demo) => (
          <li key={demo.id}>
            <button
              type="button"
              onClick={() => setSelected(demo.id)}
              className={cn(
                "w-full rounded-lg px-3 py-2.5 text-left transition",
                selected === demo.id
                  ? "bg-lime/15 text-[#f2f5ee]"
                  : "text-fog hover:bg-white/5 hover:text-[#f2f5ee]",
              )}
            >
              <span className="block font-display text-sm font-bold">{demo.name}</span>
              <span className="mt-0.5 block text-xs text-fog-muted line-clamp-2">
                {demo.description}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </SplitStudio>
  );
}
