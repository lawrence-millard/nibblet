"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "src": "https://github.com/lawrence-millard/nibblet/footer/alpine-landscape.webp",
  "alt": "An alpine valley rendered as black-and-white ASCII art.",
  "cellSize": 4,
  "contrast": 1.3333333333333333,
  "brightness": 0,
  "characters": " .,:;ilox%#@",
  "foreground": "#ffffff",
  "background": "#000000",
  "opacity": 0.7,
  "invert": false,
  "fit": "cover",
  "position": "bottom",
  "showLogo": true,
  "logoSize": 160,
  "fadeTop": 24
}} />;
}
