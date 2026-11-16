import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve("src/components/kit");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));

const missing = [];
for (const item of catalog) {
  const usage = path.join(root, item.id, "USAGE.tsx");
  const component = path.join(root, item.id, "Component.jsx");
  if (!fs.existsSync(usage)) missing.push(`${item.id}: USAGE.tsx`);
  if (!fs.existsSync(component)) missing.push(`${item.id}: Component.jsx`);
}

if (missing.length) {
  console.error("missing files:\n" + missing.join("\n"));
  process.exit(1);
}

console.log(`ok ${catalog.length} kit demos have USAGE + Component`);
