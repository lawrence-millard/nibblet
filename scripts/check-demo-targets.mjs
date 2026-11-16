import https from "https";
import fs from "fs";

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

const free = JSON.parse(fs.readFileSync("src/data/unlumen-free.json", "utf8"));
const demos = free.filter((n) => n.startsWith("demo-")).slice(0, 15);

for (const n of demos) {
  const { status, d } = await get(`https://ui.unlumen.com/r/${n}.json`);
  if (status !== 200) {
    console.log(n, "HTTP", status);
    continue;
  }
  const j = JSON.parse(d);
  for (const f of j.files || []) {
    const target = f.target || f.path;
    const candidates = [
      `src/${f.target}`,
      `src/components/${pathish(f)}`,
      f.target ? `src/${f.target}` : null,
    ].filter(Boolean);
    const exists = candidates.some((c) => c && fs.existsSync(c));
    console.log(
      n,
      "target=",
      f.target || "(none)",
      "path=",
      f.path,
      "exists?",
      exists,
      candidates.filter((c) => fs.existsSync(c)),
    );
  }
}

function pathish(f) {
  if (f.target) return f.target.replace(/^components\//, "");
  return f.path.replace(/^registry\//, "");
}
