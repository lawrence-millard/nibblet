# Glyph Card Blue

Integrates the original engine from MetalForge's public preview: https://metalforge.xyz/glyphblue. It preserves the WebGL 2 shaders, formulas, embedded fonts, colors, and pointer response. The host removes the original foreground logo, sentence, and labels, leaving only the animated background.

The original module factories are preserved verbatim in `vendor/glyphblue-runtime.js`; only the Turbopack loader is replaced by a local adapter. `vendor/provenance.json` records the public URLs and SHA-256 hashes of the original factories. The Pro export API was not used. Technical provenance alone does not establish a redistribution license from the provider.

Requires React and a browser with WebGL 2. Copy this entire folder. It needs no additional dependencies, remote MetalForge files, or Nibble styles.

```tsx
import { GlyphBlue } from "./glyphblue/glyphblue";

export default function Example() {
  return <GlyphBlue height={420} appearance="dark" />;
}
```

Props: `width` (default 100%), `height` (default 420px, a number or CSS length), `appearance` (`auto`, `light`, `dark`), `paused`, and `settings` (original engine values; see `KNOBS`). Settings update through `set()` without rebuilding the background. `settings` overrides `appearance`, but `sentence`, `label1`, `label2`, and `mark` are always disabled. The field uses symbols by default; use `settings.word` to set a pattern word.

Host styles use CSS Modules; the engine lives in Shadow DOM to isolate it from page styles. It respects reduced motion, pauses offscreen, and cleans up its canvas, WebGL context, listeners, and observers on unmount.

To repeat the import of the recorded public resources, run `node scripts/import-glyphblue.mjs` from the Nibble root. Factory fingerprints normalize only line endings to LF.

The background fills its container without enforcing an aspect ratio. Use `height="100%"` to fill a container with a defined height. Corners are square by default; adjust them with `settings.radius`.
