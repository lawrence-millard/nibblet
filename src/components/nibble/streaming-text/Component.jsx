"use client";

// Self-contained StreamingText: component and styles. Requires React.
import * as React from "react";

// src/components/catalog/streaming-text/streaming-text.tsx
import { Fragment, useCallback, useLayoutEffect, useRef, useState } from "react";

// src/components/catalog/streaming-text/veil.ts
var CLYRA_STREAM_DEFAULTS = {
  fadeDuration: 1500,
  wordDelay: 16,
  maxRevealLag: 500,
  easing: "cubic-bezier(0.42, 0, 0.58, 1)"
};
function commonPrefix(a, b) {
  let offset = 0;
  for (const character of a) {
    if (!b.startsWith(character, offset)) break;
    offset += character.length;
  }
  return offset;
}
var WordVeil = class {
  previous = "";
  words = [];
  nextReveal = null;
  seed(text) {
    this.previous = text;
    this.words = [];
    this.nextReveal = null;
  }
  advance(text, now, options) {
    if (text !== this.previous) {
      const prefix = commonPrefix(this.previous, text);
      this.words = this.words.map((word) => ({ ...word, end: Math.min(word.end, prefix) })).filter((word) => word.start < word.end);
      if (prefix < this.previous.length) this.nextReveal = this.words.at(-1)?.started ?? null;
      let offset = prefix;
      let extendsWord = prefix === this.previous.length && /\S$/u.test(this.previous);
      const ranges = [];
      for (const token of text.slice(prefix).match(/\S+\s*|\s+/gu) ?? []) {
        const end = offset + token.length;
        const whitespace = /^\s+$/u.test(token);
        const last = this.words.at(-1);
        if (last && last.end === offset && (whitespace || extendsWord)) last.end = end;
        else if (!whitespace) ranges.push({ start: offset, end });
        extendsWord = false;
        offset = end;
      }
      if (ranges.length) {
        const ceiling = now + Math.max(0, options.maxRevealLag);
        const start = Math.min(ceiling, Math.max(now, this.nextReveal ?? now));
        const gap = Math.min(Math.max(0, options.wordDelay), (ceiling - start) / ranges.length);
        ranges.forEach((range, index) => this.words.push({ ...range, started: start + index * gap }));
        this.nextReveal = start + ranges.length * gap;
      }
      this.previous = text;
    }
    this.words = this.words.filter((word) => now - word.started < options.fadeDuration);
    return this.words.map((word) => ({ ...word }));
  }
};

// src/components/catalog/streaming-text/streaming-text.module.css
var streaming_text_default = {
  text: "streaming_text_text"
};

// src/components/catalog/streaming-text/streaming-text.tsx
function RevealingWord({ word, children, duration, paused, now }) {
  const element = useRef(null);
  const animation = useRef(null);
  useLayoutEffect(() => {
    if (!element.current?.animate || duration <= 0) return;
    const age = now() - word.started;
    const effect = element.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration,
      delay: Math.max(0, -age),
      easing: CLYRA_STREAM_DEFAULTS.easing,
      fill: "both"
    });
    if (age >= 0) effect.currentTime = age;
    animation.current = effect;
    return () => {
      effect.cancel();
      if (animation.current === effect) animation.current = null;
    };
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
function StreamingText({
  text,
  streaming = true,
  fadeDuration = CLYRA_STREAM_DEFAULTS.fadeDuration,
  wordDelay = CLYRA_STREAM_DEFAULTS.wordDelay,
  maxRevealLag = CLYRA_STREAM_DEFAULTS.maxRevealLag,
  paused = false,
  animateInitial = false,
  fontSize = 14,
  appearance = "dark"
}) {
  const veil = useRef(null);
  const wasStreaming = useRef(streaming);
  const clock = useRef({ offset: 0, pausedAt: null });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [snapshot, setSnapshot] = useState({ text, words: [] });
  const now = useCallback(() => (clock.current.pausedAt ?? performance.now()) - clock.current.offset, []);
  useLayoutEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
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
    if (reducedMotion || fadeDuration <= 0 || !attaching && !streaming && !wasStreaming.current && text !== veil.current.previous) veil.current.seed(text);
    wasStreaming.current = streaming;
    const words = veil.current.advance(text, now(), {
      fadeDuration: Math.max(0, fadeDuration),
      wordDelay: Math.max(0, wordDelay),
      maxRevealLag: Math.max(0, maxRevealLag)
    });
    setSnapshot({ text, words });
  }, [text, streaming, fadeDuration, wordDelay, maxRevealLag, reducedMotion, animateInitial, now]);
  const parts = [];
  let cursor = 0;
  for (const word of snapshot.words) {
    if (word.start > cursor) parts.push(<Fragment key={`settled-${cursor}`}>{snapshot.text.slice(cursor, word.start)}</Fragment>);
    parts.push(<RevealingWord key={word.start} word={word} duration={fadeDuration} paused={paused} now={now}>{snapshot.text.slice(word.start, word.end)}</RevealingWord>);
    cursor = word.end;
  }
  if (cursor < snapshot.text.length) parts.push(<Fragment key={`settled-${cursor}`}>{snapshot.text.slice(cursor)}</Fragment>);
  return <div
    className={streaming_text_default.text}
    data-streaming-text
    data-appearance={appearance}
    data-reduced-motion={reducedMotion}
    aria-busy={streaming}
    style={{ "--stream-font-size": `${fontSize}px`, "--stream-line-height": `${fontSize * 22 / 14}px` }}
  >
    {parts}
  </div>;
}

// src/components/catalog/streaming-text/Component.jsx
function StreamingText2(props) {
  return <><style>{"/* src/components/catalog/streaming-text/streaming-text.module.css */\n.streaming_text_text {\n  all: initial;\n  display: block;\n  box-sizing: border-box;\n  width: 100%;\n  color: #ededed;\n  background: transparent;\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    \"Segoe UI\",\n    sans-serif;\n  font-size: var(--stream-font-size, 14px);\n  font-weight: 400;\n  line-height: var(--stream-line-height, 22px);\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n  user-select: text;\n}\n.streaming_text_text[data-appearance=light] {\n  color: #202020;\n}\n.streaming_text_text > span {\n  display: inline;\n}\n"}</style><StreamingText {...props} /></>;
}
export {
  StreamingText2 as StreamingText
};
