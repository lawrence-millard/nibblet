"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "initialMenu": "none",
  "initialLandscape": "canyons",
  "contactLabel": "Contact",
  "width": 1100,
  "height": 540,
  "menuOpacity": 0.88,
  "blur": 10,
  "duration": 280,
  "showBackground": true,
  "replayKey": 0,
  "fill": true
}} />;
}
