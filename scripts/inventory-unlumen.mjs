import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts)$/.test(ent.name)) acc.push(p.replace(/\\/g, "/"));
  }
  return acc;
}

const free = JSON.parse(fs.readFileSync("src/data/unlumen-free.json", "utf8"));
const success = JSON.parse(
  fs.readFileSync("src/data/unlumen-install-success.json", "utf8"),
);

const files = [
  ...walk("src/components/unlumen-ui"),
  ...walk("src/components/demo"),
  ...walk("src/hooks"),
  ...walk("src/lib").filter((f) => f.includes("get-strict") || f.includes("pixel")),
];

console.log("tsx/ts files:", files.length);
console.log("sample:", files.slice(0, 40));
console.log("demo files:", files.filter((f) => f.includes("/demo")));
console.log("success count", success.length);

// Map registry names to likely file paths for UI components
const uiNames = free.filter(
  (n) =>
    !n.startsWith("demo-") &&
    !n.startsWith("hooks-") &&
    !n.startsWith("lib-") &&
    !n.startsWith("primitives-") &&
    n !== "button" &&
    n !== "slot" &&
    n !== "tabs" &&
    n !== "cursor-primitive" &&
    n !== "pixel-patterns",
);

const missingUi = uiNames.filter((n) => {
  const hit = files.some(
    (f) =>
      f.endsWith(`/${n}.tsx`) ||
      f.endsWith(`/${n}/index.tsx`) ||
      f.includes(`/${n}.`),
  );
  return !hit;
});
console.log("missing UI files for names:", missingUi);
