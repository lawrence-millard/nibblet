"use client";

import type { FreeMcp, McpCategory } from "@/data/free-mcps";
import { MCP_CATEGORIES } from "@/data/free-mcps";
import { McpInstaller } from "@/components/mcp-installer/McpInstaller";
import { SearchInput } from "@/components/search-input/SearchInput";
import { ExternalLink, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

type Props = {
  servers: FreeMcp[];
  initialQuery?: string;
};

export function McpCatalog({ servers, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<McpCategory | "All">("All");
  const [selectedId, setSelectedId] = useState(
    () => servers.find((s) => s.featured)?.id ?? servers[0]?.id ?? "",
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return servers.filter((mcp) => {
      if (category !== "All" && mcp.category !== category) return false;
      if (!q) return true;
      const hay = [mcp.name, mcp.description, mcp.id, ...mcp.tags]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [servers, query, category]);

  const selected =
    filtered.find((s) => s.id === selectedId) ??
    filtered[0] ??
    servers.find((s) => s.id === selectedId) ??
    servers[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput
              placeholder="Search free MCPs…"
              onSearch={setQuery}
            />
          </div>
          <p className="font-mono text-xs text-fog-muted sm:text-right">
            {filtered.length} free · zero env
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          <CategoryChip
            label="All"
            active={category === "All"}
            onClick={() => setCategory("All")}
          />
          {MCP_CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              label={c}
              active={category === c}
              onClick={() => setCategory(c)}
            />
          ))}
        </div>

        <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/8 bg-[#101510]/ring-1 ring-lime/5">
          {filtered.length === 0 ? (
            <li className="px-4 py-10 text-center text-fog">
              No free MCPs match that search.
            </li>
          ) : (
            filtered.map((mcp) => {
              const active = selected?.id === mcp.id;
              return (
                <li key={mcp.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(mcp.id)}
                    className={`flex w-full flex-col gap-2 px-4 py-4 text-left transition ${
                      active
                        ? "bg-lime/10"
                        : "hover:bg-white/[0.03]"
                    }`}
                    aria-current={active ? "true" : undefined}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-base font-bold text-[#f2f5ee]">
                          {mcp.name}
                        </p>
                        <p className="mt-1 text-sm text-fog line-clamp-2">
                          {mcp.description}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-fog-muted">
                        {mcp.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {mcp.zeroConfig ? (
                        <Badge icon={<Zap size={12} />} label="zero config" />
                      ) : null}
                      <Badge
                        icon={<ShieldCheck size={12} />}
                        label="no env"
                      />
                      {mcp.featured ? (
                        <Badge icon={<Sparkles size={12} />} label="featured" />
                      ) : null}
                      <a
                        href={mcp.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-lime hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        source <ExternalLink size={11} aria-hidden />
                      </a>
                    </div>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        {selected ? <McpInstaller server={selected} /> : null}
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition ${
        active
          ? "bg-lime text-charcoal"
          : "border border-white/10 text-fog hover:border-lime/40 hover:text-[#f2f5ee]"
      }`}
    >
      {label}
    </button>
  );
}

function Badge({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-fog">
      {icon}
      {label}
    </span>
  );
}
