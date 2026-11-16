import fs from "node:fs";
import path from "node:path";

const cat = JSON.parse(
  fs.readFileSync("src/components/nibble/catalog.json", "utf8"),
);

for (const item of cat) {
  const usagePath = `src/components/nibble/${item.id}/USAGE.tsx`;
  const usage = fs.readFileSync(usagePath, "utf8");
  const imports = [...usage.matchAll(/from ["']([^"']+)["']/g)].map((m) => m[1]);
  const sourceDir = `src/components/nibble/${item.id}/source`;
  const source = fs.existsSync(sourceDir)
    ? fs.readdirSync(sourceDir)
    : [];
  const hasComponent = fs.existsSync(
    `src/components/nibble/${item.id}/Component.jsx`,
  );
  console.log(
    JSON.stringify({
      id: item.id,
      imports,
      source,
      hasComponent,
    }),
  );
}
