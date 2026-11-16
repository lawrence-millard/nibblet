"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "size": 128,
  "hue": 220,
  "bounce": 35,
  "status": "none",
  "customStatus": "",
  "paused": false,
  "disabled": false,
  "replayKey": 0
}} />;
}
