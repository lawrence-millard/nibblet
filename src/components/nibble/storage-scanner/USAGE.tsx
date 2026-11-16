"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "capacityGB": 512,
  "width": 584,
  "scanDuration": 4.6,
  "cleanDuration": 2.8,
  "autoStart": true,
  "paused": false,
  "pixelSize": 4,
  "seed": 7,
  "replayKey": 0,
  "glow": 1,
  "brightness": 1
}} />;
}
