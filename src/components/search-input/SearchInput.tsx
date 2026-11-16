"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./SearchInput.module.css";

type Props = {
  placeholder?: string;
  onSearch?: (value: string) => void;
};

export function SearchInput({
  placeholder = "Search free MCPs…",
  onSearch,
}: Props) {
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setExpanded(true);
        window.requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (e.key === "Escape") {
        setValue("");
        onSearch?.("");
        setExpanded(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSearch]);

  const width = expanded || value ? "min(100%, 22rem)" : "10.5rem";

  return (
    <div className={styles.root}>
      <motion.div
        className={`${styles.pill} ${expanded || value ? styles.pillExpanded : ""}`}
        animate={reduceMotion ? undefined : { width }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        style={{ width }}
      >
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Open search"
          onClick={() => {
            setExpanded(true);
            inputRef.current?.focus();
          }}
        >
          <Search size={16} aria-hidden />
        </button>
        <input
          ref={inputRef}
          className={styles.input}
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label="Search"
          onFocus={() => setExpanded(true)}
          onBlur={() => {
            if (!value) setExpanded(false);
          }}
          onChange={(e) => {
            setValue(e.target.value);
            onSearch?.(e.target.value);
          }}
        />
        <AnimatePresence>
          {!expanded && !value && (
            <motion.kbd
              className={styles.kbd}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isMac ? "⌘" : "Ctrl"}+K
            </motion.kbd>
          )}
        </AnimatePresence>
        {value && (
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              onSearch?.("");
              inputRef.current?.focus();
            }}
          >
            <X size={12} aria-hidden />
          </button>
        )}
      </motion.div>
    </div>
  );
}
