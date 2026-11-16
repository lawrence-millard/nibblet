# Nibblet

**Free MCP for free everything.** A fast, secure catalog of open-source Model Context Protocol servers plus a nibble.lat-inspired interactive UI kit.

**Live:** [https://nibblet.vercel.app](https://nibblet.vercel.app)

- Zero required `.env` variables
- Local stdio installs only (no secret injection in generated configs)
- Security headers + CSP on the Next.js app
- Bundled `@nibblet/mcp` catalog server
- 179 free Unlumen UI components at [`/unlumen`](https://nibblet.vercel.app/unlumen)

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

## Unlumen free UI

Free components from the [Unlumen UI](https://ui.unlumen.com) shadcn registry (`@unlumen-ui`) are installed under `src/components/unlumen-ui` — no `UNLUMEN_LICENSE_KEY` / `.env`. Browse them at [nibblet.vercel.app/unlumen](https://nibblet.vercel.app/unlumen). The free name list lives in `src/data/unlumen-free.json`; install failures (premium-only deps) in `src/data/unlumen-install-failures.json`. Skipped Pro components require a license.

## Stack

- Next.js App Router + Tailwind CSS
- Framer Motion + `motion` + `@onlymoein/liquidglass` (MIT)
- shadcn/ui + free Unlumen registry components
- Static JSON catalog (`src/data/free-mcps.json`)
- Vitest

## License

MIT
