"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "activity": "timer",
  "expanded": false,
  "autoplay": true,
  "bounce": 28,
  "paused": false,
  "appearance": "auto",
  "replayKey": 0
}} />;
}
