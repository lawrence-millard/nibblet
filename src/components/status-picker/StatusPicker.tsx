"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import styles from "./StatusPicker.module.css";

type Status = {
  id: string;
  emoji: string;
  label: string;
  color: string;
};

const STATUSES: Status[] = [
  { id: "online", emoji: "🟢", label: "Online", color: "#c8f542" },
  { id: "focus", emoji: "🎯", label: "Shipping MCP", color: "#7dd3fc" },
  { id: "afk", emoji: "☕", label: "AFK", color: "#f0c84a" },
  { id: "busy", emoji: "🧠", label: "Deep work", color: "#fb923c" },
  { id: "party", emoji: "✨", label: "Free tools", color: "#9ae66e" },
];

type Props = {
  defaultStatusId?: string;
};

export function StatusPicker({ defaultStatusId = "online" }: Props) {
  const reduceMotion = useReducedMotion();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(
    () => STATUSES.find((s) => s.id === defaultStatusId) ?? STATUSES[0],
  );

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.orb} style={{ color: status.color }} aria-hidden>
          {status.emoji}
        </span>
        <span className={styles.text}>
          <span className={styles.name}>{status.label}</span>
          <span className={styles.hint}>Tap to change status</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            className={styles.panel}
            role="listbox"
            aria-label="Status options"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.94, y: -4 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            {STATUSES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={status.id === s.id}
                aria-label={s.label}
                title={s.label}
                className={`${styles.option} ${status.id === s.id ? styles.optionActive : ""}`}
                onClick={() => {
                  setStatus(s);
                  setOpen(false);
                }}
              >
                {s.emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
