import catalogJson from "./free-mcps.json";

/** Supported MCP client identifiers. */
export type McpClient = "cursor" | "claude" | "vscode" | "codex";

/** Catalog categories for free MCP servers. */
export type McpCategory =
  | "Filesystem"
  | "Development"
  | "Search"
  | "Utilities"
  | "Database"
  | "Security"
  | "DevOps"
  | "Browser"
  | "Knowledge";

/** Install recipe (npx / uvx) with no env vars. */
export interface FreeMcpInstall {
  command: string;
  args: string[];
}

/** A free/open-source MCP server that needs no paid API for core use. */
export interface FreeMcp {
  id: string;
  name: string;
  description: string;
  category: McpCategory;
  tags: string[];
  install: FreeMcpInstall;
  githubUrl: string;
  license: string;
  clients: McpClient[];
  featured?: boolean;
  /** Always true in this catalog — no required env vars for install. */
  noEnv: true;
  /**
   * True when install works with only the listed command/args and no
   * path/URL placeholders that the user must replace.
   */
  zeroConfig?: boolean;
}

export const MCP_CATEGORIES: McpCategory[] = [
  "Filesystem",
  "Development",
  "Search",
  "Utilities",
  "Database",
  "Security",
  "DevOps",
  "Browser",
  "Knowledge",
];

export const MCP_CLIENTS: McpClient[] = [
  "cursor",
  "claude",
  "vscode",
  "codex",
];

/** Single-source catalog re-exported from `free-mcps.json`. */
export const freeMcps: FreeMcp[] = catalogJson as FreeMcp[];

export function getMcpById(id: string): FreeMcp | undefined {
  const normalized = id.trim().toLowerCase();
  return freeMcps.find((m) => m.id === normalized);
}

export function listFreeMcps(options?: {
  category?: string;
  query?: string;
}): FreeMcp[] {
  const category = options?.category?.trim();
  const query = options?.query?.trim().toLowerCase();

  return freeMcps.filter((mcp) => {
    if (category && mcp.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    if (!query) return true;
    const haystack = [
      mcp.id,
      mcp.name,
      mcp.description,
      mcp.category,
      ...mcp.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

export function searchMcps(query: string): FreeMcp[] {
  return listFreeMcps({ query });
}

export function getFeaturedMcps(): FreeMcp[] {
  return freeMcps.filter((m) => m.featured);
}

export function getZeroConfigMcps(): FreeMcp[] {
  return freeMcps.filter((m) => m.zeroConfig === true);
}
