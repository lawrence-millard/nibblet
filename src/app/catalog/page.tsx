import { McpCatalog } from "@/components/catalog/McpCatalog";
import { SiteHeader } from "@/components/site/SiteHeader";
import { freeMcps } from "@/data/free-mcps";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse free Model Context Protocol servers with zero required env vars.",
};

export default function CatalogPage() {
  return (
    <div className="relative min-h-full bg-[#050705]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 40% -10%, rgba(200,245,66,0.12), transparent 60%)",
        }}
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-fog-muted">
            Free MCP catalog
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#f2f5ee]">
            Everything free
          </h1>
          <p className="max-w-2xl text-fog">
            {freeMcps.length} open-source MCP servers curated for Cursor, Claude,
            VS Code, and Codex. Every entry runs without required environment
            variables.
          </p>
        </div>
        <McpCatalog servers={freeMcps} />
      </main>
    </div>
  );
}
