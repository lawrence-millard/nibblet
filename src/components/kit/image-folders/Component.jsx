"use client";

// Self-contained ImageFolders / ImageFolder: component and styles. Requires React and motion.
import * as React from "react";

// src/components/catalog/image-folders/image-folders.tsx
import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

// src/components/catalog/image-folders/image-folders.module.css
var image_folders_default = {
  folder: "image_folders_folder",
  definitions: "image_folders_definitions",
  back: "image_folders_back",
  front: "image_folders_front",
  file: "image_folders_file",
  control: "image_folders_control",
  caption: "image_folders_caption",
  label: "image_folders_label",
  count: "image_folders_count",
  action: "image_folders_action",
  outline: "image_folders_outline",
  dark: "image_folders_dark",
  selection: "image_folders_selection",
  grid: "image_folders_grid"
};

// src/components/catalog/image-folders/image-folders.tsx
var folderIconPaths = {
  "add": "M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z",
  "close": "M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z",
  "more_horiz": "M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"
};
function FolderIcon({ name }) {
  return <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d={folderIconPaths[name]} /></svg>;
}
function ImageFolder({ images, label = "My Files", dark = false, archive = false, appearance = "light", paused = false, countLabel, onOpenChange, onImageSelect }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [selected, setSelected] = useState(null);
  const reduce = useReducedMotion();
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const open = hovered || pinned;
  const instant = reduce || paused;
  const transition = instant ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 24 };
  const selectedImage = images.find((image) => image.id === selected);
  return <div
    className={`${image_folders_default.folder} ${dark ? image_folders_default.dark : ""}`}
    data-image-folder
    data-appearance={appearance}
    data-open={open}
    data-pinned={pinned}
    onPointerEnter={(event) => {
      if (event.pointerType === "mouse") setHovered(true);
    }}
    onPointerLeave={() => {
      setHovered(false);
      if (!pinned) setSelected(null);
    }}
    onKeyDown={(event) => {
      if (event.key === "Escape" && (open || selected)) {
        event.preventDefault();
        event.stopPropagation();
        setPinned(false);
        setHovered(false);
        setSelected(null);
        onOpenChange?.(false);
      }
    }}
  >
    <svg width="0" height="0" className={image_folders_default.definitions} aria-hidden="true"><defs>
      <clipPath id={`${id}-back`} clipPathUnits="objectBoundingBox"><path d="M0,.24 Q0,.14 .07,.14 H.44 Q.48,.14 .51,.09 L.56,.03 Q.59,0 .64,0 H.93 Q1,0 1,.1 V.9 Q1,1 .93,1 H.07 Q0,1 0,.9 Z" /></clipPath>
      <clipPath id={`${id}-front`} clipPathUnits="objectBoundingBox"><path d="M0,.1 Q0,0 .07,0 H.35 Q.39,0 .42,.04 L.48,.12 Q.51,.16 .56,.16 H.93 Q1,.16 1,.26 V.9 Q1,1 .93,1 H.07 Q0,1 0,.9 Z" /></clipPath>
    </defs></svg>
    <div className={image_folders_default.back} style={{ clipPath: `url(#${id}-back)` }} aria-hidden="true" />
    {images.map((image, i) => {
    const offset = images.length > 1 ? i / (images.length - 1) - 0.5 : 0;
    const active = selected === image.id;
    return <motion.button
      type="button"
      key={image.id}
      className={image_folders_default.file}
      aria-label={`Preview ${image.label} file`}
      aria-pressed={active}
      style={{ zIndex: active ? images.length + 1 : i + 1 }}
      initial={false}
      animate={{
        x: pinned ? offset * 120 : open ? offset * 12 : 0,
        y: pinned ? active ? -172 : -148 + Math.abs(offset) * 26 : active ? -76 : open ? -34 - i * 15 : -i * (archive ? 3 : 7),
        rotate: pinned && active ? 0 : pinned ? offset * 16 : active ? 0 : open ? offset * 7 : offset * 2,
        scale: pinned ? active ? 1.1 : 1 : active ? 1.03 : 1
      }}
      transition={{ ...transition, delay: instant ? 0 : i * 0.035 }}
      onFocus={() => {
        if (!pinned) setHovered(true);
      }}
      onClick={() => {
        setPinned(true);
        setSelected(active ? null : image.id);
        onOpenChange?.(true);
        onImageSelect?.(image);
      }}
    >
        <img src={image.src} alt={image.label} width={400} height={224} draggable={false} />
      </motion.button>;
  })}
    <motion.div
    className={image_folders_default.front}
    initial={false}
    style={{ clipPath: `url(#${id}-front)`, transformOrigin: "bottom", transformPerspective: 800 }}
    animate={{ rotateX: pinned ? -26 : open ? -14 : 0, y: open ? 4 : 0 }}
    transition={transition}
    aria-hidden="true"
  />
    <motion.button
    type="button"
    className={image_folders_default.control}
    aria-label={`${pinned ? "Close" : "Open"} ${label} folder`}
    aria-expanded={open}
    initial={false}
    animate={{ y: open ? 4 : 0 }}
    transition={transition}
    onClick={() => {
      setPinned(!pinned);
      setHovered(false);
      setSelected(null);
      onOpenChange?.(!pinned);
    }}
  >
      <span className={image_folders_default.caption}><span className={image_folders_default.label}>{label}</span><span className={image_folders_default.count}>{countLabel ?? `${images.length} ${images.length === 1 ? "item" : "items"}`}</span></span>
      <span className={`${image_folders_default.action} ${archive ? image_folders_default.outline : ""}`}>{pinned ? <FolderIcon name="close" /> : archive ? <FolderIcon name="more_horiz" /> : <FolderIcon name="add" />}</span>
    </motion.button>
    <span className={image_folders_default.selection} aria-live="polite">{selectedImage?.label ?? ""}</span>
  </div>;
}
function ImageFolders({ images, appearance = "light", paused = false }) {
  return <div className={image_folders_default.grid} data-image-folders>
    <ImageFolder images={images.slice(0, 3)} appearance={appearance} paused={paused} />
    <ImageFolder images={images} label="Archives" archive appearance={appearance} paused={paused} />
    <ImageFolder images={[...images].reverse().slice(0, 3)} label="Studio" dark appearance={appearance} paused={paused} />
    <ImageFolder images={images.slice(1)} label="Collection" archive appearance={appearance} paused={paused} />
  </div>;
}

