"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "serviceName": "Nibblet",
  "description": "Components, fonts and tools for your AI",
  "serverKey": "nibblet",
  "serverUrl": "https://github.com/lawrence-millard/nibblet/api/mcp",
  "packageName": "mcp-remote",
  "envKey": "NIBBLET_MCP_API_KEY",
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
