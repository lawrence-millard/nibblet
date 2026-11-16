import https from "https";
import fs from "fs";
import path from "path";

function get(url) {
  return new Promise((res, rej) => {
    https
      .get(url, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => res({ status: r.statusCode, d }));
      })
      .on("error", rej);
  });
}

function resolveOut(f) {
  if (f.target) return path.join("src", f.target);
  // registry/demo/components/foo/bar/index.tsx -> src/components/unlumen-ui/demo/components/foo/bar.tsx
  const p = f.path.replace(/\\/g, "/");
  const m = p.match(/^registry\/demo\/components\/(.+)\/index\.tsx$/);
  if (m) {
    return path.join(
      "src/components/unlumen-ui/demo/components",
      `${m[1]}.tsx`,
    );
  }
  const m2 = p.match(/^registry\/demo\/(.+)$/);
  if (m2) return path.join("src/components/demo", m2[1]);
  return path.join("src/components/unlumen-ui/demo", path.basename(p));
}

const free = JSON.parse(fs.readFileSync("src/data/unlumen-free.json", "utf8"));
const demos = free.filter((n) => n.startsWith("demo-"));
const written = [];
const skipped = [];
const failed = [];

for (const n of demos) {
  if (n === "demo-pixel-grid") {
    failed.push({ name: n, reason: "Depends on premium pixel component" });
    continue;
  }
  const { status, d } = await get(`https://ui.unlumen.com/r/${n}.json`);
  if (status !== 200) {
    failed.push({ name: n, reason: `HTTP ${status}` });
    continue;
  }
  const j = JSON.parse(d);
  for (const f of j.files || []) {
    if (!f.content) {
      failed.push({ name: n, reason: "No file content in registry item" });
      continue;
    }
    const out = resolveOut(f).replace(/\\/g, "/");
    if (fs.existsSync(out) && fs.statSync(out).size > 0) {
      skipped.push({ name: n, out });
      continue;
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, f.content);
    written.push({ name: n, out });
    console.log("wrote", n, "->", out);
  }
}

fs.writeFileSync(
  "src/data/unlumen-demo-install.json",
  JSON.stringify({ written, skipped, failed }, null, 2),
);
console.log(
  "done written",
  written.length,
  "skipped",
  skipped.length,
  "failed",
  failed.length,
);
