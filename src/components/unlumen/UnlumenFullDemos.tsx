"use client";

import type { ComponentType } from "react";
import { GlowButtonDemo as Demo0 } from "@/components/unlumen-ui/demo/components/buttons/glow";
import Demo1 from "@/components/unlumen-ui/demo/components/icons/cards-view-icon";
import Demo2 from "@/components/unlumen-ui/demo/components/icons/compact-view-icon";
import Demo3 from "@/components/unlumen-ui/demo/components/icons/list-view-icon";
import Demo4 from "@/components/unlumen-ui/demo/components/icons/sidebar-toggle-icon";
import Demo5 from "@/components/unlumen-ui/demo/components/unlumen/animate-count";
import Demo6 from "@/components/unlumen-ui/demo/components/unlumen/animate-digits";
import Demo7 from "@/components/unlumen-ui/demo/components/unlumen/animated-list";
import Demo8 from "@/components/unlumen-ui/demo/components/unlumen/apple-switch";
import { AuroraBarsDemo as Demo9 } from "@/components/unlumen-ui/demo/components/unlumen/aurora-bars";
import Demo10 from "@/components/unlumen-ui/demo/components/unlumen/clipped-circle";
import { CommandMenuDemo as Demo11 } from "@/components/unlumen-ui/demo/components/unlumen/command-menu";
import Demo12 from "@/components/unlumen-ui/demo/components/unlumen/count-up";
import Demo13 from "@/components/unlumen-ui/demo/components/unlumen/cursor-image-trail";
import Demo14 from "@/components/unlumen-ui/demo/components/unlumen/dock";
import { FaviconSearchDemo as Demo15 } from "@/components/unlumen-ui/demo/components/unlumen/favicon-search";
import Demo16 from "@/components/unlumen-ui/demo/components/unlumen/file-tree";
import { FloatingTooltipDemo as Demo17 } from "@/components/unlumen-ui/demo/components/unlumen/floating-tooltip";
import { GithubGraphDemo as Demo18 } from "@/components/unlumen-ui/demo/components/unlumen/github-graph";
import { GlowingBadgeDemo as Demo19 } from "@/components/unlumen-ui/demo/components/unlumen/glowing-badge";
import { HoverExpandDemo as Demo20 } from "@/components/unlumen-ui/demo/components/unlumen/hover-expand";
import Demo21 from "@/components/unlumen-ui/demo/components/unlumen/hover-feature-cards";
import { KbdDemo as Demo22 } from "@/components/unlumen-ui/demo/components/unlumen/kbd";
import Demo23 from "@/components/unlumen-ui/demo/components/unlumen/magnetic-button";
import { MathGraphDemo as Demo24 } from "@/components/unlumen-ui/demo/components/unlumen/math-graph";
import Demo25 from "@/components/unlumen-ui/demo/components/unlumen/matrix";
import Demo26 from "@/components/unlumen-ui/demo/components/unlumen/matrix-image";
import Demo27 from "@/components/unlumen-ui/demo/components/unlumen/matrix-image-to-frame";
import Demo28 from "@/components/unlumen-ui/demo/components/unlumen/motion-faqs-accordion";
import Demo29 from "@/components/unlumen-ui/demo/components/unlumen/motion-navigation-menu";
import Demo30 from "@/components/unlumen-ui/demo/components/unlumen/nextjs-ship";
import Demo31 from "@/components/unlumen-ui/demo/components/unlumen/notion-mention-link";
import { OrbitingSkillsDemo as Demo32 } from "@/components/unlumen-ui/demo/components/unlumen/orbiting-skills";
import Demo33 from "@/components/unlumen-ui/demo/components/unlumen/page-transition";
import Demo34 from "@/components/unlumen-ui/demo/components/unlumen/pinned-list";
import { ProgressiveBlurDemo as Demo35 } from "@/components/unlumen-ui/demo/components/unlumen/progressive-blur";
import { ScrambleTextDemo as Demo36 } from "@/components/unlumen-ui/demo/components/unlumen/scramble-text";
import Demo37 from "@/components/unlumen-ui/demo/components/unlumen/scroll-reveal-image";
import { ShimmerSkeletonDemo as Demo38 } from "@/components/unlumen-ui/demo/components/unlumen/shimmer-skeleton";
import { TextShimmerDemo as Demo39 } from "@/components/unlumen-ui/demo/components/unlumen/shimmering-text";
import Demo40 from "@/components/unlumen-ui/demo/components/unlumen/side-by-side-slide";
import Demo41 from "@/components/unlumen-ui/demo/components/unlumen/sidebar-001";
import { SliderDemo as Demo42 } from "@/components/unlumen-ui/demo/components/unlumen/slider";
import { SliderRangeDemo as Demo43 } from "@/components/unlumen-ui/demo/components/unlumen/slider-range";
import { SliderStepsDemo as Demo44 } from "@/components/unlumen-ui/demo/components/unlumen/slider-steps";
import { SwitchDemo as Demo45 } from "@/components/unlumen-ui/demo/components/unlumen/switch";
import { TagDemo as Demo46 } from "@/components/unlumen-ui/demo/components/unlumen/tag";
import Demo47 from "@/components/unlumen-ui/demo/components/unlumen/text-reveal";
import { ThemeSwitchDemo as Demo48 } from "@/components/unlumen-ui/demo/components/unlumen/theme-switch";
import { TiltCardDemo as Demo49 } from "@/components/unlumen-ui/demo/components/unlumen/tilt-card";
import { TooltipPreviewDemo as Demo50 } from "@/components/unlumen-ui/demo/components/unlumen/tooltip-preview";
import Demo51 from "@/components/unlumen-ui/demo/components/unlumen/vertical-marquee";

export const UNLUMEN_FULL_DEMO_NAMES = ["glow", "cards-view-icon", "compact-view-icon", "list-view-icon", "sidebar-toggle-icon", "animate-count", "animate-digits", "animated-list", "apple-switch", "aurora-bars", "clipped-circle", "command-menu", "count-up", "cursor-image-trail", "dock", "favicon-search", "file-tree", "floating-tooltip", "github-graph", "glowing-badge", "hover-expand", "hover-feature-cards", "kbd", "magnetic-button", "math-graph", "matrix", "matrix-image", "matrix-image-to-frame", "motion-faqs-accordion", "motion-navigation-menu", "nextjs-ship", "notion-mention-link", "orbiting-skills", "page-transition", "pinned-list", "progressive-blur", "scramble-text", "scroll-reveal-image", "shimmer-skeleton", "shimmering-text", "side-by-side-slide", "sidebar-001", "slider", "slider-range", "slider-steps", "switch", "tag", "text-reveal", "theme-switch", "tilt-card", "tooltip-preview", "vertical-marquee"] as const;

export type UnlumenFullDemoName = (typeof UNLUMEN_FULL_DEMO_NAMES)[number];

// Demo components accept optional props with defaults; we mount them prop-free.
const DEMO_MAP: Record<string, ComponentType<object>> = {
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
