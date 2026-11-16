"use client";

import { CheckCircle2, CircleAlert, GitMerge, XCircle } from "lucide-react";
import { useState } from "react";
import styles from "./MergeConflicts.module.css";

type CheckItem = {
  id: string;
  label: string;
  ok: boolean;
};

const INITIAL_CHECKS: CheckItem[] = [
  { id: "lint", label: "Lint", ok: true },
  { id: "types", label: "Typecheck", ok: true },
  { id: "mcp", label: "MCP schema", ok: false },
];

export function MergeConflicts() {
  const [resolved, setResolved] = useState(false);
  const [choice, setChoice] = useState<"ours" | "theirs" | null>(null);
  const [checks, setChecks] = useState(INITIAL_CHECKS);

  const resolve = (side: "ours" | "theirs") => {
    setChoice(side);
    setResolved(true);
    setChecks((prev) =>
      prev.map((c) => (c.id === "mcp" ? { ...c, ok: true } : c)),
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            <GitMerge size={16} aria-hidden style={{ marginRight: 8, verticalAlign: -2 }} />
            Conflict · free-mcp.json
          </h3>
          <p className={styles.prMeta}>PR #42 · connect Nibblet FREE MCP</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.diff} aria-label="Conflict diff">
          <div className={`${styles.line} ${styles.base}`}>
            <span className={styles.ln}>11</span>
            <span>{`"mcpServers": {`}</span>
          </div>
          <div
            className={`${styles.line} ${choice === "theirs" ? styles.base : styles.ours}`}
            aria-label="Our change"
          >
            <span className={styles.ln}>12</span>
            <span>{`  "nibblet": { "url": "https://mcp.nibblet.dev" }`}</span>
          </div>
          <div
            className={`${styles.line} ${choice === "ours" ? styles.base : styles.theirs}`}
            aria-label="Their change"
          >
            <span className={styles.ln}>12</span>
            <span>{`  "nibblet": { "command": "npx", "args": ["@nibblet/free-mcp"] }`}</span>
          </div>
          <div className={`${styles.line} ${styles.base}`}>
            <span className={styles.ln}>13</span>
            <span>{`}`}</span>
          </div>
        </div>

        <div className={styles.side}>
          <ul className={styles.checks} aria-label="Checks">
            {checks.map((c) => (
              <li
                key={c.id}
                className={`${styles.check} ${c.ok ? styles.checkOk : styles.checkFail}`}
              >
                {c.ok ? (
                  <CheckCircle2 size={14} aria-hidden />
                ) : (
                  <XCircle size={14} aria-hidden />
                )}
                {c.label}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.resolveBtn}
              disabled={resolved}
              onClick={() => resolve("ours")}
            >
              Keep remote
            </button>
            <button
              type="button"
              className={styles.altBtn}
              disabled={resolved}
              onClick={() => resolve("theirs")}
            >
              Keep local
            </button>
          </div>
        </div>
      </div>

      {resolved && (
        <p className={styles.banner} role="status">
          <CircleAlert size={14} aria-hidden style={{ marginRight: 6, verticalAlign: -2 }} />
          Conflict resolved with {choice === "ours" ? "remote" : "local"} config — checks green.
        </p>
      )}
    </div>
  );
}
