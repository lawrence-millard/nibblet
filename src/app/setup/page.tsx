import { McpSetupGuide } from "@/components/mcp/McpSetupGuide";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Setup",
  description: "Install Nibblet MCP in Cursor, Claude, VS Code, or Codex — zero env vars.",
};

export default function SetupPage() {
  return (
    <div className="relative min-h-full bg-[#050705]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 70% 0%, rgba(200,245,66,0.1), transparent 55%)",
        }}
      />
      <SiteHeader />
      <main className="pb-20 pt-10 sm:pt-14">
        <div className="mx-auto mb-4 flex w-full max-w-[100rem] px-4 sm:px-6">
          <Link
            href="/catalog"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog-muted transition hover:text-lime"
          >
            Browse full catalog →
          </Link>
        </div>
        <McpSetupGuide />
      </main>
    </div>
  );
}
