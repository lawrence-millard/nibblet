import Link from "next/link";

const links = [
  { href: "/catalog", label: "Catalog" },
  { href: "/components", label: "Components" },
  { href: "/unlumen", label: "Unlumen" },
];

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-white/5">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-extrabold tracking-tight text-[#f2f5ee]"
        >
          Nibblet
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-fog transition hover:bg-white/5 hover:text-[#f2f5ee]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/lawrence-millard/nibblet"
            target="_blank"
            rel="noreferrer"
            className="ml-1 rounded-full bg-lime px-3 py-1.5 font-display text-sm font-bold text-charcoal transition hover:bg-[#d6ff5c]"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
