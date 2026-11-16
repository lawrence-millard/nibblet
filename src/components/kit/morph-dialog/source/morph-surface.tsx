"use client";

// Adapted from psico/components/morph-dialog.tsx: native dialog and card-origin morph.

import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./morph-dialog.module.css";

export type MorphOrigin = {
  element: HTMLElement;
  trigger: HTMLElement;
  rect: Pick<DOMRect, "left" | "top" | "width" | "height">;
  keyboard: boolean;
};
export type DialogHandle = { dismiss: (afterClose?: () => void, instant?: boolean) => void };

const easeOut = "cubic-bezier(0.23, 1, 0.32, 1)";
const identity = "translate(0px, 0px) scale(1, 1)";
// Slightly underdamped spring for the surface size: a short swelling as it
// lands instead of a visible bounce that would read as a jerk. The last frame
// is pinned to 1 so docking still lands exactly on the card.
const springDamping = 0.88;
const closeDamping = 0.9;
// The position takes a critically damped profile: it decelerates into the
// destination without ever moving back, which is where the hard stop came from.
const pathDamping = 0.92;
const springFrequency = 8.5;
function springProgress(progress: number, damping: number) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const angular = springFrequency * Math.sqrt(1 - damping * damping);
  const decay = Math.exp(-damping * springFrequency * progress);
  return 1 - decay * (Math.cos(angular * progress) + (damping * springFrequency / angular) * Math.sin(angular * progress));
}

// A rounded-corner path. The surface leaves along the axis of its offset from
// the destination (a trigger above sends it downwards), then curves into place.
// Samples are re-parameterised by arc length so the speed stays even before the
// easing profile is applied to it.
function pathSampler(fromX: number, fromY: number, toX: number, toY: number, round = 0.35) {
  const corner = { x: fromX, y: toY };
  const mid = { x: (fromX + toX) / 2, y: (fromY + toY) / 2 };
  const control = { x: mid.x + (corner.x - mid.x) * round, y: mid.y + (corner.y - mid.y) * round };
  const points = [{ x: fromX, y: fromY }];
  const lengths = [0];
  const steps = 96;
  for (let step = 1; step <= steps; step++) {
    const t = step / steps;
    const inverse = 1 - t;
    const weight = 2 * inverse * t;
    const point = {
      x: inverse * inverse * fromX + weight * control.x + t * t * toX,
      y: inverse * inverse * fromY + weight * control.y + t * t * toY,
    };
    const previous = points[points.length - 1];
    lengths.push(lengths[points.length - 1] + Math.hypot(point.x - previous.x, point.y - previous.y));
    points.push(point);
  }
  const total = lengths[steps];
  return (fraction: number) => {
    const target = total * Math.min(Math.max(fraction, 0), 1);
    let low = 1;
    let high = steps;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (lengths[middle] < target) low = middle + 1; else high = middle;
    }
    const span = lengths[low] - lengths[low - 1] || 1;
    const blend = (target - lengths[low - 1]) / span;
    return [points[low - 1].x + (points[low].x - points[low - 1].x) * blend, points[low - 1].y + (points[low].y - points[low - 1].y) * blend] as const;
  };
}

function durationMilliseconds(value: string, fallback: number) {
  const match = value.trim().match(/^(\d*\.?\d+)\s*(ms|s)$/);
  if (!match) return fallback;
  const duration = Number(match[1]) * (match[2] === "s" ? 1000 : 1);
  return duration > 0 ? duration : fallback;
}

function morphTiming() {
  const tokens = getComputedStyle(document.documentElement);
  return {
    easing: tokens.getPropertyValue("--ease-drawer").trim() || easeOut,
    open: durationMilliseconds(tokens.getPropertyValue("--duration-morph-open"), 500),
    close: durationMilliseconds(tokens.getPropertyValue("--duration-morph-close"), 420),
    reveal: durationMilliseconds(tokens.getPropertyValue("--duration-morph-reveal"), 240),
  };
}

function transformFromRect(source: MorphOrigin["rect"], destination: DOMRect) {
  const x = source.left + source.width / 2 - destination.left - destination.width / 2;
  const y = source.top + source.height / 2 - destination.top - destination.height / 2;
  return `translate(${x}px, ${y}px) scale(${source.width / destination.width}, ${source.height / destination.height})`;
}

