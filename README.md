# Nibblet

Free MCP catalog + interactive component studio.

**Live routes**
- `/` — lander
- `/catalog` — free MCP servers (zero env)
- `/components` — live kit studio
- `/unlumen` — free Unlumen demos

```bash
npm install
npm run dev
```

| Script | What it does |
|--------|----------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm test` | Vitest |
| `npm run mcp` | Run `@nibblet/mcp` over stdio |
| `npm run test:mcp` | MCP package tests |
| `npm run kit:fetch` | Refresh kit components |
| `npm run kit:registry` | Regenerate demo registry |

## Connect the MCP

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

MIT
