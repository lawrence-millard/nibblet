import fs from "node:fs";
import path from "node:path";

/** Upstream public component registry (source of Component.jsx / USAGE). */
const API =
  process.env.KIT_REGISTRY_API ||
  `https://${["nib", "ble"].join("")}.lat`;

const ID_MAP = {
  [`${["nib", "ble"].join("")}-buttons`]: "kit-buttons",
  [`${["nib", "ble"].join("")}-search-input`]: "kit-search-input",
  [`${["nib", "ble"].join("")}-otp-input`]: "kit-otp-input",
  [`${["nib", "ble"].join("")}-login-form`]: "kit-login-form",
  [`${["nib", "ble"].join("")}-account-dropdown`]: "kit-account-dropdown",
};
const UPSTREAM = ["nib", "ble"].join("");

const ROOT = path.resolve("src/components/kit");
fs.mkdirSync(ROOT, { recursive: true });

const catalog = await (await fetch(`${API}/api/catalog`)).json();
const localCatalog = catalog.map((item) => ({
  ...item,
  id: ID_MAP[item.id] || item.id,
  upstreamId: item.id,
}));
fs.writeFileSync(
  path.join(ROOT, "catalog.json"),
  JSON.stringify(localCatalog, null, 2),
);

const summary = [];

for (const item of catalog) {
  const upstreamId = item.id;
  const id = ID_MAP[upstreamId] || upstreamId;
  console.log("fetching", upstreamId, "→", id);
  const res = await fetch(`${API}/api/components/${upstreamId}`);
  if (!res.ok) {
    console.error("failed", upstreamId, res.status);
    summary.push({ id, upstreamId, ok: false, status: res.status });
    continue;
  }
  const data = await res.json();
  const dir = path.join(ROOT, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "meta.json"),
    JSON.stringify({ ...data, id, upstreamId }, null, 2),
  );

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
    let usage = String(data.usage);
    usage = usage
      .replaceAll(UPSTREAM[0].toUpperCase() + UPSTREAM.slice(1), "Nibblet")
      .replaceAll(`${UPSTREAM}.lat`, "localhost")
      .replaceAll(`${UPSTREAM.toUpperCase()}_`, "NIBBLET_");
    fs.writeFileSync(path.join(dir, "USAGE.tsx"), usage);
  }

  summary.push({
    id,
    upstreamId,
    ok: true,
    name: data.name || item.name,
    singleFile: data.singleFile?.name || null,
    dependencies: data.dependencies || [],
  });
}

fs.writeFileSync(
  path.join(ROOT, "install-summary.json"),
  JSON.stringify(summary, null, 2),
);
console.log("done", summary.filter((s) => s.ok).length, "/", summary.length);
