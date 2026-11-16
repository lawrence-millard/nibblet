# Nibblet

**Free MCP for free everything.** A fast, secure catalog of open-source Model Context Protocol servers plus a nibble.lat-inspired interactive UI kit.

- Zero required `.env` variables
- Local stdio installs only (no secret injection in generated configs)
- Security headers + CSP on the Next.js app
- Bundled `@nibblet/mcp` catalog server

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | What it does |
|--------|----------------|
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest (catalog + config) |
| `npm run test:mcp` | Tests for `@nibblet/mcp` |
| `npm run mcp` | Run the Nibblet MCP server over stdio |

## Connect the Nibblet MCP

Add to Cursor / Claude / Codex:

```json
{
  "mcpServers": {
    "nibblet-mcp": {
      "command": "npx",
      "args": ["-y", "@nibblet/mcp"]
    }
  }
}
```

For local development from this repo:

```json
{
  "mcpServers": {
    "nibblet-mcp": {
      "command": "node",
      "args": ["packages/nibblet-mcp/src/index.js"]
    }
  }
}
```

Tools: `list_free_mcps`, `get_mcp`, `search_mcps`, `get_install_config`.

## Stack

- Next.js App Router + Tailwind CSS
- Framer Motion + `@onlymoein/liquidglass` (MIT)
- Static JSON catalog (`src/data/free-mcps.json`)
- Vitest

## License

MIT
