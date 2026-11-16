import { AsciiFooter } from "@/components/ascii-footer/AsciiFooter";
import { ExploreComponents } from "@/components/home/ExploreComponents";
import { ShoalPond } from "@/components/shoal/ShoalPond";
import { SiteHeader } from "@/components/site/SiteHeader";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col overflow-x-clip bg-[#050705]">
      <main className="relative z-10 flex flex-1 flex-col">
        <section className="relative flex min-h-dvh flex-col justify-end overflow-hidden">
          <SiteHeader overlay />
          <div className="absolute inset-0 z-0 [&_.shoal_pond]:!h-full [&_.shoal_pond]:!min-h-full [&_.shoal_pond]:!rounded-none">
            <ShoalPond density={1.4} seed={7} appearance="dark" height="100%" className="h-full w-full" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, rgba(5,7,5,0.2) 0%, rgba(5,7,5,0.08) 35%, rgba(5,7,5,0.92) 100%)",
            }}
          />

          <div className="pointer-events-none relative z-[2] mx-auto flex w-full max-w-[100rem] flex-col gap-5 px-4 pb-16 pt-28 sm:px-6 sm:pb-24">
            <h1 className="font-display text-[clamp(4.75rem,17vw,10rem)] font-extrabold leading-[0.82] tracking-tight text-[#f2f5ee]">
              Nibblet
            </h1>
            <p className="max-w-md text-base text-fog sm:text-lg">
              Free MCP for everything free — zero env vars, open installs.
            </p>
            <div className="pointer-events-auto flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/components"
                className="inline-flex h-11 items-center justify-center rounded-full bg-lime px-6 font-display text-sm font-bold text-charcoal transition hover:bg-[#d6ff5c]"
              >
                Explore
              </Link>
              <Link
                href="/catalog"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 font-display text-sm font-bold text-[#f2f5ee] transition hover:border-lime/50 hover:text-lime"
              >
                Catalog
              </Link>
            </div>
          </div>
        </section>

        <ExploreComponents />
      </main>

      <footer className="relative z-10 border-t border-white/[0.04] py-12">
        <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-6 px-4 sm:px-6">
          <AsciiFooter />
          <p className="font-mono text-xs text-fog-muted">
            MIT · Inspired by nibble.lat · Free MCP forever
          </p>
        </div>
      </footer>
    </div>
  );
}
