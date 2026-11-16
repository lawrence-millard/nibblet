import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @typedef {'Filesystem'|'Development'|'Search'|'Utilities'|'Database'|'Security'|'DevOps'|'Browser'|'Knowledge'} McpCategory */
/** @typedef {'cursor'|'claude'|'vscode'|'codex'} McpClient */

/**
 * @typedef {object} FreeMcp
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {McpCategory} category
 * @property {string[]} tags
 * @property {{ command: string, args: string[] }} install
 * @property {string} githubUrl
 * @property {string} license
 * @property {McpClient[]} clients
 * @property {boolean} [featured]
 * @property {true} noEnv
 * @property {boolean} [zeroConfig]
 */

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** @type {FreeMcp[]|null} */
let cached = null;

/**
 * Load catalog JSON (bundled copy; mirrors src/data/free-mcps.json).
 * @returns {FreeMcp[]}
 */
export function loadCatalog() {
  if (cached) return cached;
  const path = join(__dirname, "..", "data", "free-mcps.json");
  const raw = readFileSync(path, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error("Catalog must be a JSON array");
  }
  cached = data;
  return cached;
}

/**
 * @param {string} id
 * @returns {boolean}
 */
export function isValidMcpId(id) {
  if (typeof id !== "string") return false;
  const trimmed = id.trim();
  // Require already-lowercase kebab-case (do not coerce case).
  return trimmed === trimmed.toLowerCase() && ID_PATTERN.test(trimmed);
}

/**
 * @param {string} name
 * @returns {string}
 */
export function sanitizeServerName(name) {
  const cleaned = String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return cleaned.length > 0 ? cleaned : "mcp-server";
}

/**
 * @param {string} id
 * @returns {FreeMcp|undefined}
 */
export function getMcpById(id) {
  if (!isValidMcpId(id)) return undefined;
  const normalized = id.trim().toLowerCase();
  return loadCatalog().find((m) => m.id === normalized);
}

/**
 * @param {{ category?: string, query?: string }} [options]
 * @returns {FreeMcp[]}
 */
export function listFreeMcps(options = {}) {
  const category = options.category?.trim();
  const query = options.query?.trim().toLowerCase();
  return loadCatalog().filter((mcp) => {
    if (category && mcp.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    if (!query) return true;
    const haystack = [mcp.id, mcp.name, mcp.description, mcp.category, ...mcp.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

/**
 * @param {string} query
 * @returns {FreeMcp[]}
 */
export function searchMcps(query) {
  return listFreeMcps({ query: String(query ?? "") });
}

/**
 * @param {FreeMcp} mcp
 * @param {McpClient} client
 * @returns {{ client: McpClient, json: string, config: Record<string, unknown> }}
 */
export function getInstallConfig(mcp, client) {
  const key = sanitizeServerName(mcp.id);
  const stdio = {
    command: mcp.install.command,
    args: [...mcp.install.args],
  };

  /** @type {Record<string, unknown>} */
  let config;
  if (client === "vscode") {
    config = {
      servers: {
        [key]: { type: "stdio", ...stdio },
      },
    };
  } else {
    config = {
      mcpServers: {
        [key]: stdio,
      },
    };
  }

  return {
    client,
    config,
    json: JSON.stringify(config, null, 2),
  };
}

/**
 * @param {string} value
 * @returns {McpClient|null}
 */
export function parseClient(value) {
  const v = String(value ?? "")
    .trim()
    .toLowerCase();
  if (v === "cursor" || v === "claude" || v === "vscode" || v === "codex") {
    return v;
  }
  return null;
}
