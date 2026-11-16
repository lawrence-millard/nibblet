"use client";

import { Component } from "./Component";

export default function Example() {
  return <Component {...{
  "amount": 100000,
  "recipient": "Müller Logistik GmbH",
  "account": "Grain USD account",
  "exchangeRate": 0.92,
  "duration": 4.8,
  "glowStrength": 1,
  "cardWidth": 456,
  "paused": false,
  "replayKey": 0
}} />;
}
