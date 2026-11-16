"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./image-folders.module.css";

// Google Material Symbols Rounded, Apache-2.0 (https://fonts.google.com/icons).
const folderIconPaths = {
  "add": "M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z",
  "close": "M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z",
  "more_horiz": "M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"
};
function FolderIcon({ name }: { name: keyof typeof folderIconPaths }) {
  return <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d={folderIconPaths[name]} /></svg>;
}

export type FolderImage = { id: string; src: string; label: string };
export type ImageFolderProps = {
  images: FolderImage[];
  label?: string;
  dark?: boolean;
  archive?: boolean;
  appearance?: "light" | "dark";
  paused?: boolean;
  countLabel?: string;
  onOpenChange?: (open: boolean) => void;
  onImageSelect?: (image: FolderImage) => void;
};

/** Translucent tab-shaped folders with sliding image files. Styles are scoped to this component. */
export function ImageFolder({ images, label = "My Files", dark = false, archive = false, appearance = "light", paused = false, countLabel, onOpenChange, onImageSelect }: ImageFolderProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const open = hovered || pinned;
  const instant = reduce || paused;
  const transition = instant ? { duration: 0 } : { type: "spring" as const, stiffness: 280, damping: 24 };
  const selectedImage = images.find((image) => image.id === selected);

  return <div className={`${styles.folder} ${dark ? styles.dark : ""}`} data-image-folder data-appearance={appearance} data-open={open} data-pinned={pinned}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
    onPointerLeave={() => { setHovered(false); if (!pinned) setSelected(null); }}
    onKeyDown={(event) => {
      if (event.key === "Escape" && (open || selected)) {
        event.preventDefault(); event.stopPropagation();
        setPinned(false); setHovered(false); setSelected(null);
        onOpenChange?.(false);
      }
    }}>
    <svg width="0" height="0" className={styles.definitions} aria-hidden="true"><defs>
      <clipPath id={`${id}-back`} clipPathUnits="objectBoundingBox"><path d="M0,.24 Q0,.14 .07,.14 H.44 Q.48,.14 .51,.09 L.56,.03 Q.59,0 .64,0 H.93 Q1,0 1,.1 V.9 Q1,1 .93,1 H.07 Q0,1 0,.9 Z" /></clipPath>
      <clipPath id={`${id}-front`} clipPathUnits="objectBoundingBox"><path d="M0,.1 Q0,0 .07,0 H.35 Q.39,0 .42,.04 L.48,.12 Q.51,.16 .56,.16 H.93 Q1,.16 1,.26 V.9 Q1,1 .93,1 H.07 Q0,1 0,.9 Z" /></clipPath>
    </defs></svg>
    <div className={styles.back} style={{ clipPath: `url(#${id}-back)` }} aria-hidden="true" />
    {images.map((image, i) => {
      const offset = images.length > 1 ? i / (images.length - 1) - 0.5 : 0;
      const active = selected === image.id;
      return <motion.button type="button" key={image.id} className={styles.file}
        aria-label={`Preview ${image.label} file`} aria-pressed={active} style={{ zIndex: active ? images.length + 1 : i + 1 }}
        initial={false} animate={{
          x: pinned ? offset * 120 : open ? offset * 12 : 0,
          y: pinned ? (active ? -172 : -148 + Math.abs(offset) * 26) : active ? -76 : open ? -34 - i * 15 : -i * (archive ? 3 : 7),
          rotate: pinned && active ? 0 : pinned ? offset * 16 : active ? 0 : open ? offset * 7 : offset * 2,
          scale: pinned ? (active ? 1.1 : 1) : active ? 1.03 : 1,
        }} transition={{ ...transition, delay: instant ? 0 : i * 0.035 }}
        onFocus={() => { if (!pinned) setHovered(true); }}
        onClick={() => { setPinned(true); setSelected(active ? null : image.id); onOpenChange?.(true); onImageSelect?.(image); }}>
        <img src={image.src} alt={image.label} width={400} height={224} draggable={false} />
      </motion.button>;
    })}
    <motion.div className={styles.front} initial={false}
      style={{ clipPath: `url(#${id}-front)`, transformOrigin: "bottom", transformPerspective: 800 }}
      animate={{ rotateX: pinned ? -26 : open ? -14 : 0, y: open ? 4 : 0 }} transition={transition} aria-hidden="true" />
    <motion.button type="button" className={styles.control} aria-label={`${pinned ? "Close" : "Open"} ${label} folder`} aria-expanded={open}
      initial={false} animate={{ y: open ? 4 : 0 }} transition={transition}
      onClick={() => { setPinned(!pinned); setHovered(false); setSelected(null); onOpenChange?.(!pinned); }}>
      <span className={styles.caption}><span className={styles.label}>{label}</span><span className={styles.count}>{countLabel ?? `${images.length} ${images.length === 1 ? "item" : "items"}`}</span></span>
      <span className={`${styles.action} ${archive ? styles.outline : ""}`}>{pinned ? <FolderIcon name="close" /> : archive ? <FolderIcon name="more_horiz" /> : <FolderIcon name="add" />}</span>
    </motion.button>
    <span className={styles.selection} aria-live="polite">{selectedImage?.label ?? ""}</span>
  </div>;
}

export function ImageFolders({ images, appearance = "light", paused = false }: { images: FolderImage[]; appearance?: "light" | "dark"; paused?: boolean }) {
  return <div className={styles.grid} data-image-folders>
    <ImageFolder images={images.slice(0, 3)} appearance={appearance} paused={paused} />
    <ImageFolder images={images} label="Archives" archive appearance={appearance} paused={paused} />
    <ImageFolder images={[...images].reverse().slice(0, 3)} label="Studio" dark appearance={appearance} paused={paused} />
    <ImageFolder images={images.slice(1)} label="Collection" archive appearance={appearance} paused={paused} />
  </div>;
}
