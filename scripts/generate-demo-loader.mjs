import fs from "node:fs";

const entries = JSON.parse(
  fs.readFileSync("src/data/unlumen-demo-map.json", "utf8"),
);

const imports = entries
  .map((e, i) => {
    const alias = `Demo${i}`;
    if (e.exportName === "default") {
      return `import ${alias} from "${e.importPath}";`;
    }
    return `import { ${e.exportName} as ${alias} } from "${e.importPath}";`;
  })
  .join("\n");

const mapEntries = entries
  .map((e, i) => `  "${e.name}": Demo${i},`)
  .join("\n");

const names = entries.map((e) => `"${e.name}"`).join(", ");

const out = `"use client";

import type { ComponentType } from "react";
${imports}

export const UNLUMEN_FULL_DEMO_NAMES = [${names}] as const;

export type UnlumenFullDemoName = (typeof UNLUMEN_FULL_DEMO_NAMES)[number];

// Demo components accept optional props with defaults; we mount them prop-free.
const DEMO_MAP: Record<string, ComponentType<object>> = {
${mapEntries}
};

export function UnlumenFullDemo({ name }: { name: string }) {
  const Demo = DEMO_MAP[name];
  if (!Demo) return null;
  return <Demo />;
}

export function hasFullDemo(name: string): boolean {
  return Boolean(DEMO_MAP[name]);
}
`;

fs.writeFileSync("src/components/unlumen/UnlumenFullDemos.tsx", out);
console.log("wrote UnlumenFullDemos.tsx with", entries.length, "demos");
