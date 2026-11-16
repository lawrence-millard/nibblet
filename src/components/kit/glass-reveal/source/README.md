# Glass reveal

The same WebGL glass refraction animation used by Nibble's Get Pro logo. Requires React and WebGL 2. No animation library or external asset is required: the default Nibble logo is embedded.

```tsx
import { GlassReveal } from "./glass-reveal/glass-reveal";

export default function Example() {
  return <GlassReveal size={180} />;
}
```

Props: `src` accepts a logo image URL; `size` accepts pixels or a CSS size string; `paused` pauses the current frame; changing `replayKey` restarts the reveal; `interactive={false}` renders a non-interactive image suitable for a card preview. `appearance` accepts `auto`, `dark`, or `light`. `label` controls the accessible name.

The component plays once on entering the viewport, then parks its render loop. Clicking or hovering with a mouse replays it. It pauses off screen and when the tab is hidden, and releases observers and WebGL resources on unmount. Reduced motion and unavailable WebGL use a static logo.

Colors inherit from the surrounding text and background. `auto` follows the document's `data-theme` attribute. For custom images, use a same-origin URL or a data URL to keep the canvas readable.

Renderer adapted from [zanwei/glass-icon-reveal](https://github.com/zanwei/glass-icon-reveal), MIT. See the included LICENSE.
