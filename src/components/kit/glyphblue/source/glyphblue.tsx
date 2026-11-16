"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { GlyphInstance, GlyphSettings } from "./vendor/glyphblue-runtime.js";
import styles from "./glyphblue.module.css";

export type { GlyphSettings } from "./vendor/glyphblue-runtime.js";
export type GlyphBlueProps = {
  settings?: GlyphSettings;
  appearance?: "auto" | "light" | "dark";
  paused?: boolean;
  width?: number | string;
  height?: number | string;
};

/** Background-only host for MetalForge's original public preview engine. */
export function GlyphBlue({ settings, appearance = "auto", paused = false, width = "100%", height = 420 }: GlyphBlueProps) {
  const host = useRef<HTMLDivElement>(null);
  const instance = useRef<GlyphInstance | null>(null);
  const values = useMemo(() => ({
    word: "", radius: 0, appearance, ...settings,
    sentence: "", label1: "", label2: "", mark: false,
    clearing: 0, reach: 0,
  }), [appearance, settings]);
  const valuesRef = useRef<GlyphSettings>(values);
  const pausedRef = useRef(paused);
  const [status, setStatus] = useState("loading");

  useEffect(() => { valuesRef.current = values; instance.current?.set(values); }, [values]);
  useEffect(() => {
    pausedRef.current = paused;
    instance.current?.debug.freeze(paused || matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [paused]);

  useEffect(() => {
    let disposed = false;
    let card: GlyphInstance | undefined;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => card?.debug.freeze(pausedRef.current || reduced.matches);
    const element = host.current!;
    const shadow = element.shadowRoot ?? element.attachShadow({ mode: "open" });
    const container = document.createElement("div");
    container.style.cssText = "all:initial;display:block;position:absolute;inset:0;contain:layout style;";
    shadow.append(container);

    void import("./vendor/glyphblue-runtime.js").then(({ createGlyphBlue }) => {
      if (disposed) return;
      // Retain the last frame while paused and when the modal copies its canvas.
      card = createGlyphBlue(container, valuesRef.current, { maxDpr: 1.5, preserve: true });
      // Remove the original foreground altogether; retain only its animated canvas.
      container.querySelector("[data-mf-glyphcard]")?.querySelector(":scope > div")?.remove();
      instance.current = card;
      syncMotion();
      reduced.addEventListener("change", syncMotion);
      setStatus(container.querySelector("canvas")?.getContext("webgl2") ? "ready" : "unsupported");
    }).catch(() => { if (!disposed) setStatus("error"); });

    return () => {
      disposed = true;
      reduced.removeEventListener("change", syncMotion);
      card?.dispose();
      container.remove();
      if (instance.current === card) instance.current = null;
    };
  }, []);

  return <div className={styles.card} data-glyphblue-status={status} data-glyphblue-paused={paused}
    style={{
      "--glyphblue-width": typeof width === "number" ? `${width}px` : width,
      "--glyphblue-height": typeof height === "number" ? `${height}px` : height,
    } as CSSProperties}
    role="img" aria-label="An animated blue character background that reacts to your cursor.">
    <div className={styles.host} ref={host} aria-hidden="true" />
    {(status === "error" || status === "unsupported") && <span className={styles.error}>{status === "unsupported" ? "This card requires WebGL 2." : "Could not load the card."}</span>}
  </div>;
}
