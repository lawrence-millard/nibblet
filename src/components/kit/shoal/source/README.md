# Shoal

Adapted from `app/side-shoal.tsx` in portafolio-galavic. Includes the local engine and original MetalForge Shoal settings: https://metalforge.xyz/shoal. Original provenance comments are preserved.

Requires React. Copy this entire folder into your project and import `Shoal` from `./shoal/shoal`. It does not need Nibble's icon dependencies, Radix, fonts, or styles. The engine and its fonts are included; it makes no requests to external services.

```tsx
import { Shoal } from "./shoal/shoal";

export default function Example() {
  return <Shoal count={2} seed={7} height={420} appearance="dark" />;
}
```

Props: `count` (0-10), `seed`, `height` (pixels or a CSS length), `appearance` (`auto`, `dark`, or `light`), `paused`, and `settings` (the original engine settings). Settings update live without remounting the canvas. Appearance is explicit by default. Set `appearance="auto"` to follow the page theme. Use `settings.clear=true` for a transparent background or `settings.colorful=true` for the color palette.

Host styles are isolated with CSS Modules; engine styles live inside its Shadow DOM. No global styles are imported. Unmounting removes the canvas, observers, and listeners. It respects `prefers-reduced-motion`, pauses offscreen, and creates ripples when you click or touch the pond.
