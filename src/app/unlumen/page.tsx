import { SiteHeader } from "@/components/site/SiteHeader";
import { UnlumenGallery } from "@/components/unlumen/UnlumenGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlumen free",
  description:
    "Gallery of free Unlumen UI components installed via the shadcn registry — no license key, no .env.",
};

export default function UnlumenPage() {
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

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-8 sm:py-14">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-fog-muted">
            Unlumen UI · free registry
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#f2f5ee] sm:text-4xl">
            Free Unlumen components
          </h1>
          <p className="max-w-2xl text-fog">
            Every free item from{" "}
            <code className="text-lime-dim">@unlumen-ui</code> that installs
            without <code className="text-lime-dim">UNLUMEN_LICENSE_KEY</code>.
            Charcoal + lime Nibblet chrome — no purple theme forced.
          </p>
        </div>

        <UnlumenGallery />
      </main>
    </div>
  );
}
