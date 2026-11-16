import fs from "node:fs";

const broken = new Set(["highlight", "velocity-highlight"]);
const entries = JSON.parse(
  fs.readFileSync("src/data/unlumen-demo-map.json", "utf8"),
).filter((e) => !broken.has(e.name));

fs.writeFileSync(
  "src/data/unlumen-demo-map.json",
  JSON.stringify(entries, null, 2),
);
console.log("kept", entries.length);
