import type { FreeMcp, McpClient } from "@/data/free-mcps";

/** Cursor / Claude-style stdio server entry (no env). */
export interface StdioMcpServerConfig {
  command: string;
  args: string[];
}

/** VS Code mcp.json server entry shape. */
export interface VsCodeMcpServerConfig {
  type: "stdio";
  command: string;
  args: string[];
}

export type ClientConfigSnippet =
  | { client: "cursor"; json: string; servers: Record<string, StdioMcpServerConfig> }
  | { client: "claude"; json: string; servers: Record<string, StdioMcpServerConfig> }
  | { client: "vscode"; json: string; servers: Record<string, VsCodeMcpServerConfig> }
  | { client: "codex"; json: string; servers: Record<string, StdioMcpServerConfig> };

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Sanitize a server id/name for use as a JSON key in client configs.
 * Only lowercase alphanumerics and hyphens; empty input becomes "mcp-server".
 */
export function sanitizeServerName(name: string): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return cleaned.length > 0 ? cleaned : "mcp-server";
}

/** Validate a catalog id before looking it up or emitting config. */
export function isValidMcpId(id: string): boolean {
  const trimmed = id.trim();
  // Require already-lowercase kebab-case (do not coerce case).
  return trimmed === trimmed.toLowerCase() && ID_PATTERN.test(trimmed);
}

function serverKey(mcp: FreeMcp): string {
  return sanitizeServerName(mcp.id);
}

function stdioEntry(mcp: FreeMcp): StdioMcpServerConfig {
  return {
    command: mcp.install.command,
    args: [...mcp.install.args],
  };
}

/** Cursor `~/.cursor/mcp.json` (or project `.cursor/mcp.json`) snippet. */
export function toCursorConfig(mcp: FreeMcp): {
  mcpServers: Record<string, StdioMcpServerConfig>;
} {
  return {
    mcpServers: {
      [serverKey(mcp)]: stdioEntry(mcp),
    },
  };
}

/** Claude Desktop `claude_desktop_config.json` snippet. */
export function toClaudeDesktopConfig(mcp: FreeMcp): {
  mcpServers: Record<string, StdioMcpServerConfig>;
} {
  return {
    mcpServers: {
      [serverKey(mcp)]: stdioEntry(mcp),
    },
  };
}

/** VS Code MCP user/workspace settings snippet. */
export function toVsCodeConfig(mcp: FreeMcp): {
  servers: Record<string, VsCodeMcpServerConfig>;
} {
  return {
    servers: {
      [serverKey(mcp)]: {
        type: "stdio",
        command: mcp.install.command,
        args: [...mcp.install.args],
      },
    },
  };
}

/** Codex-style mcpServers map (same shape as Cursor for stdio). */
export function toCodexConfig(mcp: FreeMcp): {
  mcpServers: Record<string, StdioMcpServerConfig>;
} {
  return toCursorConfig(mcp);
}

/** Pretty-printed JSON config for a given client. No secrets / env. */
export function getInstallConfig(
  mcp: FreeMcp,
  client: McpClient,
): ClientConfigSnippet {
  switch (client) {
    case "cursor": {
      const servers = toCursorConfig(mcp).mcpServers;
      return {
        client,
        servers,
        json: JSON.stringify({ mcpServers: servers }, null, 2),
      };
    }
    case "claude": {
      const servers = toClaudeDesktopConfig(mcp).mcpServers;
      return {
        client,
        servers,
        json: JSON.stringify({ mcpServers: servers }, null, 2),
      };
    }
    case "vscode": {
      const servers = toVsCodeConfig(mcp).servers;
      return {
        client,
        servers,
        json: JSON.stringify({ servers }, null, 2),
      };
    }
    case "codex": {
      const servers = toCodexConfig(mcp).mcpServers;
      return {
        client,
        servers,
        json: JSON.stringify({ mcpServers: servers }, null, 2),
      };
    }
    default: {
      const _exhaustive: never = client;
      throw new Error(`Unsupported client: ${String(_exhaustive)}`);
    }
  }
}

export function parseClient(value: string): McpClient | null {
  const v = value.trim().toLowerCase();
  if (v === "cursor" || v === "claude" || v === "vscode" || v === "codex") {
    return v;
  }
  return null;
}
