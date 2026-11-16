"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type ShoalPalette = {
  water: string;
  deep: string;
  lime: string;
  fog: string;
  fish: string[];
};

const DEFAULT_PALETTE: ShoalPalette = {
  water: "#0a0e0a",
  deep: "#050705",
  lime: "#c8f542",
  fog: "#a8b0a4",
  fish: ["#c8f542", "#a8d12e", "#d4e8a8", "#8fa87a", "#e8f5c0", "#6b7368"],
};

export type ShoalPondProps = {
  className?: string;
  density?: number;
  speed?: number;
  palette?: Partial<ShoalPalette>;
  interactive?: boolean;
  /** Softer / fewer fish for nested tiles */
  compact?: boolean;
};

type Fish = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  phase: number;
  turn: number;
};

type Ripple = {
  x: number;
  y: number;
  r: number;
  max: number;
  alpha: number;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ShoalPond({
  className,
  density = 1,
  speed = 1,
  palette: paletteProp,
  interactive = true,
  compact = false,
}: ShoalPondProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette: ShoalPalette = { ...DEFAULT_PALETTE, ...paletteProp, fish: paletteProp?.fish ?? DEFAULT_PALETTE.fish };
    const reduced = prefersReducedMotion();
    const fish: Fish[] = [];
    const ripples: Ripple[] = [];
    const pointer = { x: 0, y: 0, active: false, lastRipple: 0 };
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const baseCount = compact ? 10 : 22;
    const count = Math.max(
      4,
      Math.round(baseCount * density * (reduced ? 0.45 : 1)),
    );
    const spd = reduced ? 0.15 : Math.max(0.2, speed);

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedFish() {
      fish.length = 0;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const s = (compact ? 5 : 7) + Math.random() * (compact ? 6 : 10);
        fish.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * (0.4 + Math.random() * 0.8) * spd,
          vy: Math.sin(angle) * (0.4 + Math.random() * 0.8) * spd,
          size: s,
          color: palette.fish[i % palette.fish.length],
          phase: Math.random() * Math.PI * 2,
          turn: (Math.random() - 0.5) * 0.02,
        });
      }
    }

    function addRipple(x: number, y: number, force = 1) {
      if (reduced) return;
      ripples.push({
        x,
        y,
        r: 2,
        max: 40 + 80 * force,
        alpha: 0.45 * force,
      });
      if (ripples.length > 28) ripples.shift();
    }

    function onPointer(e: PointerEvent) {
      if (!interactive) return;
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      const now = performance.now();
      if (now - pointer.lastRipple > 70) {
        pointer.lastRipple = now;
        addRipple(pointer.x, pointer.y, e.pressure || 0.7);
      }
    }

    function onLeave() {
      pointer.active = false;
    }

    function stepFish() {
      for (const f of fish) {
        if (pointer.active && !reduced) {
          const dx = pointer.x - f.x;
          const dy = pointer.y - f.y;
          const dist = Math.hypot(dx, dy) || 1;
          const pull = Math.min(0.045 * spd, 18 / dist);
          f.vx += (dx / dist) * pull;
          f.vy += (dy / dist) * pull;

          // soft avoidance when too close
          if (dist < 28) {
            f.vx -= (dx / dist) * 0.12 * spd;
            f.vy -= (dy / dist) * 0.12 * spd;
          }
        }

        // wander
        f.phase += 0.04 + Math.random() * 0.02;
        f.vx += Math.cos(f.phase) * f.turn * spd;
        f.vy += Math.sin(f.phase * 0.7) * f.turn * spd;

        // flock lightly toward neighbors
        let cx = 0;
        let cy = 0;
        let n = 0;
        for (const o of fish) {
          if (o === f) continue;
          const d = Math.hypot(o.x - f.x, o.y - f.y);
          if (d < 70) {
            cx += o.x;
            cy += o.y;
            n++;
            if (d < 16) {
              f.vx -= (o.x - f.x) * 0.02;
              f.vy -= (o.y - f.y) * 0.02;
            }
          }
        }
        if (n > 0) {
          cx /= n;
          cy /= n;
          f.vx += (cx - f.x) * 0.0009 * spd;
          f.vy += (cy - f.y) * 0.0009 * spd;
        }

        const mag = Math.hypot(f.vx, f.vy) || 1;
        const max = (compact ? 1.6 : 2.2) * spd;
        if (mag > max) {
          f.vx = (f.vx / mag) * max;
          f.vy = (f.vy / mag) * max;
        }

        f.x += f.vx;
        f.y += f.vy;

        // soft wrap
        const m = 24;
        if (f.x < -m) f.x = w + m;
        if (f.x > w + m) f.x = -m;
        if (f.y < -m) f.y = h + m;
        if (f.y > h + m) f.y = -m;
      }
    }

    function drawFish(f: Fish) {
      const angle = Math.atan2(f.vy, f.vx);
      const wobble = Math.sin(f.phase * 2) * 0.18;
      ctx!.save();
      ctx!.translate(f.x, f.y);
      ctx!.rotate(angle + wobble);

      const body = f.size;
      // body
      ctx!.beginPath();
      ctx!.ellipse(0, 0, body, body * 0.42, 0, 0, Math.PI * 2);
      ctx!.fillStyle = f.color;
      ctx!.globalAlpha = 0.88;
      ctx!.fill();

      // tail
      ctx!.beginPath();
      ctx!.moveTo(-body * 0.7, 0);
      ctx!.lineTo(-body * 1.35, -body * 0.45 + Math.sin(f.phase * 3) * 2);
      ctx!.lineTo(-body * 1.35, body * 0.45 + Math.cos(f.phase * 3) * 2);
      ctx!.closePath();
      ctx!.fillStyle = f.color;
      ctx!.globalAlpha = 0.7;
      ctx!.fill();

      // eye
      ctx!.beginPath();
      ctx!.arc(body * 0.45, -body * 0.1, Math.max(1.2, body * 0.1), 0, Math.PI * 2);
      ctx!.fillStyle = palette.deep;
      ctx!.globalAlpha = 0.9;
      ctx!.fill();

      // lime highlight speck
      ctx!.beginPath();
      ctx!.ellipse(body * 0.1, -body * 0.15, body * 0.25, body * 0.08, -0.4, 0, Math.PI * 2);
      ctx!.fillStyle = palette.lime;
      ctx!.globalAlpha = 0.22;
      ctx!.fill();

      ctx!.restore();
      ctx!.globalAlpha = 1;
    }

    function drawCharFish(f: Fish) {
      // character-based silhouette (ASCII-ish glyphs as shoal marks)
      const angle = Math.atan2(f.vy, f.vx);
      const glyphs = ["›", "≻", ">", "›", "≻"];
      const g = glyphs[Math.floor(f.phase) % glyphs.length];
      ctx!.save();
      ctx!.translate(f.x, f.y);
      ctx!.rotate(angle);
      ctx!.font = `${Math.round(f.size * 1.6)}px "JetBrains Mono", ui-monospace, monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillStyle = f.color;
      ctx!.globalAlpha = 0.85;
      ctx!.fillText(g, 0, 0);
      // soft trail glyph
      ctx!.globalAlpha = 0.25;
      ctx!.fillText("·", -f.size * 1.1, 0);
      ctx!.restore();
      ctx!.globalAlpha = 1;
    }

    function paint() {
      if (!running) return;

      // water wash
      const g = ctx!.createRadialGradient(
        w * 0.5,
        h * 0.35,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.75,
      );
      g.addColorStop(0, palette.water);
      g.addColorStop(1, palette.deep);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);

      // faint depth rings
      ctx!.strokeStyle = palette.fog;
      ctx!.globalAlpha = 0.04;
      for (let i = 1; i <= 4; i++) {
        ctx!.beginPath();
        ctx!.ellipse(w * 0.5, h * 0.55, w * 0.18 * i, h * 0.12 * i, 0, 0, Math.PI * 2);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;

      // ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 1.6 * spd;
        r.alpha *= 0.965;
        ctx!.beginPath();
        ctx!.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx!.strokeStyle = palette.lime;
        ctx!.globalAlpha = r.alpha * 0.55;
        ctx!.lineWidth = 1.25;
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(r.x, r.y, r.r * 0.55, 0, Math.PI * 2);
        ctx!.strokeStyle = palette.fog;
        ctx!.globalAlpha = r.alpha * 0.35;
        ctx!.stroke();
        if (r.r > r.max || r.alpha < 0.02) ripples.splice(i, 1);
      }
      ctx!.globalAlpha = 1;

      stepFish();
      for (const f of fish) {
        if (compact) drawCharFish(f);
        else {
          drawFish(f);
          // character accent near head
          ctx!.save();
          ctx!.translate(f.x, f.y);
          ctx!.rotate(Math.atan2(f.vy, f.vx));
          ctx!.font = `${Math.max(8, Math.round(f.size * 0.7))}px "JetBrains Mono", ui-monospace, monospace`;
          ctx!.fillStyle = palette.lime;
          ctx!.globalAlpha = 0.35;
          ctx!.fillText("·", f.size * 0.2, -f.size * 0.55);
          ctx!.restore();
          ctx!.globalAlpha = 1;
        }
      }

      // vignette
      const vig = ctx!.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.25,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.72,
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx!.fillStyle = vig;
      ctx!.fillRect(0, 0, w, h);

      if (!reduced) {
        raf = requestAnimationFrame(paint);
      }
    }

    resize();
    seedFish();
    paint();

    // static frame for reduced motion: still draw once after layout
    if (reduced) {
      paint();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) paint();
    });
    ro.observe(wrap);

    if (interactive) {
      canvas.addEventListener("pointermove", onPointer, { passive: true });
      canvas.addEventListener("pointerdown", onPointer, { passive: true });
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointercancel", onLeave);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (interactive) {
        canvas.removeEventListener("pointermove", onPointer);
        canvas.removeEventListener("pointerdown", onPointer);
        canvas.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("pointercancel", onLeave);
      }
    };
  }, [compact, density, interactive, paletteProp, speed]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative h-full w-full overflow-hidden bg-[#050705]", className)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-hidden
      />
      <span className="sr-only">
        Interactive shoal pond. Move the pointer to guide fish and make ripples.
      </span>
    </div>
  );
}
