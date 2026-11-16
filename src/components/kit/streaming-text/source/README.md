# StreamingText

A React adaptation of ClyraADE's streaming text reveal. The reference is `crates/ui/src/markdown/veil.rs`, with timings defined in `crates/ui/src/motion.rs`:

- A 1500 ms fade per word, using `cubic-bezier(0.42, 0, 0.58, 1)`.
- A 16 ms delay between words in the same chunk.
- The reveal queue never exceeds 500 ms, even during large bursts.
- A partial word keeps its animation clock when more characters arrive. Existing text does not animate again.
- Only opacity changes. Text enters the layout immediately and remains selectable.

Requires only React. Copy this entire folder; its CSS Module does not use Nibble's fonts, variables, or classes. The effect uses the Web Animations API, cancels animations on unmount, and respects reduced motion. Pausing stops both the animations and their logical clock.

```tsx
import { StreamingText } from "./streaming-text/streaming-text";

// responseText contains the accumulated response from your stream.
<StreamingText text={responseText} streaming={isStreaming} />
```

The parent receives and concatenates server chunks. This component does not call an AI or generate text. It does not add a typing cursor or process Markdown: it adapts the chat reveal effect and preserves line breaks.

Props: `text`, `streaming`, `fadeDuration`, `wordDelay`, `maxRevealLag`, `paused`, `animateInitial`, `fontSize`, and `appearance` (`dark` or `light`). Initial text is shown immediately by default, like Clyra's chat history. Use `animateInitial` to animate a complete initial message.

Ending the stream allows the final fades to finish. If an already completed response changes while `streaming={false}`, it is displayed without animation. Use a different `key` for independent messages.
