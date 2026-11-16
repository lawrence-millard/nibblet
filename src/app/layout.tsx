import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne, Geist } from "next/font/google";
import "@onlymoein/liquidglass/styles.css";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nibblet — Free MCP + components",
    template: "%s · Nibblet",
  },
  description:
    "Browse free MCP servers and explore a live component studio — zero env vars.",
  openGraph: {
    title: "Nibblet — Free MCP + components",
    description:
      "Free MCP catalog and interactive component studio. Zero env vars.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={cn(
        "dark h-full antialiased font-sans",
        syne.variable,
        dmSans.variable,
        jetbrainsMono.variable,
        geist.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-charcoal font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
