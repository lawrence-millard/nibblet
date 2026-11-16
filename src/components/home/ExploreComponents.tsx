"use client";

import {
  nibbleCatalog,
  nibbleDemoLoaders,
} from "@/components/nibble/registry";
import Link from "next/link";
import { Suspense, lazy, type ComponentType } from "react";

const FEATURED_IDS = [
  "shoal",
  "mcp-installer",
  "activity-island",
  "status-picker",
  "liquid-glass-surface",
  "message-thread",
] as const;

const demoCache = new Map<string, ComponentType>();

function loadDemo(id: string): ComponentType {
  const cached = demoCache.get(id);
  if (cached) return cached;
  const loader = nibbleDemoLoaders[id];
  const Fallback = () => (
    <p className="font-mono text-xs text-fog-muted">Missing {id}</p>
  );
  if (!loader) {
    demoCache.set(id, Fallback);
    return Fallback;
  }
  const LazyDemo = lazy(loader);
  demoCache.set(id, LazyDemo);
  return LazyDemo;
}

export function ExploreComponents() {
  const tiles = FEATURED_IDS.map((id) => {
    const meta = nibbleCatalog.find((c) => c.id === id);
    return {
      id,
      title: meta?.name ?? id,
      blurb: meta?.description ?? "",
      bleed: id === "shoal" || Boolean(meta?.wide),
      Demo: loadDemo(id),
    };
  });

  return (
    <section className="relative z-10 bg-[#050705] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[100rem] space-y-10 px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#f2f5ee] sm:text-[2.75rem]">
              Explore components
            </h2>
            <p className="max-w-lg text-fog">
              Real Nibble source — scraped from nibble.lat, not approximations.
            </p>
          </div>
          <Link
            href="/components"
            className="font-mono text-xs uppercase tracking-[0.18em] text-lime transition hover:text-[#d6ff5c]"
          >
            Open studio →
          </Link>
        </div>

        <ul className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
          {tiles.map((tile) => (
            <li key={tile.id} className="bg-[#050705]">
              <Link
                href={`/components`}
                className="group relative flex min-h-[320px] flex-col outline-none sm:min-h-[380px]"
              >
                <div
                  className={`relative flex-1 overflow-hidden bg-[#070907] ${
                    tile.bleed ? "" : "flex items-center justify-center p-6"
                  }`}
                >
                  <Suspense
                    fallback={
                      <p className="font-mono text-xs text-fog-muted">Loading…</p>
                    }
                  >
                    {tile.bleed ? (
                      <div className="pointer-events-none absolute inset-0">
                        <tile.Demo />
                      </div>
                    ) : (
                      <div className="pointer-events-none flex h-full w-full items-center justify-center">
                        <tile.Demo />
                      </div>
                    )}
                  </Suspense>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(5,7,5,0.95) 100%)",
                    }}
                  />
                </div>
                <div className="relative z-[1] -mt-16 space-y-1 px-6 pb-7">
                  <h3 className="font-display text-xl font-bold text-[#f2f5ee] transition group-hover:text-lime">
                    {tile.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-fog">{tile.blurb}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
