const urls = [
  "https://nibble.lat/llms.txt",
  "https://nibble.lat/r/registry.json",
  "https://nibble.lat/registry.json",
  "https://nibble.lat/api/components",
  "https://nibble.lat/api/registry",
  "https://nibble.lat/mcp",
  "https://nibble.lat/.well-known/mcp.json",
  "https://nibble.lat/components/shoal",
  "https://ui.nibble.lat/r/registry.json",
];

for (const url of urls) {
  try {
    const res = await fetch(url, {
      headers: { Accept: "text/plain, application/json, text/html, */*" },
      redirect: "follow",
    });
    const text = await res.text();
    console.log("\n===", url, res.status, res.headers.get("content-type"));
    console.log(text.slice(0, 400).replace(/\n/g, "\\n"));
  } catch (e) {
    console.log("\n===", url, "ERR", e.message);
  }
}
