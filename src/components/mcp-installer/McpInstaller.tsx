"use client";

import type { FreeMcp, McpClient } from "@/data/free-mcps";
import { getInstallConfig } from "@/lib/mcp-config";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Loader2, Plug, Terminal } from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./McpInstaller.module.css";

export type ConnectionState = "idle" | "connecting" | "connected";

const CLIENTS: { id: McpClient; label: string }[] = [
  { id: "cursor", label: "Cursor" },
  { id: "claude", label: "Claude" },
  { id: "vscode", label: "VS Code" },
  { id: "codex", label: "Codex" },
];

const FALLBACK_SERVER: FreeMcp = {
  id: "nibblet-mcp",
  name: "Nibblet FREE MCP",
  description: "Search and install free MCP servers with zero env vars.",
  category: "Utilities",
  tags: ["catalog", "free", "nibblet"],
  install: { command: "npx", args: ["-y", "@nibblet/mcp"] },
  githubUrl: "https://github.com/lawrence-millard/nibblet",
  license: "MIT",
  clients: ["cursor", "claude", "vscode", "codex"],
  featured: true,
  noEnv: true,
  zeroConfig: true,
};

function buildCommand(mcp: FreeMcp): string {
  return [mcp.install.command, ...mcp.install.args].join(" ");
}

type Props = {
  server?: FreeMcp;
};

export function McpInstaller({ server = FALLBACK_SERVER }: Props) {
  const reduceMotion = useReducedMotion();
  const [client, setClient] = useState<McpClient>("cursor");
  const [state, setState] = useState<ConnectionState>("idle");
  const [copied, setCopied] = useState<"json" | "cmd" | null>(null);
  const [commandDraft, setCommandDraft] = useState<{
    serverId: string;
    value: string;
  } | null>(null);

  const defaultCommand = buildCommand(server);
  const command =
    commandDraft?.serverId === server.id
      ? commandDraft.value
      : defaultCommand;

  const snippet = useMemo(() => getInstallConfig(server, client), [server, client]);
  const json = snippet.json;

  const copy = async (text: string, kind: "json" | "cmd") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  const connect = () => {
    if (state === "connecting") return;
    setState("connecting");
    window.setTimeout(() => setState("connected"), reduceMotion ? 200 : 1400);
  };

  const statusLabel =
    state === "idle" ? "Idle" : state === "connecting" ? "Connecting…" : "Connected";

  return (
    <section className={styles.hero} aria-labelledby="mcp-installer-title">
      <div className={styles.header}>
        <div>
          <h2 id="mcp-installer-title" className={styles.brand}>
            {server.name}{" "}
            <span className={styles.brandAccent}>FREE</span>
          </h2>
          <p className={styles.sub}>
            Zero env vars. Copy a local stdio config for {client} — no keys, no
            paid tiers.
          </p>
        </div>
        <div className={styles.tabs} role="tablist" aria-label="MCP client">
          {CLIENTS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={client === c.id}
              className={`${styles.tab} ${client === c.id ? styles.tabActive : ""}`}
              onClick={() => {
                setClient(c.id);
                setState("idle");
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toggle} role="group" aria-label="Install mode">
          <button
            type="button"
            className={`${styles.toggleBtn} ${styles.toggleActive}`}
            aria-pressed
          >
            <Terminal
              size={14}
              aria-hidden
              style={{ marginRight: 6, verticalAlign: -2 }}
            />
            Local stdio
          </button>
        </div>

        <div className={styles.status} aria-live="polite">
          <span
            className={`${styles.dot} ${
              state === "connecting"
                ? styles.dotConnecting
                : state === "connected"
                  ? styles.dotConnected
                  : ""
            }`}
            aria-hidden
          />
          {statusLabel}
        </div>
      </div>

      <div className={styles.panels}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>
            <span>Config JSON</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => copy(json, "json")}
              aria-label="Copy JSON config"
            >
              {copied === "json" ? <Check size={14} /> : <Copy size={14} />}
              {copied === "json" ? "Copied" : "Copy"}
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.pre
              key={`${server.id}-${client}`}
              className={styles.pre}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
            >
              {json}
            </motion.pre>
          </AnimatePresence>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>
            <span>Install command</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => copy(command, "cmd")}
              aria-label="Copy install command"
            >
              {copied === "cmd" ? <Check size={14} /> : <Copy size={14} />}
              {copied === "cmd" ? "Copied" : "Copy"}
            </button>
          </div>
          <label className="sr-only" htmlFor="mcp-install-command">
            Editable install command
          </label>
          <textarea
            id="mcp-install-command"
            className={styles.commandInput}
            value={command}
            onChange={(e) =>
              setCommandDraft({ serverId: server.id, value: e.target.value })
            }
            spellCheck={false}
            rows={4}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.connectBtn}
          onClick={connect}
          disabled={state === "connecting"}
        >
          {state === "connecting" ? (
            <>
              <Loader2 size={16} className="inline animate-spin" aria-hidden />{" "}
              Connecting
            </>
          ) : state === "connected" ? (
            <>
              <Check size={16} className="inline" aria-hidden /> Ready
            </>
          ) : (
            <>
              <Plug size={16} className="inline" aria-hidden /> Verify setup
            </>
          )}
        </button>
        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => {
            setCommandDraft(null);
            setState("idle");
          }}
        >
          Reset
        </button>
      </div>

      <div className={styles.progressTrack} aria-hidden>
        <div
          className={`${styles.progressBar} ${
            state === "connecting"
              ? styles.progressConnecting
              : state === "connected"
                ? styles.progressConnected
                : ""
          }`}
        />
      </div>
    </section>
  );
}
