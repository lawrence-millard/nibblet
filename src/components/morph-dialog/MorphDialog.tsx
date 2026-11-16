"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./MorphDialog.module.css";

type Props = {
  triggerLabel?: string;
  title?: string;
  children?: ReactNode;
};

export function MorphDialog({
  triggerLabel = "Open morph dialog",
  title = "Install FREE MCP",
  children = "Morph from the trigger into a focused panel — same shared layout id for a continuous feel.",
}: Props) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.root}>
      <motion.button
        type="button"
        className={styles.trigger}
        layoutId={reduceMotion ? undefined : "morph-dialog"}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            role="presentation"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              layoutId={reduceMotion ? undefined : "morph-dialog"}
              initial={reduceMotion ? false : { opacity: 0.85, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id={titleId} className={styles.title}>
                {title}
              </h3>
              <div className={styles.body}>{children}</div>
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
