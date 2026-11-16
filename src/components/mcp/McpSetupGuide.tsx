"use client";

import { McpInstaller } from "@/components/mcp-installer/McpInstaller";
import { getMcpById, freeMcps } from "@/data/free-mcps";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

const SNIPPET = `{
  "mcpServers": {
    "nibblet-mcp": {
      "command": "npx",
      "args": ["-y", "@nibblet/mcp"]
    }
  }
}`;

const STEPS = [
  {
    title: "Open Cursor MCP settings",
    body: "Cursor → Settings → MCP, or edit ~/.cursor/mcp.json (or .cursor/mcp.json in a project).",
  },
  {
    title: "Paste the Nibblet server",
    body: "Copy the JSON below. No API keys. No .env. npx pulls @nibblet/mcp on first run.",
  },
  {
    title: "Restart & browse the catalog",
    body: "Reload Cursor, then use tools like list_free_mcps and get_install_config — or browse every server on /catalog.",
  },
] as const;

type Props = {
  /** Compact layout for embedding under the lander hero. */
  embedded?: boolean;
};

export function McpSetupGuide({ embedded = false }: Props) {
  const server = getMcpById("nibblet-mcp") ?? freeMcps.find((m) => m.featured) ?? freeMcps[0];
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="setup"
      className={
        embedded
          ? "relative z-10 border-t border-white/[0.06] bg-[#050705] py-20 sm:py-24"
          : "relative"
      }
    >
      <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime">
                Easy MCP setup
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#f2f5ee] sm:text-[2.5rem]">
                Install Nibblet MCP in under a minute
              </h2>
              <p className="max-w-md text-fog">
                Zero env vars. Works with Cursor, Claude Desktop, VS Code, and Codex.
              </p>
            </div>

            <ol className="space-y-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-display text-lg font-bold text-lime tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1 pt-0.5">
                    <p className="font-display text-base font-bold text-[#f2f5ee]">
                      {step.title}
                    </p>
                    <p className="text-sm leading-relaxed text-fog">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog-muted">
                  Cursor mcp.json
                </p>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fog-muted transition hover:text-lime"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="overflow-x-auto border border-white/10 bg-[#0a0c0a] p-4 font-mono text-[12px] leading-relaxed text-[#d7e0d2]">
                {SNIPPET}
              </pre>
            </div>
          </div>

          <div className="min-w-0">
            {server ? <McpInstaller server={server} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
