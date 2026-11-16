"use client";

import { Fragment, useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CLYRA_STREAM_DEFAULTS, WordVeil, type RevealWord } from "./veil";
import styles from "./streaming-text.module.css";

export type StreamingTextProps = {
  /** Cumulative response text. Append network chunks in the parent. */
  text: string;
  streaming?: boolean;
  fadeDuration?: number;
  wordDelay?: number;
  maxRevealLag?: number;
  paused?: boolean;
  animateInitial?: boolean;
  fontSize?: number;
  appearance?: "dark" | "light";
};

function RevealingWord({ word, children, duration, paused, now }: {
  word: RevealWord; children: ReactNode; duration: number; paused: boolean; now: () => number;
}) {
  const element = useRef<HTMLSpanElement>(null);
  const animation = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    if (!element.current?.animate || duration <= 0) return;
    const age = now() - word.started;
    const effect = element.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration, delay: Math.max(0, -age), easing: CLYRA_STREAM_DEFAULTS.easing, fill: "both",
    });
    if (age >= 0) effect.currentTime = age;
    animation.current = effect;
    return () => { effect.cancel(); if (animation.current === effect) animation.current = null; };
  }, [word.started, duration, now]);
  useLayoutEffect(() => {
    const effect = animation.current;
    if (!effect) return;
    if (effect.playState === "finished" || Number(effect.currentTime ?? 0) >= Number(effect.effect?.getComputedTiming().endTime ?? Infinity)) return;
    if (paused) effect.pause();
    else effect.play();
  }, [paused, word.started, duration]);
  return <span ref={element} data-stream-word data-start={word.start}>{children}</span>;
}

/** Paint-only, word-by-word reveal adapted from ClyraADE's native chat. */
export function StreamingText({
  text, streaming = true, fadeDuration = CLYRA_STREAM_DEFAULTS.fadeDuration,
  wordDelay = CLYRA_STREAM_DEFAULTS.wordDelay, maxRevealLag = CLYRA_STREAM_DEFAULTS.maxRevealLag,
  paused = false, animateInitial = false, fontSize = 14, appearance = "dark",
}: StreamingTextProps) {
  const veil = useRef<WordVeil | null>(null);
  const wasStreaming = useRef(streaming);
  const clock = useRef({ offset: 0, pausedAt: null as number | null });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [snapshot, setSnapshot] = useState<{ text: string; words: RevealWord[] }>({ text, words: [] });
  const now = useCallback(() => (clock.current.pausedAt ?? performance.now()) - clock.current.offset, []);

  useLayoutEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    sync(); preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (paused && clock.current.pausedAt === null) clock.current.pausedAt = performance.now();
    else if (!paused && clock.current.pausedAt !== null) {
      clock.current.offset += performance.now() - clock.current.pausedAt;
      clock.current.pausedAt = null;
    }
  }, [paused]);

  useLayoutEffect(() => {
    const attaching = !veil.current;
    if (!veil.current) {
      veil.current = new WordVeil();
      if (!animateInitial) veil.current.seed(text);
    }
    if (reducedMotion || fadeDuration <= 0 || (!attaching && !streaming && !wasStreaming.current && text !== veil.current.previous)) veil.current.seed(text);
    wasStreaming.current = streaming;
    const words = veil.current.advance(text, now(), {
      fadeDuration: Math.max(0, fadeDuration), wordDelay: Math.max(0, wordDelay), maxRevealLag: Math.max(0, maxRevealLag),
    });
    setSnapshot({ text, words });
  }, [text, streaming, fadeDuration, wordDelay, maxRevealLag, reducedMotion, animateInitial, now]);

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const word of snapshot.words) {
    if (word.start > cursor) parts.push(<Fragment key={`settled-${cursor}`}>{snapshot.text.slice(cursor, word.start)}</Fragment>);
    parts.push(<RevealingWord key={word.start} word={word} duration={fadeDuration} paused={paused} now={now}>{snapshot.text.slice(word.start, word.end)}</RevealingWord>);
    cursor = word.end;
  }
  if (cursor < snapshot.text.length) parts.push(<Fragment key={`settled-${cursor}`}>{snapshot.text.slice(cursor)}</Fragment>);

  return <div className={styles.text} data-streaming-text data-appearance={appearance}
    data-reduced-motion={reducedMotion} aria-busy={streaming}
    style={{ "--stream-font-size": `${fontSize}px`, "--stream-line-height": `${fontSize * 22 / 14}px` } as CSSProperties}>
    {parts}
  </div>;
}
