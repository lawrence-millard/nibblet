import { ActivityIsland } from "@/components/activity-island/ActivityIsland";
import { AsciiFooter } from "@/components/ascii-footer/AsciiFooter";
import { NibbletButton } from "@/components/buttons/NibbletButton";
import { ComponentGallery } from "@/components/ComponentGallery";
import { GlassShowcase } from "@/components/glass";
import { McpInstaller } from "@/components/mcp-installer/McpInstaller";
import { MergeConflicts } from "@/components/merge-conflicts/MergeConflicts";
import { MessageThread } from "@/components/message-thread/MessageThread";
import { MorphDialog } from "@/components/morph-dialog/MorphDialog";
import { OtpInput } from "@/components/otp-input/OtpInput";
import { SearchInput } from "@/components/search-input/SearchInput";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusPicker } from "@/components/status-picker/StatusPicker";
import { VerseText } from "@/components/verse-text/VerseText";
import { freeMcps, getMcpById } from "@/data/free-mcps";
import { Download, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Components",
  description: "Interactive FREE MCP UI kit",
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <h2 className="font-display text-xl font-bold tracking-tight text-[#f2f5ee]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ComponentsPage() {
  return (
    <div className="relative min-h-full">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(200,245,66,0.12), transparent 60%), radial-gradient(ellipse 50% 30% at 100% 20%, rgba(80,110,60,0.15), transparent 50%)",
        }}
      />

      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-10 sm:px-8 sm:py-14">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-fog-muted">
            Component gallery
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#f2f5ee] sm:text-4xl">
            Interactive pieces for free MCP installs
          </h1>
          <p className="max-w-2xl text-fog">
            Charcoal surfaces, acid lime accents, intentional motion — jump to any
            demo below.
          </p>
          <ComponentGallery />
        </div>

        <Section id="mcp-installer" title="MCP Installer">
          <McpInstaller
            server={getMcpById("nibblet-mcp") ?? freeMcps[0]}
          />
        </Section>

        <Section id="glass" title="Glass">
          <GlassShowcase />
        </Section>

        <Section id="activity-island" title="Activity Island">
          <ActivityIsland />
        </Section>

        <Section id="status-picker" title="Status Picker">
          <StatusPicker />
        </Section>

        <Section id="search-input" title="Search Input">
          <SearchInput />
        </Section>

        <Section id="buttons" title="Nibblet Button">
          <div className="flex flex-wrap items-center gap-3">
            <NibbletButton>Install</NibbletButton>
            <NibbletButton variant="secondary">Docs</NibbletButton>
            <NibbletButton loading>Connecting</NibbletButton>
            <NibbletButton variant="icon" aria-label="Download" icon={<Download size={16} />} />
            <NibbletButton variant="icon" aria-label="Sparkles" icon={<Sparkles size={16} />} />
          </div>
        </Section>

        <Section id="otp-input" title="OTP Input">
          <OtpInput />
        </Section>

        <Section id="merge-conflicts" title="Merge Conflicts">
          <MergeConflicts />
        </Section>

        <Section id="message-thread" title="Message Thread">
          <MessageThread />
        </Section>

        <Section id="morph-dialog" title="Morph Dialog">
          <MorphDialog />
        </Section>

        <Section id="verse-text" title="Verse Text">
          <VerseText />
        </Section>

        <Section id="ascii-footer" title="ASCII Footer">
          <AsciiFooter />
        </Section>
      </main>
    </div>
  );
}
