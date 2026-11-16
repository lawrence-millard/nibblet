#!/usr/bin/env node
/**
 * @nibblet/mcp — stdio MCP server exposing the free MCP catalog.
 * Zero env vars. No telemetry. Does not eval install strings.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  getInstallConfig,
  getMcpById,
  isValidMcpId,
  listFreeMcps,
  parseClient,
  searchMcps,
} from "./catalog.js";

const TOOLS = [
  {
    name: "list_free_mcps",
    description:
      "List free/open-source MCP servers that need no API keys for core use. Optional category and query filters.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description:
            "Category filter: Filesystem|Development|Search|Utilities|Database|Security|DevOps|Browser|Knowledge",
        },
        query: {
          type: "string",
          description: "Optional substring match across name, description, and tags",
        },
      },
    },
  },
  {
    name: "get_mcp",
    description: "Get a single free MCP catalog entry by id",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Catalog id (lowercase kebab-case)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "get_install_config",
    description:
      "Generate a client config snippet (Cursor, Claude Desktop, VS Code, or Codex) for a catalog id. No secrets or env vars.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Catalog id" },
        client: {
          type: "string",
          description: "Target client: cursor | claude | vscode | codex",
          enum: ["cursor", "claude", "vscode", "codex"],
        },
      },
      required: ["id", "client"],
    },
  },
  {
    name: "search_mcps",
    description: "Full-text style search over the free MCP catalog",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
      },
      required: ["query"],
    },
  },
];

/**
 * @param {unknown} value
 * @returns {string}
 */
function asString(value) {
  return typeof value === "string" ? value : "";
}

/**
 * @param {Record<string, unknown>} args
 */
function handleListFreeMcps(args) {
  const category = asString(args.category) || undefined;
  const query = asString(args.query) || undefined;
  const results = listFreeMcps({ category, query });
  return {
    count: results.length,
    mcps: results.map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      description: m.description,
      tags: m.tags,
      featured: Boolean(m.featured),
      zeroConfig: Boolean(m.zeroConfig),
      noEnv: true,
      githubUrl: m.githubUrl,
      license: m.license,
    })),
  };
}

/**
 * @param {Record<string, unknown>} args
 */
function handleGetMcp(args) {
  const id = asString(args.id);
  if (!isValidMcpId(id)) {
    return { error: "invalid_id", message: "id must be lowercase kebab-case" };
  }
  const mcp = getMcpById(id);
  if (!mcp) {
    return { error: "not_found", message: `No MCP with id "${id}"` };
  }
  return { mcp };
}

/**
 * @param {Record<string, unknown>} args
 */
function handleGetInstallConfig(args) {
  const id = asString(args.id);
  const clientRaw = asString(args.client);
  if (!isValidMcpId(id)) {
    return { error: "invalid_id", message: "id must be lowercase kebab-case" };
  }
  const client = parseClient(clientRaw);
  if (!client) {
    return {
      error: "invalid_client",
      message: "client must be one of: cursor, claude, vscode, codex",
    };
  }
  const mcp = getMcpById(id);
  if (!mcp) {
    return { error: "not_found", message: `No MCP with id "${id}"` };
  }
  // Never eval install.command / args — only serialize validated catalog data.
  const snippet = getInstallConfig(mcp, client);
  return {
    id: mcp.id,
    client: snippet.client,
    config: snippet.config,
    json: snippet.json,
  };
}

/**
 * @param {Record<string, unknown>} args
 */
function handleSearchMcps(args) {
  const query = asString(args.query);
  const results = searchMcps(query);
  return {
    query,
    count: results.length,
    mcps: results.map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      description: m.description,
      tags: m.tags,
      zeroConfig: Boolean(m.zeroConfig),
    })),
  };
}

const server = new Server(
  { name: "nibblet-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  const args =
    request.params.arguments && typeof request.params.arguments === "object"
      ? /** @type {Record<string, unknown>} */ (request.params.arguments)
      : {};

  /** @type {unknown} */
  let payload;
  switch (name) {
    case "list_free_mcps":
      payload = handleListFreeMcps(args);
      break;
    case "get_mcp":
      payload = handleGetMcp(args);
      break;
    case "get_install_config":
      payload = handleGetInstallConfig(args);
      break;
    case "search_mcps":
      payload = handleSearchMcps(args);
      break;
    default:
      return {
        content: [{ type: "text", text: JSON.stringify({ error: "unknown_tool", name }) }],
        isError: true,
      };
  }

  const isError =
    payload &&
    typeof payload === "object" &&
    "error" in /** @type {Record<string, unknown>} */ (payload);

  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    isError: Boolean(isError),
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
