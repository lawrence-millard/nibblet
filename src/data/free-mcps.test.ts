import { describe, expect, it } from "vitest";
import {
  MCP_CATEGORIES,
  MCP_CLIENTS,
  freeMcps,
  getMcpById,
  listFreeMcps,
  searchMcps,
  type FreeMcp,
  type McpCategory,
  type McpClient,
} from "./free-mcps";

const CATEGORY_SET = new Set<string>(MCP_CATEGORIES);
const CLIENT_SET = new Set<string>(MCP_CLIENTS);

describe("free MCP catalog integrity", () => {
  it("contains a useful number of servers", () => {
    expect(freeMcps.length).toBeGreaterThanOrEqual(25);
    expect(freeMcps.length).toBeLessThanOrEqual(40);
  });

  it("has unique ids", () => {
    const ids = freeMcps.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requires core fields on every entry", () => {
    for (const mcp of freeMcps) {
      expect(mcp.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(mcp.name.length).toBeGreaterThan(0);
      expect(mcp.description.length).toBeGreaterThan(10);
      expect(CATEGORY_SET.has(mcp.category)).toBe(true);
      expect(Array.isArray(mcp.tags)).toBe(true);
      expect(mcp.tags.length).toBeGreaterThan(0);
      expect(mcp.githubUrl).toMatch(/^https:\/\//);
      expect(mcp.license.length).toBeGreaterThan(0);
      expect(Array.isArray(mcp.clients)).toBe(true);
      expect(mcp.clients.length).toBeGreaterThan(0);
      for (const client of mcp.clients) {
        expect(CLIENT_SET.has(client)).toBe(true);
      }
    }
  });

  it("sets noEnv true on every entry", () => {
    for (const mcp of freeMcps) {
      expect(mcp.noEnv).toBe(true);
    }
  });

  it("has install.command and install.args arrays", () => {
    for (const mcp of freeMcps) {
      expect(typeof mcp.install.command).toBe("string");
      expect(mcp.install.command.length).toBeGreaterThan(0);
      expect(Array.isArray(mcp.install.args)).toBe(true);
      expect(mcp.install.args.length).toBeGreaterThan(0);
      for (const arg of mcp.install.args) {
        expect(typeof arg).toBe("string");
      }
    }
  });

  it("marks at least one featured and several zero-config servers", () => {
    expect(freeMcps.some((m) => m.featured)).toBe(true);
    expect(freeMcps.filter((m) => m.zeroConfig).length).toBeGreaterThanOrEqual(5);
  });

  it("looks up and filters by helpers", () => {
    const first = freeMcps[0] as FreeMcp;
    expect(getMcpById(first.id)?.id).toBe(first.id);
    expect(getMcpById("definitely-missing-id-xyz")).toBeUndefined();

    const category = first.category as McpCategory;
    const byCategory = listFreeMcps({ category });
    expect(byCategory.every((m) => m.category === category)).toBe(true);

    const hits = searchMcps("filesystem");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((m) => m.id.includes("filesystem") || m.name.toLowerCase().includes("filesystem"))).toBe(
      true,
    );

    const client = first.clients[0] as McpClient;
    expect(CLIENT_SET.has(client)).toBe(true);
  });
});
