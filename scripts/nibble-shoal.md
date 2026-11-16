# Koi pond

A pond of character-based fish that follow your cursor and create ripples when you touch the water.

- Categories: Backgrounds
- Canonical page: https://nibble.lat/components/shoal
- Public source: https://nibble.lat/api/components/shoal
- Dependencies: React; no additional component packages listed
- Creator: Galavic
- Patterns: Canvas, ASCII art, Animated background
- Interactions: Follow the cursor, Create ripples, Configure the pond, Pause and resume

## Integration

Fetch the source endpoint for the current self-contained singleFile, usage example, dependencies and original files. Preserve bundled licenses and verify the component in your project.

## Usage

```tsx
"use client";

import { Shoal } from "./shoal/shoal";

export default function Example() {
  return <Shoal count={2} seed={7} height={420} appearance="dark" />;
}
```

[Integration guide](https://nibble.lat/agents.md)
