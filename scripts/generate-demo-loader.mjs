import fs from "node:fs";

const entries = JSON.parse(
  fs.readFileSync("src/data/unlumen-demo-map.json", "utf8"),
);

const names = entries.map((e) => `"${e.name}"`).join(", ");

const cases = entries
  .map((e) => {
    if (e.exportName === "default") {
      return `  "${e.name}": () => import("${e.importPath}"),`;
    }
    return `  "${e.name}": () =>
    import("${e.importPath}").then((m) => ({
      default: m.${e.exportName},
    })),`;
  })
  .join("\n");

const out = `"use client";

import { useEffect, useState, type ComponentType } from "react";

export const UNLUMEN_FULL_DEMO_NAMES = [${names}] as const;

export type UnlumenFullDemoName = (typeof UNLUMEN_FULL_DEMO_NAMES)[number];

type DemoModule = { default: ComponentType<object> };

const LOADERS: Record<string, () => Promise<DemoModule>> = {
${cases}
} as Record<string, () => Promise<DemoModule>>;

const NEEDS_STAGE = new Set([
  "aurora-bars",
  "pixel-liquid-bg",
  "progressive-blur",
]);

type LoadState = {
  name: string;
  Demo: ComponentType<object> | null;
  error: string | null;
};

export function UnlumenFullDemo({ name }: { name: string }) {
  const [state, setState] = useState<LoadState>({
    name,
    Demo: null,
    error: null,
  });

  useEffect(() => {
    let alive = true;
    const loader = LOADERS[name];
    if (!loader) {
      queueMicrotask(() => {
        if (alive) {
          setState({ name, Demo: null, error: \`Demo unavailable: \${name}\` });
        }
      });
      return () => {
        alive = false;
      };
    }

    loader()
      .then((mod) => {
        if (!alive) return;
        setState({ name, Demo: mod.default, error: null });
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setState({
          name,
          Demo: null,
          error: err instanceof Error ? err.message : "Failed to load demo",
        });
      });

    return () => {
      alive = false;
    };
  }, [name]);

  const ready = state.name === name;
  const Demo = ready ? state.Demo : null;
  const error = ready ? state.error : null;

  if (error) {
    return (
      <div className="max-w-md px-4 text-center font-mono text-sm text-fog-muted">
        {error}
      </div>
    );
  }

  if (!Demo) {
    return (
      <div className="flex h-48 w-full items-center justify-center font-mono text-xs text-fog-muted">
        Loading demo…
      </div>
    );
  }

  if (NEEDS_STAGE.has(name)) {
    return (
      <div className="h-[320px] w-full overflow-hidden rounded-2xl">
        <Demo />
      </div>
    );
  }

  return <Demo />;
}

export function hasFullDemo(name: string): boolean {
  return Boolean(LOADERS[name]);
}
`;

fs.writeFileSync("src/components/unlumen/UnlumenFullDemos.tsx", out);
console.log("wrote UnlumenFullDemos.tsx with", entries.length, "loaders");
