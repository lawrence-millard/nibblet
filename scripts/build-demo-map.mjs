import fs from "node:fs";

const demos = JSON.parse(
  fs.readFileSync("src/data/unlumen-demo-install.json", "utf8"),
).written;

const entries = [];
for (const d of demos) {
  const file = d.out.replaceAll("\\", "/");
  const src = fs.readFileSync(file, "utf8");
  const named = [
    ...src.matchAll(/export\s+(?:const|function)\s+([A-Za-z0-9_]+)/g),
  ].map((m) => m[1]);
  const hasDefault = /export\s+default/.test(src);
  const base = d.name.replace(/^demo-/, "");
  entries.push({
    name: base,
    demoName: d.name,
    importPath: `@/${file.replace(/^src\//, "")}`.replace(/\.tsx?$/, ""),
    file: file.replace(/^src\//, ""),
    named,
    hasDefault,
    exportName: hasDefault
      ? "default"
      : named.find((n) => /Demo$/i.test(n)) || named[0] || null,
  });
}

fs.writeFileSync(
  "src/data/unlumen-demo-map.json",
  JSON.stringify(entries, null, 2),
);
console.log("entries", entries.length);
console.log(
  "missing export",
  entries.filter((e) => !e.exportName).map((e) => e.name),
);
console.log(entries.slice(0, 5));
