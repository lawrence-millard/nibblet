"use client";

import { useEffect, useState, type ComponentType } from "react";

export const UNLUMEN_FULL_DEMO_NAMES = ["glow", "cards-view-icon", "compact-view-icon", "list-view-icon", "sidebar-toggle-icon", "animate-count", "animate-digits", "animated-list", "apple-switch", "aurora-bars", "clipped-circle", "command-menu", "count-up", "cursor-image-trail", "dock", "favicon-search", "file-tree", "floating-tooltip", "github-graph", "glowing-badge", "hover-expand", "hover-feature-cards", "kbd", "magnetic-button", "math-graph", "matrix", "matrix-image", "matrix-image-to-frame", "motion-faqs-accordion", "motion-navigation-menu", "nextjs-ship", "notion-mention-link", "orbiting-skills", "page-transition", "pinned-list", "progressive-blur", "scramble-text", "scroll-reveal-image", "shimmer-skeleton", "shimmering-text", "side-by-side-slide", "sidebar-001", "slider", "slider-range", "slider-steps", "switch", "tag", "text-reveal", "theme-switch", "tilt-card", "tooltip-preview", "vertical-marquee"] as const;

export type UnlumenFullDemoName = (typeof UNLUMEN_FULL_DEMO_NAMES)[number];

type DemoModule = { default: ComponentType<object> };

const LOADERS: Record<string, () => Promise<DemoModule>> = {
  "glow": () =>
    import("@/components/unlumen-ui/demo/components/buttons/glow").then((m) => ({
      default: m.GlowButtonDemo,
    })),
  "cards-view-icon": () => import("@/components/unlumen-ui/demo/components/icons/cards-view-icon"),
  "compact-view-icon": () => import("@/components/unlumen-ui/demo/components/icons/compact-view-icon"),
  "list-view-icon": () => import("@/components/unlumen-ui/demo/components/icons/list-view-icon"),
  "sidebar-toggle-icon": () => import("@/components/unlumen-ui/demo/components/icons/sidebar-toggle-icon"),
  "animate-count": () => import("@/components/unlumen-ui/demo/components/unlumen/animate-count"),
  "animate-digits": () => import("@/components/unlumen-ui/demo/components/unlumen/animate-digits"),
  "animated-list": () => import("@/components/unlumen-ui/demo/components/unlumen/animated-list"),
  "apple-switch": () => import("@/components/unlumen-ui/demo/components/unlumen/apple-switch"),
  "aurora-bars": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/aurora-bars").then((m) => ({
      default: m.AuroraBarsDemo,
    })),
  "clipped-circle": () => import("@/components/unlumen-ui/demo/components/unlumen/clipped-circle"),
  "command-menu": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/command-menu").then((m) => ({
      default: m.CommandMenuDemo,
    })),
  "count-up": () => import("@/components/unlumen-ui/demo/components/unlumen/count-up"),
  "cursor-image-trail": () => import("@/components/unlumen-ui/demo/components/unlumen/cursor-image-trail"),
  "dock": () => import("@/components/unlumen-ui/demo/components/unlumen/dock"),
  "favicon-search": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/favicon-search").then((m) => ({
      default: m.FaviconSearchDemo,
    })),
  "file-tree": () => import("@/components/unlumen-ui/demo/components/unlumen/file-tree"),
  "floating-tooltip": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/floating-tooltip").then((m) => ({
      default: m.FloatingTooltipDemo,
    })),
  "github-graph": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/github-graph").then((m) => ({
      default: m.GithubGraphDemo,
    })),
  "glowing-badge": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/glowing-badge").then((m) => ({
      default: m.GlowingBadgeDemo,
    })),
  "hover-expand": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/hover-expand").then((m) => ({
      default: m.HoverExpandDemo,
    })),
  "hover-feature-cards": () => import("@/components/unlumen-ui/demo/components/unlumen/hover-feature-cards"),
  "kbd": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/kbd").then((m) => ({
      default: m.KbdDemo,
    })),
  "magnetic-button": () => import("@/components/unlumen-ui/demo/components/unlumen/magnetic-button"),
  "math-graph": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/math-graph").then((m) => ({
      default: m.MathGraphDemo,
    })),
  "matrix": () => import("@/components/unlumen-ui/demo/components/unlumen/matrix"),
  "matrix-image": () => import("@/components/unlumen-ui/demo/components/unlumen/matrix-image"),
  "matrix-image-to-frame": () => import("@/components/unlumen-ui/demo/components/unlumen/matrix-image-to-frame"),
  "motion-faqs-accordion": () => import("@/components/unlumen-ui/demo/components/unlumen/motion-faqs-accordion"),
  "motion-navigation-menu": () => import("@/components/unlumen-ui/demo/components/unlumen/motion-navigation-menu"),
  "nextjs-ship": () => import("@/components/unlumen-ui/demo/components/unlumen/nextjs-ship"),
  "notion-mention-link": () => import("@/components/unlumen-ui/demo/components/unlumen/notion-mention-link"),
  "orbiting-skills": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/orbiting-skills").then((m) => ({
      default: m.OrbitingSkillsDemo,
    })),
  "page-transition": () => import("@/components/unlumen-ui/demo/components/unlumen/page-transition"),
  "pinned-list": () => import("@/components/unlumen-ui/demo/components/unlumen/pinned-list"),
  "progressive-blur": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/progressive-blur").then((m) => ({
      default: m.ProgressiveBlurDemo,
    })),
  "scramble-text": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/scramble-text").then((m) => ({
      default: m.ScrambleTextDemo,
    })),
  "scroll-reveal-image": () => import("@/components/unlumen-ui/demo/components/unlumen/scroll-reveal-image"),
  "shimmer-skeleton": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/shimmer-skeleton").then((m) => ({
      default: m.ShimmerSkeletonDemo,
    })),
  "shimmering-text": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/shimmering-text").then((m) => ({
      default: m.TextShimmerDemo,
    })),
  "side-by-side-slide": () => import("@/components/unlumen-ui/demo/components/unlumen/side-by-side-slide"),
  "sidebar-001": () => import("@/components/unlumen-ui/demo/components/unlumen/sidebar-001"),
  "slider": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/slider").then((m) => ({
      default: m.SliderDemo,
    })),
  "slider-range": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/slider-range").then((m) => ({
      default: m.SliderRangeDemo,
    })),
  "slider-steps": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/slider-steps").then((m) => ({
      default: m.SliderStepsDemo,
    })),
  "switch": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/switch").then((m) => ({
      default: m.SwitchDemo,
    })),
  "tag": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/tag").then((m) => ({
      default: m.TagDemo,
    })),
  "text-reveal": () => import("@/components/unlumen-ui/demo/components/unlumen/text-reveal"),
  "theme-switch": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/theme-switch").then((m) => ({
      default: m.ThemeSwitchDemo,
    })),
  "tilt-card": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/tilt-card").then((m) => ({
      default: m.TiltCardDemo,
    })),
  "tooltip-preview": () =>
    import("@/components/unlumen-ui/demo/components/unlumen/tooltip-preview").then((m) => ({
      default: m.TooltipPreviewDemo,
    })),
  "vertical-marquee": () => import("@/components/unlumen-ui/demo/components/unlumen/vertical-marquee"),
} as Record<string, () => Promise<DemoModule>>;

