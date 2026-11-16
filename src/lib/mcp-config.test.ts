import { freeMcps, getMcpById } from "@/data/free-mcps";
import { describe, expect, it } from "vitest";
import {
  getInstallConfig,
  isValidMcpId,
  sanitizeServerName,
} from "./mcp-config";

describe("mcp-config", () => {
  it("sanitizes server names", () => {
    expect(sanitizeServerName("Hello World!")).toBe("hello-world");
    expect(sanitizeServerName("")).toBe("mcp-server");
  });

  it("validates kebab-case ids", () => {
    expect(isValidMcpId("nibblet-mcp")).toBe(true);
    expect(isValidMcpId("Bad_Id")).toBe(false);
  });

  it("emits configs with no env fields", () => {
    const mcp = getMcpById("memory") ?? freeMcps[0];
    for (const client of ["cursor", "claude", "vscode", "codex"] as const) {
      const snippet = getInstallConfig(mcp, client);
      expect(snippet.json).not.toMatch(/"env"/);
      expect(snippet.json).toContain(mcp.install.command);
    }
  });
});
