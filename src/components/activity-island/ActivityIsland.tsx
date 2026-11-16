"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Music2, Phone, RefreshCw, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./ActivityIsland.module.css";

export type IslandState = "timer" | "playing" | "call" | "mcp-sync";

const STATES: { id: IslandState; label: string }[] = [
  { id: "timer", label: "Timer" },
  { id: "playing", label: "Playing" },
  { id: "call", label: "Call" },
  { id: "mcp-sync", label: "MCP Sync" },
];

type Props = {
  initial?: IslandState;
};

export function ActivityIsland({ initial = "timer" }: Props) {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<IslandState>(initial);
  const [seconds, setSeconds] = useState(90);

  useEffect(() => {
    if (mode !== "timer") return;
    const id = window.setInterval(() => {
      setSeconds((s) => (s <= 0 ? 90 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const content = {
    timer: {
      icon: <Timer size={16} aria-hidden />,
      label: `${mm}:${ss}`,
      meta: "Focus",
      width: 160,
    },
    playing: {
      icon: <Music2 size={16} aria-hidden />,
      label: "Lime Wire",
      meta: "Free MCP Beats",
      width: 220,
    },
    call: {
      icon: <Phone size={16} aria-hidden />,
      label: "Agent call",
      meta: "02:14",
      width: 190,
    },
    "mcp-sync": {
      icon: <RefreshCw size={16} className={reduceMotion ? undefined : "animate-spin"} aria-hidden />,
      label: "Syncing tools",
      meta: "12 MCPs",
      width: 210,
    },
  }[mode];

  return (
    <div className={styles.wrap}>
      <motion.div
        className={styles.island}
        layout
        animate={reduceMotion ? undefined : { width: content.width }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        role="status"
        aria-live="polite"
        aria-label={`Activity: ${mode}`}
      >
        <span className={styles.icon}>{content.icon}</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={mode}
            className={styles.label}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {content.label}
          </motion.span>
        </AnimatePresence>
        <span className={styles.meta}>{content.meta}</span>
        {(mode === "call" || mode === "mcp-sync") && (
          <span className={styles.pulse} aria-hidden />
        )}
      </motion.div>

      <div className={styles.controls} role="group" aria-label="Island state">
        {STATES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`${styles.chip} ${mode === s.id ? styles.chipActive : ""}`}
            aria-pressed={mode === s.id}
            onClick={() => setMode(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
