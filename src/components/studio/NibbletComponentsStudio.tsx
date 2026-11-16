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

function DemoStage({ id, bleed }: { id: string; bleed: boolean }) {
  const Demo = loadDemo(id);
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <DemoErrorBoundary demoId={id}>
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
              bleed
                ? "absolute inset-0 [&_.shoal_pond]:!h-full [&_.shoal_pond]:!min-h-full [&_.shoal_pond]:!rounded-none"
                : "flex items-center justify-center overflow-auto p-6",
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
    return [...kitCatalog].sort((a, b) => weight(a) - weight(b) || a.name.localeCompare(b.name));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedCatalog;
    return sortedCatalog.filter(
      (d: KitComponentMeta) =>
        d.name.toLowerCase().includes(q) ||
        d.id.includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q),
    );
  }, [query, sortedCatalog]);

  const active = kitCatalog.find((d) => d.id === selected) ?? kitCatalog[0];

  if (!active) return null;

  return (
    <SplitStudio
      title={active.name}
      description={active.description}
      meta={
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog-muted">
          {active.category} · {active.id}
        </p>
      }
      actions={
        <a
          href="https://github.com/lawrence-millard/nibblet"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center rounded-full bg-lime px-3 font-display text-xs font-bold text-charcoal transition hover:bg-[#d6ff5c]"
        >
          GitHub
        </a>
      }
      stage={<DemoStage key={active.id} id={active.id} bleed={isBleed(active)} />}
    >
      <label className="block">
        <span className="sr-only">Search components</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components…"
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
