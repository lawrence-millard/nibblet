"use client";

import dynamic from "next/dynamic";
import type React from "react";

export const UNLUMEN_FULL_DEMO_NAMES = ["glow", "cards-view-icon", "compact-view-icon", "list-view-icon", "sidebar-toggle-icon", "animate-count", "animate-digits", "animated-list", "apple-switch", "aurora-bars", "clipped-circle", "command-menu", "count-up", "cursor-image-trail", "dock", "favicon-search", "file-tree", "floating-tooltip", "github-graph", "glowing-badge", "hover-expand", "hover-feature-cards", "kbd", "magnetic-button", "math-graph", "matrix", "matrix-image", "matrix-image-to-frame", "motion-faqs-accordion", "motion-navigation-menu", "nextjs-ship", "notion-mention-link", "orbiting-skills", "page-transition", "pinned-list", "progressive-blur", "scramble-text", "scroll-reveal-image", "shimmer-skeleton", "shimmering-text", "side-by-side-slide", "sidebar-001", "slider", "slider-range", "slider-steps", "switch", "tag", "text-reveal", "theme-switch", "tilt-card", "tooltip-preview", "vertical-marquee"] as const;

export type UnlumenFullDemoName = (typeof UNLUMEN_FULL_DEMO_NAMES)[number];

const Demo0 = dynamic(() => import("@/components/unlumen-ui/demo/components/buttons/glow").then((m) => ({ default: m.GlowButtonDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo1 = dynamic(() => import("@/components/unlumen-ui/demo/components/icons/cards-view-icon") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo2 = dynamic(() => import("@/components/unlumen-ui/demo/components/icons/compact-view-icon") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo3 = dynamic(() => import("@/components/unlumen-ui/demo/components/icons/list-view-icon") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo4 = dynamic(() => import("@/components/unlumen-ui/demo/components/icons/sidebar-toggle-icon") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo5 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/animate-count") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo6 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/animate-digits") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo7 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/animated-list") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo8 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/apple-switch") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo9 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/aurora-bars").then((m) => ({ default: m.AuroraBarsDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo10 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/clipped-circle") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo11 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/command-menu").then((m) => ({ default: m.CommandMenuDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo12 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/count-up") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo13 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/cursor-image-trail") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo14 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/dock") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo15 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/favicon-search").then((m) => ({ default: m.FaviconSearchDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo16 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/file-tree") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo17 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/floating-tooltip").then((m) => ({ default: m.FloatingTooltipDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo18 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/github-graph").then((m) => ({ default: m.GithubGraphDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo19 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/glowing-badge").then((m) => ({ default: m.GlowingBadgeDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo20 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/hover-expand").then((m) => ({ default: m.HoverExpandDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo21 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/hover-feature-cards") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo22 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/kbd").then((m) => ({ default: m.KbdDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo23 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/magnetic-button") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo24 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/math-graph").then((m) => ({ default: m.MathGraphDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo25 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/matrix") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo26 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/matrix-image") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo27 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/matrix-image-to-frame") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo28 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/motion-faqs-accordion") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo29 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/motion-navigation-menu") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo30 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/nextjs-ship") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo31 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/notion-mention-link") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo32 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/orbiting-skills").then((m) => ({ default: m.OrbitingSkillsDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo33 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/page-transition") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo34 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/pinned-list") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo35 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/progressive-blur").then((m) => ({ default: m.ProgressiveBlurDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo36 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/scramble-text").then((m) => ({ default: m.ScrambleTextDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo37 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/scroll-reveal-image") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo38 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/shimmer-skeleton").then((m) => ({ default: m.ShimmerSkeletonDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo39 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/shimmering-text").then((m) => ({ default: m.TextShimmerDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo40 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/side-by-side-slide") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo41 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/sidebar-001") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo42 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/slider").then((m) => ({ default: m.SliderDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo43 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/slider-range").then((m) => ({ default: m.SliderRangeDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo44 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/slider-steps").then((m) => ({ default: m.SliderStepsDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo45 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/switch").then((m) => ({ default: m.SwitchDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo46 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/tag").then((m) => ({ default: m.TagDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo47 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/text-reveal") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo48 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/theme-switch").then((m) => ({ default: m.ThemeSwitchDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo49 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/tilt-card").then((m) => ({ default: m.TiltCardDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo50 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/tooltip-preview").then((m) => ({ default: m.TooltipPreviewDemo as React.ComponentType })) as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const Demo51 = dynamic(() => import("@/components/unlumen-ui/demo/components/unlumen/vertical-marquee") as never, {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center font-mono text-xs text-fog-muted">
      Loading demo…
    </div>
  ),
});

const DEMO_MAP: Record<string, React.ComponentType> = {
  "glow": Demo0,
  "cards-view-icon": Demo1,
  "compact-view-icon": Demo2,
  "list-view-icon": Demo3,
  "sidebar-toggle-icon": Demo4,
  "animate-count": Demo5,
  "animate-digits": Demo6,
  "animated-list": Demo7,
  "apple-switch": Demo8,
  "aurora-bars": Demo9,
  "clipped-circle": Demo10,
  "command-menu": Demo11,
  "count-up": Demo12,
  "cursor-image-trail": Demo13,
  "dock": Demo14,
  "favicon-search": Demo15,
  "file-tree": Demo16,
  "floating-tooltip": Demo17,
  "github-graph": Demo18,
  "glowing-badge": Demo19,
  "hover-expand": Demo20,
  "hover-feature-cards": Demo21,
  "kbd": Demo22,
  "magnetic-button": Demo23,
  "math-graph": Demo24,
  "matrix": Demo25,
  "matrix-image": Demo26,
  "matrix-image-to-frame": Demo27,
  "motion-faqs-accordion": Demo28,
  "motion-navigation-menu": Demo29,
  "nextjs-ship": Demo30,
  "notion-mention-link": Demo31,
  "orbiting-skills": Demo32,
  "page-transition": Demo33,
  "pinned-list": Demo34,
  "progressive-blur": Demo35,
  "scramble-text": Demo36,
  "scroll-reveal-image": Demo37,
  "shimmer-skeleton": Demo38,
  "shimmering-text": Demo39,
  "side-by-side-slide": Demo40,
  "sidebar-001": Demo41,
  "slider": Demo42,
  "slider-range": Demo43,
  "slider-steps": Demo44,
  "switch": Demo45,
  "tag": Demo46,
  "text-reveal": Demo47,
  "theme-switch": Demo48,
  "tilt-card": Demo49,
  "tooltip-preview": Demo50,
  "vertical-marquee": Demo51,
};

const NEEDS_STAGE = new Set([
  "aurora-bars",
  "pixel-liquid-bg",
  "progressive-blur",
]);

export function UnlumenFullDemo({ name }: { name: string }) {
  const Demo = DEMO_MAP[name];
  if (!Demo) return null;
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
  return Boolean(DEMO_MAP[name]);
}