// src/components/catalog/image-folders/Component.jsx
function ImageFolders2(props) {
  return <><style>{"/* src/components/catalog/image-folders/image-folders.module.css */\n.image_folders_folder {\n  --folder-card: #fff;\n  --folder-foreground: #202020;\n  --folder-primary: #202020;\n  --folder-primary-foreground: #fff;\n  position: relative;\n  height: 208px;\n  width: 100%;\n  min-width: 0;\n  isolation: isolate;\n  filter: drop-shadow(0 12px 10px color-mix(in oklab, var(--folder-foreground) 10%, transparent));\n  font-family: system-ui, sans-serif;\n}\n.image_folders_folder[data-appearance=dark] {\n  --folder-card: #262626;\n  --folder-foreground: #f4f4f4;\n  --folder-primary: #f4f4f4;\n  --folder-primary-foreground: #202020;\n}\n.image_folders_folder,\n.image_folders_folder * {\n  box-sizing: border-box;\n}\n.image_folders_definitions {\n  position: absolute;\n}\n.image_folders_back,\n.image_folders_front {\n  position: absolute;\n  bottom: 20px;\n  width: 100%;\n}\n.image_folders_back {\n  height: 140px;\n  background: color-mix(in oklab, var(--folder-card) 24%, transparent);\n  box-shadow: inset 0 1px 0 color-mix(in oklab, var(--folder-card) 65%, transparent);\n}\n.image_folders_front {\n  height: 120px;\n  z-index: 10;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      160deg,\n      color-mix(in oklab, var(--folder-card) 42%, transparent),\n      color-mix(in oklab, var(--folder-card) 16%, transparent));\n  backdrop-filter: blur(5px);\n  box-shadow: inset 0 1px 1px color-mix(in oklab, var(--folder-card) 80%, transparent);\n}\n.image_folders_file {\n  position: absolute;\n  bottom: 30px;\n  left: 8%;\n  height: 112px;\n  width: 84%;\n  overflow: hidden;\n  border-radius: 8px;\n  border: 1px solid color-mix(in oklab, var(--folder-card) 30%, transparent);\n  background: var(--folder-card);\n  padding: 0;\n  box-shadow: 0 4px 8px #0002;\n  cursor: pointer;\n}\n.image_folders_file img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  user-select: none;\n}\n.image_folders_control {\n  position: absolute;\n  bottom: 20px;\n  left: 0;\n  z-index: 20;\n  width: 100%;\n  height: 90px;\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 0 16px 16px;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--folder-foreground);\n  text-align: left;\n  cursor: pointer;\n  font: inherit;\n}\n.image_folders_caption {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 0;\n}\n.image_folders_label {\n  font-size: var(--folder-label-size, 12px);\n  font-weight: 500;\n  overflow-wrap: anywhere;\n}\n.image_folders_count {\n  font: var(--folder-count-size, 9px)/1.4 ui-monospace, monospace;\n  opacity: .6;\n}\n.image_folders_action {\n  display: grid;\n  place-items: center;\n  flex-shrink: 0;\n  width: 28px;\n  height: 28px;\n  border-radius: 8px;\n  background: var(--folder-primary);\n  color: var(--folder-primary-foreground);\n  box-shadow: 0 3px 6px color-mix(in oklab, var(--folder-foreground) 15%, transparent);\n}\n.image_folders_action svg {\n  width: 16px;\n  height: 16px;\n}\n.image_folders_outline {\n  background: color-mix(in oklab, var(--folder-card) 20%, transparent);\n  color: inherit;\n  border: 1px solid color-mix(in oklab, var(--folder-foreground) 12%, transparent);\n  box-shadow: none;\n}\n.image_folders_dark .image_folders_back {\n  background: color-mix(in oklab, var(--folder-foreground) 35%, transparent);\n}\n.image_folders_dark .image_folders_front {\n  background:\n    linear-gradient(\n      160deg,\n      color-mix(in oklab, var(--folder-foreground) 65%, transparent),\n      color-mix(in oklab, var(--folder-foreground) 86%, transparent));\n}\n.image_folders_dark .image_folders_control {\n  color: var(--folder-card);\n}\n.image_folders_selection {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  min-height: 14px;\n  text-align: center;\n  font: 10px/1.4 ui-monospace, monospace;\n  color: var(--folder-foreground);\n  pointer-events: none;\n}\n.image_folders_file:focus-visible,\n.image_folders_control:focus-visible {\n  outline: 2px solid var(--folder-foreground);\n  outline-offset: 4px;\n}\n.image_folders_grid {\n  display: grid;\n  width: 100%;\n  max-width: 440px;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 8px 20px;\n  padding: 0 20px;\n}\n@media (max-width: 360px) {\n  .image_folders_grid {\n    gap: 8px 12px;\n    padding-inline: 10px;\n  }\n  .image_folders_control {\n    padding-inline: 10px;\n  }\n}\n"}</style><ImageFolders {...props} /></>;
}
function ImageFolder2(props) {
  return <><style>{"/* src/components/catalog/image-folders/image-folders.module.css */\n.image_folders_folder {\n  --folder-card: #fff;\n  --folder-foreground: #202020;\n  --folder-primary: #202020;\n  --folder-primary-foreground: #fff;\n  position: relative;\n  height: 208px;\n  width: 100%;\n  min-width: 0;\n  isolation: isolate;\n  filter: drop-shadow(0 12px 10px color-mix(in oklab, var(--folder-foreground) 10%, transparent));\n  font-family: system-ui, sans-serif;\n}\n.image_folders_folder[data-appearance=dark] {\n  --folder-card: #262626;\n  --folder-foreground: #f4f4f4;\n  --folder-primary: #f4f4f4;\n  --folder-primary-foreground: #202020;\n}\n.image_folders_folder,\n.image_folders_folder * {\n  box-sizing: border-box;\n}\n.image_folders_definitions {\n  position: absolute;\n}\n.image_folders_back,\n.image_folders_front {\n  position: absolute;\n  bottom: 20px;\n  width: 100%;\n}\n.image_folders_back {\n  height: 140px;\n  background: color-mix(in oklab, var(--folder-card) 24%, transparent);\n  box-shadow: inset 0 1px 0 color-mix(in oklab, var(--folder-card) 65%, transparent);\n}\n.image_folders_front {\n  height: 120px;\n  z-index: 10;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      160deg,\n      color-mix(in oklab, var(--folder-card) 42%, transparent),\n      color-mix(in oklab, var(--folder-card) 16%, transparent));\n  backdrop-filter: blur(5px);\n  box-shadow: inset 0 1px 1px color-mix(in oklab, var(--folder-card) 80%, transparent);\n}\n.image_folders_file {\n  position: absolute;\n  bottom: 30px;\n  left: 8%;\n  height: 112px;\n  width: 84%;\n  overflow: hidden;\n  border-radius: 8px;\n  border: 1px solid color-mix(in oklab, var(--folder-card) 30%, transparent);\n  background: var(--folder-card);\n  padding: 0;\n  box-shadow: 0 4px 8px #0002;\n  cursor: pointer;\n}\n.image_folders_file img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  user-select: none;\n}\n.image_folders_control {\n  position: absolute;\n  bottom: 20px;\n  left: 0;\n  z-index: 20;\n  width: 100%;\n  height: 90px;\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 0 16px 16px;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--folder-foreground);\n  text-align: left;\n  cursor: pointer;\n  font: inherit;\n}\n.image_folders_caption {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 0;\n}\n.image_folders_label {\n  font-size: var(--folder-label-size, 12px);\n  font-weight: 500;\n  overflow-wrap: anywhere;\n}\n.image_folders_count {\n  font: var(--folder-count-size, 9px)/1.4 ui-monospace, monospace;\n  opacity: .6;\n}\n.image_folders_action {\n  display: grid;\n  place-items: center;\n  flex-shrink: 0;\n  width: 28px;\n  height: 28px;\n  border-radius: 8px;\n  background: var(--folder-primary);\n  color: var(--folder-primary-foreground);\n  box-shadow: 0 3px 6px color-mix(in oklab, var(--folder-foreground) 15%, transparent);\n}\n.image_folders_action svg {\n  width: 16px;\n  height: 16px;\n}\n.image_folders_outline {\n  background: color-mix(in oklab, var(--folder-card) 20%, transparent);\n  color: inherit;\n  border: 1px solid color-mix(in oklab, var(--folder-foreground) 12%, transparent);\n  box-shadow: none;\n}\n.image_folders_dark .image_folders_back {\n  background: color-mix(in oklab, var(--folder-foreground) 35%, transparent);\n}\n.image_folders_dark .image_folders_front {\n  background:\n    linear-gradient(\n      160deg,\n      color-mix(in oklab, var(--folder-foreground) 65%, transparent),\n      color-mix(in oklab, var(--folder-foreground) 86%, transparent));\n}\n.image_folders_dark .image_folders_control {\n  color: var(--folder-card);\n}\n.image_folders_selection {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  min-height: 14px;\n  text-align: center;\n  font: 10px/1.4 ui-monospace, monospace;\n  color: var(--folder-foreground);\n  pointer-events: none;\n}\n.image_folders_file:focus-visible,\n.image_folders_control:focus-visible {\n  outline: 2px solid var(--folder-foreground);\n  outline-offset: 4px;\n}\n.image_folders_grid {\n  display: grid;\n  width: 100%;\n  max-width: 440px;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 8px 20px;\n  padding: 0 20px;\n}\n@media (max-width: 360px) {\n  .image_folders_grid {\n    gap: 8px 12px;\n    padding-inline: 10px;\n  }\n  .image_folders_control {\n    padding-inline: 10px;\n  }\n}\n"}</style><ImageFolder {...props} /></>;
}
export {
  ImageFolder2 as ImageFolder,
  ImageFolders2 as ImageFolders
};
