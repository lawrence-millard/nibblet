import { McpCatalog } from "@/components/catalog/McpCatalog";
import { AsciiFooter } from "@/components/ascii-footer/AsciiFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { VerseText } from "@/components/verse-text/VerseText";
import { freeMcps } from "@/data/free-mcps";
import { ActivityIsland } from "@/components/activity-island/ActivityIsland";
import Link from "next/link";

export default function Home() {
  const count = freeMcps.length;
  const zeroConfig = freeMcps.filter((m) => m.zeroConfig).length;

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(200,245,66,0.18), transparent 55%), radial-gradient(ellipse 40% 30% at 90% 20%, rgba(90,120,40,0.12), transparent 50%), linear-gradient(180deg, #0c0f0c 0%, #0e130e 45%, #0c0f0c 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <SiteHeader />

      <main className="relative z-10 flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-fog-muted">
            Free MCP · Free everything
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-[#f2f5ee] sm:text-7xl">
            Nibblet
          </h1>
          <p className="max-w-xl text-lg text-fog sm:text-xl">
            Browse {count} free Model Context Protocol servers, copy local
            installs with zero env vars, and ship with the same interactive
            component craft as nibble.lat — without a paywall.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center rounded-full bg-lime px-6 font-display text-sm font-bold text-charcoal transition hover:bg-[#d6ff5c]"
            >
              Explore catalog
            </Link>
            <Link
              href="/components"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 font-display text-sm font-bold text-[#f2f5ee] transition hover:border-lime/50 hover:text-lime"
            >
              Open components
            </Link>
            <div className="ml-0 sm:ml-4">
              <ActivityIsland />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 pt-2 font-mono text-xs text-fog-muted">
            <span>
              <strong className="text-lime">{count}</strong> free servers
            </span>
            <span>
              <strong className="text-lime">{zeroConfig}</strong> zero-config
            </span>
            <span>
              <strong className="text-lime">0</strong> required .env vars
            </span>
          </div>
        </section>

        <section
          id="install"
          className="border-t border-white/5 bg-black/20 py-14"
        >
          <div className="mx-auto w-full max-w-6xl space-y-8 px-4 sm:px-6">
            <div className="max-w-2xl space-y-3">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#f2f5ee]">
                Install any free MCP
              </h2>
              <VerseText text="Pick a server. Copy the JSON. Paste into Cursor, Claude, VS Code, or Codex. No keys. No billing. No surprises." />
            </div>
            <McpCatalog servers={freeMcps} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <Feature
              title="Fast"
              body="Static catalog, local stdio installs, and a Next.js UI that ships without a backend or secrets store."
            />
            <Feature
              title="Secure"
              body="No env injection in generated configs. Strict CSP and security headers. Ids validated before lookup."
            />
            <Feature
              title="Beautiful"
              body="Charcoal, acid lime, liquid glass, and motion — every component from the gallery is free to use."
            />
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6">
          <AsciiFooter />
          <p className="font-mono text-xs text-fog-muted">
            MIT · Inspired by nibble.lat · Built for free MCP forever
          </p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-2">
      <h3 className="font-display text-xl font-bold text-lime">{title}</h3>
      <p className="text-sm leading-relaxed text-fog">{body}</p>
    </div>
  );
}
