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

const outs = {
  "demo-expand-menu": "src/components/demo/expand-menu-demo.tsx",
  "demo-video-ambient":
    "src/components/unlumen-ui/demo/components/unlumen/video-ambient.tsx",
};

for (const n of Object.keys(outs)) {
  const { status, d } = await get(`https://ui.unlumen.com/r/${n}.json`);
  if (status !== 200) {
    console.log("fail", n, status);
    continue;
  }
  const j = JSON.parse(d);
  for (const f of j.files || []) {
    const out = outs[n];
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, f.content);
    console.log("wrote", out, "bytes", f.content.length);
    const imports = [...f.content.matchAll(/from ["']([^"']+)["']/g)].map(
      (m) => m[1],
    );
    console.log(" imports", imports);
  }
}
