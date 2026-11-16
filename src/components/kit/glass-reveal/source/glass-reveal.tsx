"use client";

import { useEffect, useRef } from "react";
import { glassFrame, GLASS_END } from "./glass-reveal-timeline";
import styles from "./glass-reveal.module.css";
import { defaultLogo } from "./default-logo";

export function GlassReveal({ src = defaultLogo, size = 160, paused = false, interactive = true, appearance = "auto", replayKey = 0, label = "Animate the logo" }: {
  src?: string; size?: number | string; paused?: boolean; interactive?: boolean;
  appearance?: "auto" | "dark" | "light"; replayKey?: number; label?: string;
} = {}) {
  const pauseRef = useRef(paused);
  pauseRef.current = paused;
  const update = useRef<() => void>(() => {});
  useEffect(() => { update.current(); }, [paused]);
  const ref = useRef<HTMLButtonElement & HTMLDivElement>(null);
  const replay = useRef<() => void>(() => {});
  useEffect(() => {
    const button = ref.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let cleanup = () => {};
    // Reduced-motion users retain the SVG and never allocate a WebGL context.
    if (reduced.matches) return;
    void import("./glass-reveal-engine").then(async ({ createRenderer, loadLogo }) => {
      if (disposed) return;
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      button.appendChild(canvas);
      let renderer: ReturnType<typeof createRenderer> = null;
      let raf = 0, time = 0, last = 0;
      let visible = false, playing = true, dirty = true, started = false, loaded = false;
      let background = "rgb(32, 32, 32)", foreground = "rgb(243, 243, 243)", dark = true;
      const stop = () => { cancelAnimationFrame(raf); raf = 0; };
      const fallback = () => { stop(); playing = false; canvas.hidden = true; button.dataset.glass = "fallback"; };
      const colors = () => {
        let parent = button.parentElement;
        while (parent) {
          const color = getComputedStyle(parent).backgroundColor;
          if (color !== "transparent" && color !== "rgba(0, 0, 0, 0)") { background = color; break; }
          parent = parent.parentElement;
        }
        foreground = getComputedStyle(button).color;
        dark = appearance === "auto" ? document.documentElement.dataset.theme !== "light" : appearance === "dark";
        dirty = true;
        kick();
      };
      const tick = (now: number) => {
        raf = 0;
        if (disposed || !visible || document.hidden || reduced.matches || !loaded) return;
        const dt = Math.min(.1, (now - last) / 1000);
        last = now;
        if (playing && !pauseRef.current) { time = Math.min(GLASS_END, time + dt); dirty = true; }
        if (dirty && renderer) {
          const dpr = Math.min(devicePixelRatio || 1, 2);
          const size = Math.max(1, Math.round(button.clientWidth * dpr));
          if (canvas.width !== size || canvas.height !== size) canvas.width = canvas.height = size;
          renderer.render(glassFrame(time, background, foreground, dark), size, size, size / 1.35);
          canvas.hidden = false;
          button.dataset.glass = pauseRef.current ? "paused" : playing ? "playing" : "rest";
          dirty = false;
        }
        if (time >= GLASS_END) { playing = false; button.dataset.glass = "rest"; }
        if (playing && !pauseRef.current) raf = requestAnimationFrame(tick);
      };
      function kick() {
        if (raf || disposed || !visible || document.hidden || reduced.matches || !loaded) return;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
      const play = () => {
        if (pauseRef.current || reduced.matches || !loaded || (playing && started && time < GLASS_END)) return;
        time = 0; playing = true; started = true; dirty = true; colors(); kick();
      };
      const hover = (event: PointerEvent) => { if (interactive && event.pointerType === "mouse") play(); };
      const visibility = () => { if (document.hidden) stop(); else kick(); };
      const motion = () => { if (reduced.matches) fallback(); else { time = GLASS_END; playing = false; dirty = true; kick(); } };
      const lost = (event: Event) => { event.preventDefault(); fallback(); };
      const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { started = true; kick(); } else stop(); });
      const ro = new ResizeObserver(() => { dirty = true; kick(); });
      const theme = new MutationObserver(colors);
      cleanup = () => {
        stop(); io.disconnect(); ro.disconnect(); theme.disconnect();
        button.removeEventListener("pointerenter", hover);
        document.removeEventListener("visibilitychange", visibility);
        reduced.removeEventListener("change", motion);
        canvas.removeEventListener("webglcontextlost", lost);
        renderer?.dispose(); canvas.remove(); replay.current = () => {}; update.current = () => {};
      };
      try {
        renderer = createRenderer(canvas);
        if (!renderer) { fallback(); return; }
        const logo = await loadLogo(src);
        if (disposed) return;
        renderer.setLogo(logo); loaded = true;
        colors(); io.observe(button); ro.observe(button);
        theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        button.addEventListener("pointerenter", hover);
        document.addEventListener("visibilitychange", visibility);
        reduced.addEventListener("change", motion);
        canvas.addEventListener("webglcontextlost", lost);
        replay.current = play;
        update.current = () => { dirty = true; kick(); };
        if (reduced.matches) fallback();
      } catch { fallback(); }
    }).catch(() => {});
    return () => { disposed = true; cleanup(); };
  }, [src, appearance, replayKey, interactive]);
  const Tag = interactive ? "button" : "div";
  return <Tag ref={ref} type={interactive ? "button" : undefined} className={styles.mark}
    style={{ width: size, height: size }} data-glass="loading"
    role={interactive ? undefined : "img"} aria-label={label} onClick={interactive ? () => replay.current() : undefined}>
    <span className={styles.symbol} style={{ maskImage: `url(${JSON.stringify(src)})`, WebkitMaskImage: `url(${JSON.stringify(src)})` }} aria-hidden="true" />
  </Tag>;
}
