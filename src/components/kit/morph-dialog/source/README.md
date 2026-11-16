# Morph dialog

A native dialog that expands from its trigger and returns to it when closed. Uses the same motion engine as Nibble's component cards and Get Pro dialog. Requires React; no animation library is needed.

```tsx
import { MorphDialog } from "./morph-dialog/morph-dialog";

export default function Example() {
  return <MorphDialog trigger="Open dialog" title="Dialog">
    <p>Your content goes here.</p>
  </MorphDialog>;
}
```

Use `triggerClassName` to style the button or turn it into a card; `className` styles the dialog. The component owns opening and closing. Native dialog behavior supplies focus containment; closing restores focus to the trigger. Escape and keyboard activation are immediate. Reduced motion uses a fade instead of spatial movement. Overlay clicks and the close button dismiss the dialog.

For controlled dialogs, import `MorphSurface`, `MorphOrigin` and `DialogHandle` from `morph-surface.tsx`. Capture the source element's bounding rectangle before opening and unmount the surface in its `close` callback. Call `dismiss()` on its ref for an animated close.

Theme with `--bg`, `--soft`, `--ink`, `--muted`, and `--font-sans`. Defaults work without Nibble's site styles.
