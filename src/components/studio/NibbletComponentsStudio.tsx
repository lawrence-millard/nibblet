"use client";

import {
  kitCatalog,
  kitDemoLoaders,
  type KitComponentMeta,
} from "@/components/kit/registry";
import { DemoErrorBoundary } from "@/components/studio/DemoErrorBoundary";
import { SplitStudio } from "@/components/studio/SplitStudio";
import { cn } from "@/lib/utils";
import {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";

const demoCache = new Map<string, ComponentType>();

function loadDemo(id: string): ComponentType {
  const cached = demoCache.get(id);
  if (cached) return cached;
  const loader = kitDemoLoaders[id];
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

function isBleed(meta: KitComponentMeta) {
  return (
    meta.wide ||
    meta.id === "shoal" ||
    meta.id === "abyss-wallpaper" ||
    meta.id === "glyphblue" ||
    meta.category === "Backgrounds"
  );
}

const ShoalBleed = lazy(() =>
  import("@/components/kit/shoal/Component").then((m) => ({
    default: function ShoalBleedDemo() {
      return (
        <m.Shoal
          count={5}
          seed={7}
          appearance="dark"
          height="100%"
        />
      );
    },
  })),
);

function DemoStage({ id, bleed }: { id: string; bleed: boolean }) {
  const Demo = id === "shoal" ? ShoalBleed : loadDemo(id);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <DemoErrorBoundary demoId={id}>
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-3">
              <span className="h-1.5 w-16 overflow-hidden rounded-sm bg-white/10">
                <span className="block h-full w-1/2 animate-pulse bg-lime/70" />
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog-muted">
                Loading
              </p>
            </div>
          }
        >
          <div
            className={cn(
              "studio-stage h-full w-full animate-[studio-in_420ms_ease-out]",
              bleed
                ? "studio-stage--bleed absolute inset-0"
                : "flex items-center justify-center overflow-auto px-8 py-10 sm:px-12 sm:py-14",
            )}
          >
            <Demo />
          </div>
        </Suspense>
      </DemoErrorBoundary>
    </div>
  );
}

const DEFAULT_ID =
  kitCatalog.find((d) => d.id === "status-picker")?.id ??
  kitCatalog.find((d) => d.id === "kit-buttons")?.id ??
  kitCatalog[0]?.id ??
  "status-picker";

export function NibbletComponentsStudio() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(DEFAULT_ID);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fromHash = window.location.hash.replace(/^#/, "");
    if (fromHash && kitDemoLoaders[fromHash]) setSelected(fromHash);
    setReady(true);

    const onHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id && kitDemoLoaders[id]) setSelected(id);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const next = `#${selected}`;
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [selected, ready]);

  const sortedCatalog = useMemo(() => {
    const weight = (d: KitComponentMeta) =>
      d.category === "Backgrounds" || d.id === "shoal" ? 1 : 0;
    return [...kitCatalog].sort(
      (a, b) => weight(a) - weight(b) || a.name.localeCompare(b.name),
    );
  }, []);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = !q
      ? sortedCatalog
      : sortedCatalog.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.id.includes(q) ||
            d.description.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q),
        );

    const map = new Map<string, KitComponentMeta[]>();
    for (const item of list) {
      const key = item.category || "Components";
      const bucket = map.get(key) ?? [];
      bucket.push(item);
      map.set(key, bucket);
    }
    return [...map.entries()];
  }, [query, sortedCatalog]);

  const active = kitCatalog.find((d) => d.id === selected) ?? kitCatalog[0];

  if (!active) return null;

  return (
    <SplitStudio
      title={active.name}
      description={active.description}
      meta={
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-lime/80">
          {active.category}
        </p>
      }
      brand={
        <a
          href="/"
          className="font-display text-[15px] font-extrabold tracking-tight text-[#f2f5ee] transition hover:text-lime"
        >
          Nibblet
        </a>
      }
      actions={
        <a
          href="https://github.com/lawrence-millard/nibblet"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog-muted transition hover:text-lime"
        >
          GitHub
        </a>
      }
      stage={<DemoStage key={active.id} id={active.id} bleed={isBleed(active)} />}
    >
      <label className="relative block px-1">
        <span className="sr-only">Search components</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full border-0 border-b border-white/10 bg-transparent px-1 py-2 text-sm text-[#f2f5ee] outline-none transition placeholder:text-fog-muted focus:border-lime/50"
        />
      </label>

      <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(200,245,66,0.25)_transparent]">
        {grouped.length === 0 ? (
          <p className="px-2 py-6 text-sm text-fog-muted">No matches.</p>
        ) : (
          grouped.map(([category, items]) => (
            <div key={category} className="mb-4">
              <p className="sticky top-0 z-[1] bg-[#0a0c0a]/95 px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fog-muted backdrop-blur-sm">
                {category}
              </p>
              <ul className="space-y-0.5">
                {items.map((demo) => {
                  const on = selected === demo.id;
                  return (
                    <li key={demo.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(demo.id)}
                        className={cn(
                          "group relative w-full px-2 py-2.5 text-left transition",
                          on ? "text-[#f2f5ee]" : "text-fog hover:text-[#f2f5ee]",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full transition",
                            on ? "bg-lime opacity-100" : "bg-lime/0 group-hover:bg-white/20",
                          )}
                          aria-hidden
                        />
                        <span className="block pl-2 font-display text-[13px] font-bold tracking-tight">
                          {demo.name}
                        </span>
                        <span className="mt-0.5 block pl-2 text-[11px] leading-snug text-fog-muted line-clamp-1">
                          {demo.description}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </SplitStudio>
  );
}