export const MorphSurface = forwardRef<DialogHandle, { children: ReactNode; title: string; close: () => void; origin: MorphOrigin | null; className?: string; description?: string; hideClose?: boolean; escapeGuard?: () => boolean }>(function MorphSurface({ children, title, close, origin, className = "", description, hideClose = false, escapeGuard }, forwardedRef) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const initialOrigin = useRef(origin);
  const animations = useRef<Animation[]>([]);
  const exiting = useRef(false);
  const mounted = useRef(false);
  const hiddenSource = useRef<HTMLElement | null>(null);
  const preview = useRef<HTMLElement | null>(null);
  const previewCanvasFrame = useRef<number | null>(null);
  const borrowedFrames = useRef<{ frame: HTMLIFrameElement; parent: Element; placeholder: HTMLElement }[]>([]);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const scrimAnimation = useRef<Animation | null>(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  // Escape belongs to nested widgets first: an open image folder inside the
  // component preview swallows the key and React keeps the dialog open.
  const escapeGuardRef = useRef(escapeGuard);
  escapeGuardRef.current = escapeGuard;
  const titleId = useId();
  const descriptionId = useId();

  function removeScrim() {
    scrimAnimation.current?.cancel();
    scrimAnimation.current = null;
    scrimRef.current?.remove();
    scrimRef.current = null;
  }

  function fadeScrim(opacity: number, duration: number, easing: string) {
    const scrim = scrimRef.current;
    if (!scrim) return;
    const from = getComputedStyle(scrim).opacity;
    scrim.style.opacity = from;
    scrimAnimation.current?.cancel();
    if (!duration) { scrim.style.opacity = String(opacity); scrimAnimation.current = null; return; }
    const animation = scrim.animate([{ opacity: from }, { opacity }], { duration, easing, fill: "both" });
    scrimAnimation.current = animation;
    animation.finished.then(() => {
      if (scrimAnimation.current !== animation) return;
      scrim.style.opacity = String(opacity);
      animation.cancel();
      scrimAnimation.current = null;
    }).catch(() => {});
  }

  function restoreFrames() {
    for (const { frame, parent, placeholder } of borrowedFrames.current) {
      if (parent.isConnected && placeholder.parentNode === parent) parent.moveBefore(frame, placeholder);
      placeholder.remove();
    }
    borrowedFrames.current = [];
  }

  function stopAnimations() {
    if (previewCanvasFrame.current !== null) cancelAnimationFrame(previewCanvasFrame.current);
    previewCanvasFrame.current = null;
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    restoreFrames();
    preview.current?.remove();
    preview.current = null;
  }

  function createPreview(target: HTMLElement, rect: Pick<DOMRect, "width" | "height">) {
    const targetStyle = getComputedStyle(target);
    const layer = document.createElement("div");
    layer.className = `morph-preview ${styles.preview}`;
    // Pricing scrolls within the native dialog on short screens. Keep the
    // docking preview aligned with the visible surface, including at the bottom.
    layer.style.top = `${dialogRef.current!.scrollTop}px`;
    layer.style.bottom = "auto";
    layer.style.height = `${dialogRef.current!.clientHeight}px`;
    layer.setAttribute("aria-hidden", "true");
    layer.inert = true;
    layer.style.background = targetStyle.background;
    const card = target.cloneNode(true) as HTMLElement;
    // The preview lives inside the dialog, outside the source's CSS context.
    // Freeze its rendered type so scoped dashboard styles keep the same size.
    const originals = [target, ...target.querySelectorAll<HTMLElement>("*")];
    const copies = [card, ...card.querySelectorAll<HTMLElement>("*")];
    const typography = ["font-family", "font-size", "font-weight", "font-style", "font-stretch", "font-variant", "font-feature-settings", "font-variation-settings", "line-height", "letter-spacing", "text-transform", "text-align", "white-space", "color"];
    originals.forEach((original, index) => {
      const computed = getComputedStyle(original);
      typography.forEach(property => copies[index].style.setProperty(property, computed.getPropertyValue(property)));
    });
    // cloneNode copies canvas attributes, but not its bitmap. Keep the morph
    // preview in sync with the live banner so docking never shows its CSS fallback
    // or jumps to a different animation phase when the real card is revealed.
    const canvases = originals.flatMap((original, index) => {
      const copy = copies[index];
      if (!(original instanceof HTMLCanvasElement) || !(copy instanceof HTMLCanvasElement)) return [];
      const context = copy.getContext("2d");
      return context ? [{ original, copy, context }] : [];
    });
    // A cloned iframe starts a second document. Borrow the live frame with a
    // state-preserving move instead, and leave its source layout reserved.
    const frames = originals.flatMap((original, index) => {
      const copy = copies[index];
      if (!(original instanceof HTMLIFrameElement) || !(copy instanceof HTMLIFrameElement)) return [];
      const parent = original.parentElement!, placeholder = document.createElement("div"), slot = document.createElement("div");
      placeholder.className = original.className;
      placeholder.style.cssText = original.style.cssText;
      slot.style.display = "contents";
      copy.removeAttribute("src"); copy.removeAttribute("srcdoc"); copy.replaceWith(slot);
      return [{ frame: original, parent, placeholder, slot }];
    });
    function paintCanvases() {
      canvases.forEach(({ original, copy, context }) => {
        if (!original.width || !original.height) return;
        if (copy.width !== original.width) copy.width = original.width;
        if (copy.height !== original.height) copy.height = original.height;
        context.clearRect(0, 0, copy.width, copy.height);
        context.drawImage(original, 0, 0);
      });
      if (canvases.length) previewCanvasFrame.current = requestAnimationFrame(paintCanvases);
    }
    paintCanvases();
    card.classList.remove(styles.sourceHidden);
    card.removeAttribute("id");
    card.querySelectorAll("[id]").forEach(element => element.removeAttribute("id"));
    Object.assign(card.style, {
      position: "absolute", left: "50%", top: "50%", margin: "0",
      width: `${rect.width}px`, height: `${rect.height}px`,
      minHeight: "0", maxWidth: "none", maxHeight: "none", boxSizing: "border-box",
      color: targetStyle.color, background: "transparent", borderColor: "transparent",
      boxShadow: "none", visibility: "visible", transformOrigin: "center",
    });
    layer.append(card);
    dialogRef.current!.append(layer);
    for (const { frame, parent, placeholder, slot } of frames) {
      parent.insertBefore(placeholder, frame);
      slot.moveBefore(frame, null);
      borrowedFrames.current.push({ frame, parent, placeholder });
    }
    preview.current = layer;
    return { layer, card };
  }

  function restoreSource() {
    hiddenSource.current?.classList.remove(styles.sourceHidden);
    hiddenSource.current = null;
  }

  function dismiss(afterClose?: () => void, instant = false) {
    const dialog = dialogRef.current;
    const content = contentRef.current;
    if (!dialog || !content || exiting.current) return;
    exiting.current = true;
    const origin = initialOrigin.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timing = morphTiming();
    // Read the current visual state before cancelling to reverse a partially open morph.
    const current = getComputedStyle(dialog);
    const currentTransform = current.transform === "none" ? identity : current.transform;
    const currentOpacity = current.opacity;
    const contentOpacity = getComputedStyle(content).opacity;
    stopAnimations();
    dialog.dataset.phase = "closing";

    const finish = () => {
      if (!mounted.current) return;
      if (previewCanvasFrame.current !== null) cancelAnimationFrame(previewCanvasFrame.current);
      previewCanvasFrame.current = null;
      restoreFrames();
      restoreSource();
      removeScrim();
      dialog.close();
      if (origin?.trigger.isConnected) origin.trigger.focus({ preventScroll: true });
      (afterClose || closeRef.current)();
    };

    if (instant || origin?.keyboard) { finish(); return; }
    const target = origin?.element.isConnected ? origin.element : null;
    const targetRect = target?.getBoundingClientRect();
    const canDock = !reduced && target && targetRect && targetRect.width > 0 && targetRect.height > 0 && targetRect.bottom > 0 && targetRect.top < window.innerHeight && (!target.querySelector("iframe") || typeof Element.prototype.moveBefore === "function");
    if (!canDock) {
      fadeScrim(0, 120, easeOut);
      restoreSource();
      content.style.opacity = contentOpacity;
      const surface = dialog.animate([{ transform: currentTransform, opacity: currentOpacity }, { transform: currentTransform, opacity: 0 }], { duration: 120, easing: easeOut, fill: "both" });
      animations.current = [surface];
      surface.finished.then(finish).catch(() => {});
      return;
    }

    // The surface stays opaque. A snapshot of the real card replaces the sheet's
    // contents, with inverse scale correction so its type and corners never flatten.
    const destination = dialog.getBoundingClientRect();
    const from = new DOMMatrix(currentTransform);
    const to = new DOMMatrix(transformFromRect(targetRect, destination));
    const targetStyle = getComputedStyle(target);
    const parsedRadius = Number.parseFloat(current.borderTopLeftRadius);
    const radius = Number.isNaN(parsedRadius) ? 20 : parsedRadius;
    const targetRadius = parseFloat(targetStyle.borderTopLeftRadius) || 0;
    const { layer, card } = createPreview(target, targetRect);
    target.classList.add(styles.sourceHidden);
    hiddenSource.current = target;
    dialog.style.borderRadius = "0";

    const surfaceFrames: Keyframe[] = [];
    const cardFrames: Keyframe[] = [];
    const travel = pathSampler(from.e, from.f, to.e, to.f);
    for (let step = 0; step <= 80; step++) {
      const progress = step / 80;
      const eased = springProgress(progress, closeDamping);
      const sx = from.a + (to.a - from.a) * eased;
      const sy = from.d + (to.d - from.d) * eased;
      const [x, y] = travel(springProgress(progress, pathDamping));
      const rx = (radius * from.a + (targetRadius - radius * from.a) * eased) / sx;
      const ry = (radius * from.d + (targetRadius - radius * from.d) * eased) / sy;
      surfaceFrames.push({ offset: progress, transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`, clipPath: `inset(0 round ${rx}px / ${ry}px)`, opacity: 1 });
      cardFrames.push({ offset: progress, transform: `translate(-50%, -50%) scale(${1 / sx}, ${1 / sy})` });
    }
    // The baked spring already carries the overshoot, so WAAPI interpolates
    // those samples linearly. Only the fading contents use the drawer ease.
    const options: KeyframeAnimationOptions = { duration: timing.close, easing: "linear", fill: "both" };
    const fadeOptions: KeyframeAnimationOptions = { duration: timing.close, easing: timing.easing, fill: "both" };
    fadeScrim(0, timing.close, timing.easing);
    const surface = dialog.animate(surfaceFrames, options);
    const correctedCard = card.animate(cardFrames, options);
    const contents = content.animate([{ offset: 0, opacity: contentOpacity }, { offset: 0.7, opacity: 0 }, { offset: 1, opacity: 0 }], fadeOptions);
    const cardContents = layer.animate([{ offset: 0, opacity: 0 }, { offset: 0.15, opacity: 0 }, { offset: 1, opacity: 1 }], fadeOptions);
    animations.current = [surface, correctedCard, contents, cardContents];
    surface.finished.then(finish).catch(() => { /* Cancellation is expected on unmount. */ });
  }

  useImperativeHandle(forwardedRef, () => ({ dismiss }));

  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    const content = contentRef.current!;
    const origin = initialOrigin.current;
    mounted.current = true;
    exiting.current = false;
    content.style.opacity = "";
    dialog.style.borderRadius = "";
    preview.current?.remove();
    preview.current = null;
    dialog.dataset.phase = "opening";
    // Keep the dimming layer fixed outside the dialog's animated transform and
    // clip-path. No blur is applied, including when dialogs are nested.
    const scrim = document.createElement("div");
    scrim.className = `morph-scrim ${styles.scrim}`;
    scrim.popover = "manual";
    scrim.inert = true;
    scrim.setAttribute("aria-hidden", "true");
    document.body.append(scrim);
    scrim.showPopover();
    scrimRef.current = scrim;
    dialog.showModal();
    dialog.focus({ preventScroll: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timing = morphTiming();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const canMorph = !reduced && !origin?.keyboard && origin && origin.rect.width > 0 && origin.rect.height > 0 && (!origin.element.querySelector("iframe") || typeof Element.prototype.moveBefore === "function");

    if (origin && !origin.element.closest("dialog") && canMorph) {
      hiddenSource.current = origin.element;
      origin.element.classList.add(styles.sourceHidden);
    }
    const duration = origin?.keyboard ? 0 : reduced ? 120 : timing.open;
    fadeScrim(1, duration, timing.easing);
    const openingTransform = canMorph ? transformFromRect(origin.rect, dialog.getBoundingClientRect()) : identity;
    let openingFrames: Keyframe[];
    if (canMorph) {
      const from = new DOMMatrix(openingTransform);
      const travel = pathSampler(from.e, from.f, 0, 0);
      openingFrames = [];
      for (let step = 0; step <= 80; step++) {
        const progress = step / 80;
        const eased = springProgress(progress, springDamping);
        const sx = from.a + (1 - from.a) * eased;
        const sy = from.d + (1 - from.d) * eased;
        const [x, y] = travel(springProgress(progress, pathDamping));
        openingFrames.push({ offset: progress, transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`, opacity: 1 });
      }
    } else {
      openingFrames = [
        { transform: reduced || origin?.keyboard ? identity : "translate(0px, 0px) scale(0.96, 0.96)", opacity: 0 },
        { transform: identity, opacity: 1 },
      ];
    }
    const surface = dialog.animate(openingFrames, { duration, easing: canMorph ? "linear" : easeOut, fill: "both" });
    // Reveal the new contents after the surface starts expanding, avoiding stretched text.
    const contents = content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: duration ? reduced ? 120 : timing.reveal : 0, delay: canMorph ? 170 : 0, easing: easeOut, fill: "both" });
    animations.current = [surface, contents];
    if (canMorph) {
      const { layer, card } = createPreview(origin.element, origin.rect);
      const from = new DOMMatrix(openingTransform);
      const frames: Keyframe[] = [];
      for (let step = 0; step <= 80; step++) {
        const progress = step / 80;
        const eased = springProgress(progress, springDamping);
        const sx = from.a + (1 - from.a) * eased;
        const sy = from.d + (1 - from.d) * eased;
        frames.push({ offset: progress, transform: `translate(-50%, -50%) scale(${1 / sx}, ${1 / sy})` });
      }
      const correctedCard = card.animate(frames, { duration, easing: "linear", fill: "both" });
      const reveal = layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: timing.reveal, delay: 170, easing: easeOut, fill: "both" });
      animations.current.push(correctedCard, reveal);
      reveal.finished.then(() => {
        if (!mounted.current || exiting.current) return;
        restoreFrames();
        layer.remove();
        if (preview.current === layer) preview.current = null;
        if (previewCanvasFrame.current !== null) cancelAnimationFrame(previewCanvasFrame.current);
        previewCanvasFrame.current = null;
        correctedCard.cancel();
      }).catch(() => {});
    }
    surface.finished.then(() => {
      if (!mounted.current || exiting.current) return;
      dialog.dataset.phase = "open";
      surface.cancel();
    }).catch(() => {});
    contents.finished.then(() => { if (mounted.current && !exiting.current) contents.cancel(); }).catch(() => {});

    return () => {
      mounted.current = false;
      stopAnimations();
      restoreSource();
      removeScrim();
      preview.current?.remove();
      preview.current = null;
      dialog.close();
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return <dialog ref={dialogRef} tabIndex={-1} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} className={`morph-dialog ${styles.dialog} ${className}`}
    // Nested dialogs share the cancel event capture path (the picker's Escape
    // touches ancestors too): only react when the dialog itself was cancelled.
    onCancel={event => { if (event.target !== event.currentTarget) return; event.preventDefault(); if (escapeGuardRef.current?.()) return; dismiss(undefined, true); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss();
    }}>
    <div ref={contentRef} className={`morph-content ${styles.content}`}>
      <h2 id={titleId} className={styles.srOnly}>{title}</h2>
      {description && <p id={descriptionId} className={styles.srOnly}>{description}</p>}
      {!hideClose && <button type="button" className={`nibble-close ${styles.close}`} aria-label="Close dialog" onClick={event => dismiss(undefined, event.detail === 0)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>}
      {children}
    </div>
  </dialog>;
});