const NEEDS_STAGE = new Set([
  "aurora-bars",
  "pixel-liquid-bg",
  "progressive-blur",
]);

type LoadState = {
  name: string;
  Demo: ComponentType<object> | null;
  error: string | null;
};

export function UnlumenFullDemo({ name }: { name: string }) {
  const [state, setState] = useState<LoadState>({
    name,
    Demo: null,
    error: null,
  });

  useEffect(() => {
    let alive = true;
    const loader = LOADERS[name];
    if (!loader) {
      queueMicrotask(() => {
        if (alive) {
          setState({ name, Demo: null, error: `Demo unavailable: ${name}` });
        }
      });
      return () => {
        alive = false;
      };
    }

    loader()
      .then((mod) => {
        if (!alive) return;
        setState({ name, Demo: mod.default, error: null });
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setState({
          name,
          Demo: null,
          error: err instanceof Error ? err.message : "Failed to load demo",
        });
      });

    return () => {
      alive = false;
    };
  }, [name]);

  const ready = state.name === name;
  const Demo = ready ? state.Demo : null;
  const error = ready ? state.error : null;

  if (error) {
    return (
      <div className="max-w-md px-4 text-center font-mono text-sm text-fog-muted">
        {error}
      </div>
    );
  }

  if (!Demo) {
    return (
      <div className="flex h-48 w-full items-center justify-center font-mono text-xs text-fog-muted">
        Loading demo…
      </div>
    );
  }

  if (NEEDS_STAGE.has(name)) {
    return (
      <div className="h-[320px] w-full overflow-hidden rounded-2xl">
        <Demo />
      </div>
    );
  }

  return <Demo />;
}

export function hasFullDemo(name: string): boolean {
  return Boolean(LOADERS[name]);
}
