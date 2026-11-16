"use client";

import { ActivityIsland } from "@/components/activity-island/ActivityIsland";
import { AsciiFooter } from "@/components/ascii-footer/AsciiFooter";
import { NibbletButton } from "@/components/buttons/NibbletButton";
import { GlassShowcase } from "@/components/glass";
import { McpInstaller } from "@/components/mcp-installer/McpInstaller";
import { MergeConflicts } from "@/components/merge-conflicts/MergeConflicts";
import { MessageThread } from "@/components/message-thread/MessageThread";
import { MorphDialog } from "@/components/morph-dialog/MorphDialog";
import { OtpInput } from "@/components/otp-input/OtpInput";
import { SearchInput } from "@/components/search-input/SearchInput";
import { ShoalPond } from "@/components/shoal/ShoalPond";
import { StatusPicker } from "@/components/status-picker/StatusPicker";
import { SplitStudio } from "@/components/studio/SplitStudio";
import { VerseText } from "@/components/verse-text/VerseText";
import { freeMcps, getMcpById } from "@/data/free-mcps";
import { cn } from "@/lib/utils";
import { Download, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type DemoId =
  | "mcp-installer"
  | "shoal"
  | "glass"
  | "activity-island"
  | "status-picker"
  | "search-input"
  | "buttons"
  | "otp-input"
  | "merge-conflicts"
  | "message-thread"
  | "morph-dialog"
  | "verse-text"
  | "ascii-footer";

const DEMOS: {
  id: DemoId;
  name: string;
  blurb: string;
}[] = [
  {
    id: "shoal",
    name: "Shoal pond",
    blurb: "Character koi that follow the cursor and ripple the water.",
  },
  {
    id: "mcp-installer",
    name: "MCP Installer",
    blurb: "Tabs, remote/local toggle, JSON copy, connection states.",
  },
  {
    id: "glass",
    name: "Glass",
    blurb: "Liquid glass surface, controls, and lime accents.",
  },
  {
    id: "activity-island",
    name: "Activity Island",
    blurb: "Morphing capsule across timer, playing, call, MCP sync.",
  },
  {
    id: "status-picker",
    name: "Status Picker",
    blurb: "Orb + emoji status that unfolds into a picker.",
  },
  {
    id: "search-input",
    name: "Search Input",
    blurb: "Expanding search pill with Ctrl/Cmd+K.",
  },
  {
    id: "buttons",
    name: "Nibblet Button",
    blurb: "Primary, secondary, icon, and loading variants.",
  },
  {
    id: "otp-input",
    name: "OTP Input",
    blurb: "Six-digit code with paste and verified merge.",
  },
  {
    id: "merge-conflicts",
    name: "Merge Conflicts",
    blurb: "Mini PR conflict UI with resolve actions.",
  },
  {
    id: "message-thread",
    name: "Message Thread",
    blurb: "Chat bubbles and typing about free MCPs.",
  },
  {
    id: "morph-dialog",
    name: "Morph Dialog",
    blurb: "Shared-layout expand from trigger into a dialog.",
  },
  {
    id: "verse-text",
    name: "Verse Text",
    blurb: "Word-by-word reveal with reduced-motion safety.",
  },
  {
    id: "ascii-footer",
    name: "ASCII Footer",
    blurb: "Monospace brand mark for Nibblet.",
  },
];

function StageFor({ id }: { id: DemoId }) {
  switch (id) {
    case "mcp-installer":
      return (
        <div className="w-full max-w-xl px-4">
          <McpInstaller server={getMcpById("nibblet-mcp") ?? freeMcps[0]} />
        </div>
      );
    case "shoal":
      return <ShoalPond className="absolute inset-0" density={1.1} speed={1} />;
    case "glass":
      return (
        <div className="w-full max-w-3xl px-4 py-6">
          <GlassShowcase />
        </div>
      );
    case "activity-island":
      return <ActivityIsland />;
    case "status-picker":
      return <StatusPicker />;
    case "search-input":
      return (
        <div className="w-full max-w-md px-4">
          <SearchInput />
        </div>
      );
    case "buttons":
      return (
        <div className="flex flex-wrap items-center justify-center gap-3 px-4">
          <NibbletButton>Install</NibbletButton>
          <NibbletButton variant="secondary">Docs</NibbletButton>
          <NibbletButton loading>Connecting</NibbletButton>
          <NibbletButton variant="icon" aria-label="Download" icon={<Download size={16} />} />
          <NibbletButton variant="icon" aria-label="Sparkles" icon={<Sparkles size={16} />} />
        </div>
      );
    case "otp-input":
      return <OtpInput />;
    case "merge-conflicts":
      return (
        <div className="w-full max-w-lg px-4">
          <MergeConflicts />
        </div>
      );
    case "message-thread":
      return (
        <div className="w-full max-w-md px-4">
          <MessageThread />
        </div>
      );
    case "morph-dialog":
      return <MorphDialog />;
    case "verse-text":
      return (
        <div className="max-w-md px-6 text-center">
          <VerseText />
        </div>
      );
    case "ascii-footer":
      return (
        <div className="px-4">
          <AsciiFooter />
        </div>
      );
    default:
      return null;
  }
}

export function NibbletComponentsStudio() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DemoId>("shoal");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEMOS;
    return DEMOS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.id.includes(q) || d.blurb.toLowerCase().includes(q),
    );
  }, [query]);

  const active = DEMOS.find((d) => d.id === selected) ?? DEMOS[0];

  return (
    <SplitStudio
      title={active.name}
      description={active.blurb}
      meta={
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog-muted">
          Nibblet · free component
        </p>
      }
      actions={
        <>
          <a
            href="/unlumen"
            className="inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-xs font-medium text-[#f2f5ee] transition hover:border-lime/40 hover:text-lime"
          >
            Unlumen gallery
          </a>
          <a
            href="https://github.com/lawrence-millard/nibblet"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center rounded-full bg-lime px-3 font-display text-xs font-bold text-charcoal transition hover:bg-[#d6ff5c]"
          >
            View source
          </a>
        </>
      }
      stage={
        <div className="relative flex h-full min-h-[55vh] w-full items-center justify-center lg:min-h-[calc(100dvh-3.5rem)]">
          <StageFor id={selected} />
        </div>
      }
    >
      <label className="block">
        <span className="sr-only">Search components</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full rounded-lg border border-white/10 bg-charcoal-elevated px-3 py-2 text-sm text-[#f2f5ee] outline-none ring-lime/40 placeholder:text-fog-muted focus:ring-2"
        />
      </label>
      <ul className="max-h-[min(52vh,420px)] space-y-0.5 overflow-y-auto pr-1 lg:max-h-none lg:flex-1">
        {filtered.map((demo) => (
          <li key={demo.id}>
            <button
              type="button"
              onClick={() => setSelected(demo.id)}
              className={cn(
                "w-full rounded-lg px-3 py-2.5 text-left transition",
                selected === demo.id
                  ? "bg-lime/15 text-[#f2f5ee]"
                  : "text-fog hover:bg-white/5 hover:text-[#f2f5ee]",
              )}
            >
              <span className="block font-display text-sm font-bold">{demo.name}</span>
              <span className="mt-0.5 block text-xs text-fog-muted line-clamp-2">
                {demo.blurb}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </SplitStudio>
  );
}
