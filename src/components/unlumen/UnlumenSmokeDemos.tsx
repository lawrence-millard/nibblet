"use client";

import { useState } from "react";
import { AppleSwitch } from "@/components/unlumen-ui/apple-switch";
import { AnimateCount } from "@/components/unlumen-ui/animate-count";
import { AuroraBars } from "@/components/unlumen-ui/aurora-bars";
import { BlobCard } from "@/components/unlumen-ui/blob-card";
import { CardsViewIcon } from "@/components/unlumen-ui/cards-view-icon";
import { CompactViewIcon } from "@/components/unlumen-ui/compact-view-icon";
import { CopyButton } from "@/components/unlumen-ui/copy";
import { CountUp } from "@/components/unlumen-ui/count-up";
import { GlowButton } from "@/components/unlumen-ui/glow";
import { GlowingBadge } from "@/components/unlumen-ui/glowing-badge";
import { Kbd, Shortcut } from "@/components/unlumen-ui/kbd";
import { ListViewIcon } from "@/components/unlumen-ui/list-view-icon";
import { MagneticButton } from "@/components/unlumen-ui/magnetic-button";
import { RefreshButton } from "@/components/unlumen-ui/refresh";
import { ScrambleText } from "@/components/unlumen-ui/scramble-text";
import { ShimmeringText } from "@/components/unlumen-ui/shimmering-text";
import { SidebarToggleIcon } from "@/components/unlumen-ui/sidebar-toggle-icon";
import { Switch } from "@/components/unlumen-ui/switch";
import { Tag } from "@/components/unlumen-ui/tag";
import { TextReveal } from "@/components/unlumen-ui/text-reveal";

export const SMOKE_DEMO_NAMES = [
  "copy",
  "glow",
  "refresh",
  "apple-switch",
  "switch",
  "kbd",
  "magnetic-button",
  "glowing-badge",
  "tag",
  "scramble-text",
  "shimmering-text",
  "text-reveal",
  "animate-count",
  "count-up",
  "aurora-bars",
  "blob-card",
  "cards-view-icon",
  "compact-view-icon",
  "list-view-icon",
  "sidebar-toggle-icon",
] as const;

export type SmokeDemoName = (typeof SMOKE_DEMO_NAMES)[number];

export function UnlumenSmokeDemo({ name }: { name: string }) {
  const [on, setOn] = useState(true);

  switch (name) {
    case "copy":
      return <CopyButton content="nibble free mcp" aria-label="Copy" />;
    case "glow":
      return <GlowButton>Glow</GlowButton>;
    case "refresh":
      return (
        <RefreshButton
          label="Refresh"
          onRefresh={async () => {
            await new Promise((r) => setTimeout(r, 400));
          }}
        />
      );
    case "apple-switch":
      return (
        <AppleSwitch checked={on} onCheckedChange={setOn} label="Apple" />
      );
    case "switch":
      return <Switch checked={on} onCheckedChange={setOn} label="Switch" />;
    case "kbd":
      return (
        <div className="flex items-center gap-3">
          <Kbd>⌘</Kbd>
          <Shortcut keys={["Ctrl", "K"]} />
        </div>
      );
    case "magnetic-button":
      return <MagneticButton>Magnetic</MagneticButton>;
    case "glowing-badge":
      return <GlowingBadge variant="success">Live</GlowingBadge>;
    case "tag":
      return <Tag variant="fast" label="Free" size="sm" />;
    case "scramble-text":
      return <ScrambleText text="Nibble" />;
    case "shimmering-text":
      return <ShimmeringText text="Shimmer" />;
    case "text-reveal":
      return <TextReveal text="Reveal on view" />;
    case "animate-count":
      return <AnimateCount>{42}</AnimateCount>;
    case "count-up":
      return <CountUp to={128} />;
    case "aurora-bars":
      return (
        <div className="h-16 w-full max-w-xs overflow-hidden rounded-lg">
          <AuroraBars />
        </div>
      );
    case "blob-card":
      return (
        <div className="w-full max-w-xs">
          <BlobCard header={<span className="p-4 text-sm">Header</span>}>
            <div className="space-y-1 p-4 text-sm text-fog">
              Blob card smoke
            </div>
          </BlobCard>
        </div>
      );
    case "cards-view-icon":
      return <CardsViewIcon isActive={on} />;
    case "compact-view-icon":
      return <CompactViewIcon isActive={on} />;
    case "list-view-icon":
      return <ListViewIcon isActive={on} />;
    case "sidebar-toggle-icon":
      return <SidebarToggleIcon isOpen={on} />;
    default:
      return null;
  }
}
