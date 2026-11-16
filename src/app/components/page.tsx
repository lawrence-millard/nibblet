import { SiteHeader } from "@/components/site/SiteHeader";
import { NibbletComponentsStudio } from "@/components/studio/NibbletComponentsStudio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components",
  description: "Interactive FREE MCP UI kit — immersive stage, slim control rail.",
};

export default function ComponentsPage() {
  return (
    <div className="relative min-h-dvh bg-[#050705]">
      <SiteHeader overlay />
      <main className="pt-12 sm:pt-14">
        <NibbletComponentsStudio />
      </main>
    </div>
  );
}
