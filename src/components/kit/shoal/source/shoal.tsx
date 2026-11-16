"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { ShoalInstance } from "./vendor/shoal-engine.js";
import { DEFAULTS, PALETTES } from "./vendor/shoal-settings.js";
import styles from "./shoal.module.css";

export type ShoalProps = {
  count?: number;
  seed?: number;
  appearance?: "auto" | "dark" | "light";
  height?: number | string;
  paused?: boolean;
  settings?: ShoalSettings;
};

export type ShoalSettings = Record<string, string | number | boolean>;

/** Self-contained koi canvas, adapted from the portfolio's SideShoal. */
export function Shoal({
  count = 2,
  seed = 7,
  appearance = "dark",
  height = 420,
  paused = false,
  settings,
}: ShoalProps) {
  const container = useRef<HTMLDivElement>(null);
  const instance = useRef<ShoalInstance | null>(null);
  const pausedRef = useRef(paused);
  const [status, setStatus] = useState("loading");
  const values = useMemo(() => ({
    ...DEFAULTS, ...(settings?.colorful ? PALETTES.on : PALETTES.off),
    hero: false, clear: true, gridOn: false, colorful: false, makeRoom: false,
    koi: Math.max(0, Math.min(10, Math.round(count))), seed, appearance, ...settings,
  }), [count, seed, appearance, settings]);
  const valuesRef = useRef<ShoalSettings>(values);
  const [resolvedAppearance, setResolvedAppearance] = useState(appearance);

  useEffect(() => {
    valuesRef.current = values;
    instance.current?.set(values);
    instance.current?.debug.render();
  }, [values]);

  useEffect(() => {
    const selected = String(settings?.appearance ?? appearance);
    const preference = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const theme = document.documentElement.dataset.theme;
      const scheme = getComputedStyle(document.documentElement).colorScheme.trim();
      const pageTheme = theme === "dark" || theme === "light" ? theme
        : scheme === "dark" || scheme === "light" ? scheme : preference.matches ? "dark" : "light";
      setResolvedAppearance(selected === "auto" ? pageTheme : selected as "dark" | "light");
    };
    sync();
    if (selected !== "auto") return;
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
    preference.addEventListener("change", sync);
    return () => { observer.disconnect(); preference.removeEventListener("change", sync); };
  }, [appearance, settings?.appearance]);

  useEffect(() => {
    pausedRef.current = paused;
    const pond = instance.current;
    if (!pond) return;
    pond.debug.freeze(paused || matchMedia("(prefers-reduced-motion: reduce)").matches);
    pond.debug.render();
  }, [paused]);

  useEffect(() => {
    let disposed = false;
    let pond: ShoalInstance | undefined;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      pond?.debug.freeze(pausedRef.current || reducedMotion.matches);
      pond?.debug.render();
    };
    setStatus("loading");

    void import("./vendor/shoal-engine.js").then(({ createShoal }) => {
      if (disposed || !container.current) return;
      pond = createShoal(container.current, valuesRef.current, {
        maxDpr: 1.5,
        onReady: () => {
          if (disposed) return;
          syncMotion();
          setStatus("ready");
        },
      });
      instance.current = pond;
      syncMotion();
      reducedMotion.addEventListener("change", syncMotion);
    }).catch(() => {
      if (!disposed) setStatus("error");
    });

    return () => {
      disposed = true;
      reducedMotion.removeEventListener("change", syncMotion);
      pond?.dispose();
      if (instance.current === pond) instance.current = null;
    };
  }, []);

  return (
    <div
      className={styles.pond}
      data-appearance={resolvedAppearance}
      data-clear={settings?.clear === true || undefined}
      data-monochrome={values.colorful === false}
      data-shoal-status={status}
      style={{ "--shoal-height": typeof height === "number" ? `${height}px` : height } as CSSProperties}
      role="img"
      aria-label="Koi fish swimming in a character-based pond. They react to your cursor and clicks."
    >
      <div ref={container} className={styles.canvas} aria-hidden="true" />
      {status === "error" && <span className={styles.error}>Could not load the pond.</span>}
    </div>
  );
}
