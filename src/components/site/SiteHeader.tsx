import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "/catalog", label: "Catalog" },
  { href: "/components", label: "Components" },
  { href: "/unlumen", label: "Unlumen" },
];

type Props = {
  /** Transparent over full-bleed stages (home / studio). */
  overlay?: boolean;
};

export function SiteHeader({ overlay = false }: Props) {
  return (
    <header
      className={cn(
        "z-30 w-full",
        overlay
          ? "absolute inset-x-0 top-0 border-transparent bg-transparent"
          : "relative border-b border-white/[0.04] bg-[#050705]/80 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-12 w-full max-w-[100rem] items-center justify-between gap-6 px-4 sm:h-14 sm:px-6">
        <Link
          href="/"
          className="font-display text-[15px] font-extrabold tracking-tight text-[#f2f5ee] transition hover:text-lime"
        >
          Nibblet
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-fog-muted transition hover:text-[#f2f5ee]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/lawrence-millard/nibblet"
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-fog-muted transition hover:text-lime"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
