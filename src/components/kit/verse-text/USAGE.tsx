"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "text": "And a lean, silent figure slowly fades into the gathering darkness, aware at last that in this world, with great power there must also come... great responsibility!",
  "seed": 1610,
  "autoplay": true,
  "idle": true,
  "speed": 1,
  "className": "verse-text-preview"
}} />;
}
