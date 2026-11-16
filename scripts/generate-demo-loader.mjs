import fs from "node:fs";

const entries = JSON.parse(
  fs.readFileSync("src/data/unlumen-demo-map.json", "utf8"),
);

const names = entries.map((e) => `"${e.name}"`).join(", ");

const dynamicDecls = entries
  .map((e, i) => {
    const loader =
      e.exportName === "default"
        ? `() => import("${e.importPath}")`
        : `() => import("${e.importPath}").then((m) => ({ default: m.${e.exportName} as React.ComponentType }))`;
    return `const Demo${i} = dynamic(${loader} as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});`;
  })
  .join("\n\n");

const mapEntries = entries
  .map((e, i) => `  "${e.name}": Demo${i},`)
  .join("\n");

const out = `"use client";

import dynamic from "next/dynamic";
import type React from "react";

export const UNLUMEN_FULL_DEMO_NAMES = [${names}] as const;

export type UnlumenFullDemoName = (typeof UNLUMEN_FULL_DEMO_NAMES)[number];

${dynamicDecls}

const DEMO_MAP: Record<string, React.ComponentType> = {
${mapEntries}
};

const NEEDS_STAGE = new Set([
  "aurora-bars",
  "pixel-liquid-bg",
  "progressive-blur",
]);

export function UnlumenFullDemo({ name }: { name: string }) {
  const Demo = DEMO_MAP[name];
  if (!Demo) return null;
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
  return Boolean(DEMO_MAP[name]);
}
`;

fs.writeFileSync("src/components/unlumen/UnlumenFullDemos.tsx", out);
console.log("wrote lazy UnlumenFullDemos.tsx with", entries.length, "demos");
