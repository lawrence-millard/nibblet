import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/components/nibble");
const catalogUrl = "https://nibble.lat/api/catalog";

fs.mkdirSync(ROOT, { recursive: true });

const catalog = await (await fetch(catalogUrl)).json();
fs.writeFileSync(
  path.join(ROOT, "catalog.json"),
  JSON.stringify(catalog, null, 2),
);

const summary = [];

for (const item of catalog) {
  const id = item.id;
  console.log("fetching", id);
  const res = await fetch(`https://nibble.lat/api/components/${id}`);
  if (!res.ok) {
    console.error("failed", id, res.status);
    summary.push({ id, ok: false, status: res.status });
    continue;
  }
  const data = await res.json();
  const dir = path.join(ROOT, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(data, null, 2));

  if (data.singleFile?.name && data.singleFile?.content) {
    fs.writeFileSync(
      path.join(dir, data.singleFile.name),
      data.singleFile.content,
    );
  }

  if (Array.isArray(data.files)) {
    const sourceDir = path.join(dir, "source");
    fs.mkdirSync(sourceDir, { recursive: true });
    for (const file of data.files) {
      if (typeof file?.content !== "string") continue;
      const rel = file.path || file.name;
      if (!rel) continue;
      const out = path.join(sourceDir, rel);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, file.content);
    }
  }

  if (data.usage) {
    fs.writeFileSync(path.join(dir, "USAGE.tsx"), String(data.usage));
  }

  summary.push({
    id,
    ok: true,
    name: data.name || item.name,
    singleFile: data.singleFile?.name || null,
    files: (data.files || []).map((f) => f.path),
    dependencies: data.dependencies || [],
  });
}

fs.writeFileSync(
  path.join(ROOT, "install-summary.json"),
  JSON.stringify(summary, null, 2),
);
console.log("done", summary.filter((s) => s.ok).length, "/", summary.length);
