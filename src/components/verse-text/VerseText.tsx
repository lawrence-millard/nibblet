"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import styles from "./VerseText.module.css";

type Props = {
  text?: string;
  accentWords?: string[];
  staggerMs?: number;
};

export function VerseText({
  text = "Wire free MCPs into every editor — no gate, just glass and lime.",
  accentWords = ["free", "MCPs", "lime"],
  staggerMs = 80,
}: Props) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTick(i);
      if (i >= words.length) window.clearInterval(id);
    }, staggerMs);
    return () => window.clearInterval(id);
  }, [words.length, staggerMs, reduceMotion, text]);

  const visible = reduceMotion ? words.length : Math.min(tick, words.length);

  return (
    <p className={styles.verse} aria-label={text}>
      {words.map((word, i) => {
        const clean = word.replace(/[^\w]/g, "");
        const accent = accentWords.some(
          (a) => a.toLowerCase() === clean.toLowerCase(),
        );
        const shown = i < visible;
        return (
          <span
            key={`${word}-${i}`}
            className={`${styles.word} ${shown ? styles.wordShown : styles.wordHidden} ${accent ? styles.accent : ""}`}
            aria-hidden={!shown}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}
