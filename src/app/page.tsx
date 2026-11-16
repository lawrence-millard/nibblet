import { NibbletComponentsStudio } from "@/components/studio/NibbletComponentsStudio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components",
  description: "Interactive component studio — live previews, slim control rail.",
};

export default function Home() {
  return (
    <div className="h-dvh overflow-hidden bg-[#050705] text-[#f2f5ee]">
      <NibbletComponentsStudio />
    </div>
  );
}
