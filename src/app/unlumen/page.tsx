import { SiteHeader } from "@/components/site/SiteHeader";
import { UnlumenGallery } from "@/components/unlumen/UnlumenGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlumen free",
  description:
    "Immersive free Unlumen UI demos — no license key, no .env.",
};

export default function UnlumenPage() {
  return (
    <div className="relative min-h-dvh bg-[#050705]">
      <SiteHeader overlay />
      <main className="pt-12 sm:pt-14">
        <UnlumenGallery />
      </main>
    </div>
  );
}
