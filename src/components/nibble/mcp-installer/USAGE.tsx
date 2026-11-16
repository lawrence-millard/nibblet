"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "serviceName": "Nibble",
  "description": "Components, fonts and tools for your AI",
  "serverKey": "nibble",
  "serverUrl": "https://nibble.lat/api/mcp",
  "packageName": "mcp-remote",
  "envKey": "NIBBLE_MCP_API_KEY",
  "apiKey": "",
  "client": "cursor",
  "transport": "remote",
  "scope": "project",
  "connection": "idle",
  "simulateConnection": true,
  "tools": 10,
  "width": 460,
  "replayKey": 0
}} />;
}
