"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "height": "100dvh",
  "speed": 1,
  "ink": "#000000",
  "paper": "#fafcfc",
  "paused": false,
  "replayKey": 0
}} />;
}
