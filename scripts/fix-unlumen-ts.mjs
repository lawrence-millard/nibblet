import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

// Map wrong demo/component import paths -> correct ones
const remaps = [
  [
    "@/components/unlumen-ui/primitives/cursor-primitive",
    "@/components/unlumen-ui/primitives/cursor",
  ],
  [
    "@/components/unlumen-ui/primitives/glow",
    "@/components/unlumen-ui/glow",
  ],
  [
    "@/components/unlumen-ui/primitives/clipped-circle",
    "@/components/unlumen-ui/clipped-circle",
  ],
  [
    "@/components/unlumen-ui/primitives/command-menu",
    "@/components/unlumen-ui/command-menu",
  ],
  [
    "@/components/unlumen-ui/primitives/count-up",
    "@/components/unlumen-ui/count-up",
  ],
  [
    "@/components/unlumen-ui/primitives/floating-tooltip",
    "@/components/unlumen-ui/floating-tooltip",
  ],
  [
    "@/components/unlumen-ui/primitives/glowing-badge",
    "@/components/unlumen-ui/glowing-badge",
  ],
  ["@/components/unlumen-ui/primitives/kbd", "@/components/unlumen-ui/kbd"],
  [
    "@/components/unlumen-ui/primitives/magnetic-button",
    "@/components/unlumen-ui/magnetic-button",
  ],
  [
    "@/components/unlumen-ui/primitives/math-graph",
    "@/components/unlumen-ui/math-graph",
  ],
  [
    "@/components/unlumen-ui/primitives/orbiting-skills",
    "@/components/unlumen-ui/orbiting-skills",
  ],
  [
    "@/components/unlumen-ui/primitives/progressive-blur",
    "@/components/unlumen-ui/progressive-blur",
  ],
  [
    "@/components/unlumen-ui/primitives/scramble-text",
    "@/components/unlumen-ui/scramble-text",
  ],
  [
    "@/components/unlumen-ui/primitives/shimmer-skeleton",
    "@/components/unlumen-ui/shimmer-skeleton",
  ],
  [
    "@/components/unlumen-ui/primitives/shimmering-text",
    "@/components/unlumen-ui/shimmering-text",
  ],
  [
    "@/components/unlumen-ui/primitives/slider",
    "@/components/unlumen-ui/slider",
  ],
  [
    "@/components/unlumen-ui/primitives/switch",
    "@/components/unlumen-ui/switch",
  ],
  [
    "@/components/unlumen-ui/primitives/text-reveal",
    "@/components/unlumen-ui/text-reveal",
  ],
  [
    "@/components/unlumen-ui/primitives/theme-switch",
    "@/components/unlumen-ui/theme-switch",
  ],
  [
    "@/components/unlumen-ui/primitives/tilt-card",
    "@/components/unlumen-ui/tilt-card",
  ],
  [
    "@/components/unlumen-ui/primitives/tooltip-preview",
    "@/components/unlumen-ui/tooltip-preview",
  ],
  [
    "@/components/unlumen-ui/primitives/highlight",
    "@/components/unlumen-ui/highlight",
  ],
  [
    "@/components/unlumen-ui/primitives/velocity-highlight",
    "@/components/unlumen-ui/velocity-highlight",
  ],
  ["@/components/ui/unlumen-slider", "@/components/unlumen-ui/slider"],
  ["@/components/ui/kbd", "@/components/unlumen-ui/kbd"],
];

const roots = [
  "src/components/unlumen-ui",
  "src/components/demo",
];

let changed = 0;
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    let src = fs.readFileSync(file, "utf8");
    let next = src;
    for (const [from, to] of remaps) {
      next = next.split(from).join(to);
    }
    // lucide renames
    next = next.replace(/\bGithub\b/g, "GitHub");
    next = next.replace(
      /import\s*\{([^}]*)\bFigma\b([^}]*)\}\s*from\s*["']lucide-react["']/,
      (m, a, b) => {
        // drop Figma from import; use a simple SVG substitute later if needed
        const names = (a + b)
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s && s !== "Figma");
        return `import { ${names.join(", ")} } from "lucide-react"`;
      },
    );
    if (next !== src) {
      fs.writeFileSync(file, next);
      changed++;
      console.log("fixed", file);
    }
  }
}
console.log("files changed", changed);
