import { describe, expect, it } from "vitest";
import {
  getInstallConfig,
  getMcpById,
  isValidMcpId,
  listFreeMcps,
  loadCatalog,
  parseClient,
  sanitizeServerName,
  searchMcps,
} from "./catalog.js";

describe("catalog helpers", () => {
  it("loads a non-empty catalog", () => {
    const catalog = loadCatalog();
    expect(catalog.length).toBeGreaterThanOrEqual(25);
    expect(catalog.every((m) => m.noEnv === true)).toBe(true);
  });

  it("validates ids", () => {
    expect(isValidMcpId("filesystem")).toBe(true);
    expect(isValidMcpId("sequential-thinking")).toBe(true);
    expect(isValidMcpId("../etc/passwd")).toBe(false);
    expect(isValidMcpId("UPPER")).toBe(false);
    expect(isValidMcpId("has spaces")).toBe(false);
  });

  it("sanitizes server names", () => {
    expect(sanitizeServerName("My Cool MCP!")).toBe("my-cool-mcp");
    expect(sanitizeServerName("///")).toBe("mcp-server");
  });

  it("gets by id and rejects invalid ids", () => {
    const mcp = getMcpById("memory");
    expect(mcp?.id).toBe("memory");
    expect(getMcpById("../x")).toBeUndefined();
    expect(getMcpById("no-such-server")).toBeUndefined();
  });

  it("filters by category and query", () => {
    const browsers = listFreeMcps({ category: "Browser" });
    expect(browsers.length).toBeGreaterThan(0);
    expect(browsers.every((m) => m.category === "Browser")).toBe(true);

    const q = listFreeMcps({ query: "sqlite" });
    expect(q.some((m) => m.id === "sqlite")).toBe(true);
  });

  it("searches across name and tags", () => {
    const hits = searchMcps("wikipedia");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.id).toContain("wikipedia");
  });

  it("parses clients and builds install config without env", () => {
    expect(parseClient("cursor")).toBe("cursor");
    expect(parseClient("nope")).toBeNull();

    const mcp = getMcpById("memory");
    expect(mcp).toBeDefined();
    if (!mcp) return;

    const cursor = getInstallConfig(mcp, "cursor");
    expect(cursor.json).toContain("mcpServers");
    expect(cursor.json).not.toMatch(/"env"\s*:/);
    expect(cursor.config).not.toHaveProperty("env");

    const vscode = getInstallConfig(mcp, "vscode");
    expect(vscode.json).toContain('"type": "stdio"');
    expect(JSON.stringify(vscode.config)).not.toMatch(/"env"\s*:/);
  });
});
