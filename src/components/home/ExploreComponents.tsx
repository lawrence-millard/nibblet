"use client";

import { ActivityIsland } from "@/components/activity-island/ActivityIsland";
import { GlassShowcase } from "@/components/glass";
import { McpInstaller } from "@/components/mcp-installer/McpInstaller";
import { MessageThread } from "@/components/message-thread/MessageThread";
import { ShoalPond } from "@/components/shoal/ShoalPond";
import { StatusPicker } from "@/components/status-picker/StatusPicker";
import { freeMcps, getMcpById } from "@/data/free-mcps";
import Link from "next/link";
import type { ReactNode } from "react";

type Tile = {
  href: string;
  title: string;
  blurb: string;
  preview: ReactNode;
  /** Full-bleed stage with no padding (pond, etc.) */
  bleed?: boolean;
};

const tiles: Tile[] = [
  {
    href: "/components",
    title: "MCP Installer",
    blurb: "Client tabs, JSON copy, connection states.",
    preview: (
      <div className="pointer-events-none w-[min(520px,92%)] opacity-95">
        <McpInstaller server={getMcpById("nibblet-mcp") ?? freeMcps[0]} />
      </div>
    ),
  },
  {
    href: "/components",
    title: "Shoal pond",
    blurb: "Character koi that follow your cursor.",
    bleed: true,
    preview: <ShoalPond compact density={1} speed={0.95} className="h-full w-full" />,
  },
  {
    href: "/components",
    title: "Activity Island",
    blurb: "A capsule that reshapes around what is happening.",
    preview: <ActivityIsland compact initial="mcp-sync" />,
  },
  {
    href: "/components",
    title: "Status Picker",
    blurb: "Orb that unfolds into an emoji status picker.",
    preview: <StatusPicker />,
  },
  {
    href: "/components",
    title: "Glass",
    blurb: "Liquid glass with lime accents.",
    preview: (
      <div className="pointer-events-none w-[min(480px,94%)]">
        <GlassShowcase />
      </div>
    ),
  },
  {
    href: "/components",
    title: "Message Thread",
    blurb: "Tailed bubbles and a typing indicator.",
    preview: (
      <div className="pointer-events-none w-[min(360px,90%)]">
        <MessageThread />
      </div>
    ),
  },
];

export function ExploreComponents() {
  return (
    <section className="relative z-10 bg-[#050705] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[100rem] space-y-10 px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#f2f5ee] sm:text-[2.75rem]">
              Explore components
            </h2>
            <p className="max-w-lg text-fog">
              Live previews in open stages — open any one in the studio.
            </p>
          </div>
          <Link
            href="/components"
            className="font-mono text-xs uppercase tracking-[0.18em] text-lime transition hover:text-[#d6ff5c]"
          >
            Open studio →
          </Link>
        </div>

        <ul className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
          {tiles.map((tile) => (
            <li key={tile.title} className="bg-[#050705]">
              <Link
                href={tile.href}
                className="group relative flex min-h-[320px] flex-col outline-none sm:min-h-[380px]"
              >
                <div
                  className={`relative flex-1 overflow-hidden bg-[#070907] ${
                    tile.bleed ? "" : "flex items-center justify-center p-6"
                  }`}
                >
                  {tile.bleed ? (
                    <div className="absolute inset-0">{tile.preview}</div>
                  ) : (
                    tile.preview
                  )}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(5,7,5,0.95) 100%)",
                    }}
                  />
                </div>
                <div className="relative z-[1] -mt-16 space-y-1 px-6 pb-7">
                  <h3 className="font-display text-xl font-bold text-[#f2f5ee] transition group-hover:text-lime">
                    {tile.title}
                  </h3>
                  <p className="text-sm text-fog">{tile.blurb}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
