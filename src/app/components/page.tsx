import { SiteHeader } from "@/components/site/SiteHeader";
import { NibbletComponentsStudio } from "@/components/studio/NibbletComponentsStudio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components",
  description: "Interactive component studio — live previews, slim control rail.",
};

export default function ComponentsPage() {
  return (
    <div className="h-dvh overflow-hidden bg-[#050705] text-[#f2f5ee]">
      <div className="absolute inset-x-0 top-0 z-40">
        <SiteHeader overlay />
      </div>
      <main className="h-full pt-12 sm:pt-14">
        <div className="h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)]">
          <NibbletComponentsStudio />
        </div>
      </main>
    </div>
  );
}
