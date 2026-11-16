import fs from "fs";
import path from "path";

const free = JSON.parse(fs.readFileSync("src/data/unlumen-free.json", "utf8"));
const failures = new Set(
  JSON.parse(
    fs.readFileSync("src/data/unlumen-install-failures.json", "utf8"),
  ).map((f) => f.name),
);

const installed = free.filter((n) => !failures.has(n));

function exists(rel) {
  return fs.existsSync(path.join("src", rel));
}

const catalog = [];

for (const name of installed) {
  if (name.startsWith("demo-")) {
    catalog.push({
      name,
      kind: "demo",
      importPath: null,
      note: "Registry example (source under unlumen-ui/demo)",
    });
    continue;
  }
  if (name.startsWith("hooks-")) {
    const hook = name.replace(/^hooks-/, "");
    catalog.push({
      name,
      kind: "hook",
      importPath: `@/hooks/${hook}`,
      file: `hooks/${hook}.tsx`,
    });
    continue;
  }
  if (name.startsWith("lib-")) {
    const lib = name.replace(/^lib-/, "");
    catalog.push({
      name,
      kind: "lib",
      importPath: `@/lib/${lib}`,
      file: `lib/${lib}.tsx`,
    });
    continue;
  }
  if (name.startsWith("primitives-")) {
    const rest = name.replace(/^primitives-/, "").replace(/-/g, "/");
    // primitives-animate-avatar-group -> primitives/animate/avatar-group
    const parts = name.replace(/^primitives-/, "").split("-");
    let file = null;
    const candidates = [
      `components/unlumen-ui/primitives/${parts.join("/")}.tsx`,
      `components/unlumen-ui/primitives/${parts[0]}/${parts.slice(1).join("-")}.tsx`,
      `components/unlumen-ui/primitives/${parts.slice(0, 1).join("/")}/${parts.slice(1).join("-")}.tsx`,
    ];
    // Better mapping by category prefix
    const cats = ["animate", "buttons", "effects", "texts"];
    const cat = cats.find((c) => name.startsWith(`primitives-${c}-`));
    if (cat) {
      const leaf = name.replace(`primitives-${cat}-`, "");
      file = `components/unlumen-ui/primitives/${cat}/${leaf}.tsx`;
    } else if (name === "button" || name === "primitives-buttons-button") {
      file = "components/unlumen-ui/primitives/button.tsx";
    }
    if (!file || !exists(file)) {
      // try leaf under primitives
      for (const c of candidates) {
        if (exists(c)) {
          file = c;
          break;
        }
      }
    }
    catalog.push({
      name,
      kind: "primitive",
      importPath: file ? `@/${file.replace(/\.tsx$/, "")}` : null,
      file,
    });
    continue;
  }

  // special names
  const special = {
    button: "components/unlumen-ui/primitives/button.tsx",
    slot: "components/unlumen-ui/primitives/slot.tsx",
    tabs: "components/unlumen-ui/primitives/tabs.tsx",
    "cursor-primitive": "components/unlumen-ui/primitives/cursor.tsx",
    "pixel-patterns": "lib/pixel-patterns.ts",
  };

  const file =
    special[name] ??
    (exists(`components/unlumen-ui/${name}.tsx`)
      ? `components/unlumen-ui/${name}.tsx`
      : exists(`components/unlumen-ui/${name}/index.tsx`)
        ? `components/unlumen-ui/${name}/index.tsx`
        : null);

  catalog.push({
    name,
    kind: name.startsWith("primitives") ? "primitive" : "ui",
    importPath: file
      ? `@/${file.replace(/\.(tsx|ts)$/, "")}`
      : null,
    file,
  });
}

const ui = catalog.filter((c) => c.kind === "ui" && c.file);
fs.writeFileSync(
  "src/data/unlumen-installed.json",
  JSON.stringify(
    {
      installedCount: installed.length,
      failed: [...failures],
      components: catalog,
      uiComponents: ui.map((c) => c.name),
    },
    null,
    2,
  ),
);
console.log(
  "catalog",
  catalog.length,
  "ui",
  ui.length,
  "missing files",
  catalog.filter((c) => c.kind !== "demo" && !c.file).map((c) => c.name),
);
