# @nibble/mcp

Tiny stdio [MCP](https://modelcontextprotocol.io) server that exposes Nibble’s **free / open-source MCP catalog**.

- **Zero env vars** — no API keys, no telemetry
- Tools: `list_free_mcps`, `get_mcp`, `get_install_config`, `search_mcps`
- Install configs for Cursor, Claude Desktop, VS Code, and Codex (stdio only, no secrets)

## Run

```bash
npx @nibble/mcp
# or from this repo:
node packages/nibble-mcp/src/index.js
```

### Cursor (`mcp.json`)

```json
{
  "mcpServers": {
    "nibble": {
      "command": "npx",
      "args": ["-y", "@nibble/mcp"]
    }
  }
}
```

Until published, point at the local entry:

```json
{
  "mcpServers": {
    "nibble": {
      "command": "node",
      "args": ["./packages/nibble-mcp/src/index.js"]
    }
  }
}
```

## Tools

| Tool | Purpose |
|------|---------|
| `list_free_mcps` | List catalog entries; optional `category` / `query` |
| `get_mcp` | Fetch one entry by `id` |
| `get_install_config` | Emit client JSON for `id` + `client` |
| `search_mcps` | Search by free-text `query` |

Ids are validated (kebab-case). Install `command` / `args` are never evaluated — only serialized from the catalog.

## Catalog source

Canonical data lives at `src/data/free-mcps.json` in the Nibble monorepo. This package ships a mirrored copy at `data/free-mcps.json`. Keep them in sync when editing entries.

## Security

- No environment variables required or read for catalog tools
- No network calls from this server
- No `eval` / shell execution of install strings

## License

MIT
