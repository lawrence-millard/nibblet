"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "name": "Kevin",
  "accent": "#0a84ff",
  "autoplay": true,
  "appearance": "auto",
  "replayKey": 0
}} />;
}
