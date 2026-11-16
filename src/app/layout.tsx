import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import "@onlymoein/liquidglass/styles.css";
import "./globals.css";

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
    default: "Nibblet — Free MCP for everything free",
    template: "%s · Nibblet",
  },
  description:
    "Browse free Model Context Protocol servers, copy zero-env installs, and use a nibble.lat-inspired component kit — no paywall, no .env required.",
  openGraph: {
    title: "Nibblet — Free MCP",
    description:
      "Free MCP catalog and interactive UI kit. Zero env vars. Everything free.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-charcoal text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
