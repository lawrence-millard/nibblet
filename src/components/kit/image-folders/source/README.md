# Image folders

Adapted from the user-provided ImageFolder / ImageFolders component. Preserves the SVG silhouettes, transforms, spring (280 / 24), file spacing, hover, pinned-open, and selection states.

Requires React and `motion`. Uses native buttons and CSS Modules without Tailwind, shadcn Button, or Nibble's variables and fonts. The Component.jsx export includes the styles and both functions; Motion remains an external dependency. Google Material Symbols SVG icons are included.

`ImageFolder` accepts `images`, `label`, `dark` (inverted cover), and `archive` (three-dot action). `ImageFolders` arranges the four example variants. Both accept `appearance="light" | "dark"` and `paused` to suspend transitions. Images use the shape `{ id, src, label }`; use unique IDs within each folder. Demo images are Unsplash photographs and can be replaced with your own URLs.

For integration with an application, `onOpenChange(open)` reports the pinned-open state and `onImageSelect(image)` receives the selected file. `countLabel` can display a total different from the number of visible thumbnails. Nibble Favorites uses these callbacks to navigate folders and open components. Optional CSS variables `--folder-label-size` and `--folder-count-size` adjust labels without importing website styles.
