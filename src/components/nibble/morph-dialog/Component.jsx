"use client";

// Self-contained MorphDialog: component and styles. Requires React.
import * as React from "react";

// src/components/catalog/morph-dialog/morph-dialog.tsx
import { useRef as useRef2, useState } from "react";

// src/components/catalog/morph-dialog/morph-surface.tsx
import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef } from "react";

// src/components/catalog/morph-dialog/morph-dialog.module.css
var morph_dialog_default = {
  dialog: "morph_dialog_dialog",
  scrim: "morph_dialog_scrim",
  sourceHidden: "morph_dialog_sourceHidden",
  preview: "morph_dialog_preview",
  content: "morph_dialog_content",
  srOnly: "morph_dialog_srOnly",
  close: "morph_dialog_close",
  trigger: "morph_dialog_trigger",
  body: "morph_dialog_body",
  description: "morph_dialog_description"
};

// src/components/catalog/morph-dialog/morph-surface.tsx
var easeOut = "cubic-bezier(0.23, 1, 0.32, 1)";
var identity = "translate(0px, 0px) scale(1, 1)";
var springDamping = 0.88;
var closeDamping = 0.9;
var pathDamping = 0.92;
var springFrequency = 8.5;
function springProgress(progress, damping) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const angular = springFrequency * Math.sqrt(1 - damping * damping);
  const decay = Math.exp(-damping * springFrequency * progress);
  return 1 - decay * (Math.cos(angular * progress) + damping * springFrequency / angular * Math.sin(angular * progress));
}
function pathSampler(fromX, fromY, toX, toY, round = 0.35) {
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
      y: inverse * inverse * fromY + weight * control.y + t * t * toY
    };
    const previous = points[points.length - 1];
    lengths.push(lengths[points.length - 1] + Math.hypot(point.x - previous.x, point.y - previous.y));
    points.push(point);
  }
  const total = lengths[steps];
  return (fraction) => {
    const target = total * Math.min(Math.max(fraction, 0), 1);
    let low = 1;
    let high = steps;
    while (low < high) {
      const middle = low + high >> 1;
      if (lengths[middle] < target) low = middle + 1;
      else high = middle;
    }
    const span = lengths[low] - lengths[low - 1] || 1;
    const blend = (target - lengths[low - 1]) / span;
    return [points[low - 1].x + (points[low].x - points[low - 1].x) * blend, points[low - 1].y + (points[low].y - points[low - 1].y) * blend];
  };
}
function durationMilliseconds(value, fallback) {
  const match = value.trim().match(/^(\d*\.?\d+)\s*(ms|s)$/);
  if (!match) return fallback;
  const duration = Number(match[1]) * (match[2] === "s" ? 1e3 : 1);
  return duration > 0 ? duration : fallback;
}
function morphTiming() {
  const tokens = getComputedStyle(document.documentElement);
  return {
    easing: tokens.getPropertyValue("--ease-drawer").trim() || easeOut,
    open: durationMilliseconds(tokens.getPropertyValue("--duration-morph-open"), 500),
    close: durationMilliseconds(tokens.getPropertyValue("--duration-morph-close"), 420),
    reveal: durationMilliseconds(tokens.getPropertyValue("--duration-morph-reveal"), 240)
  };
}
function transformFromRect(source, destination) {
  const x = source.left + source.width / 2 - destination.left - destination.width / 2;
  const y = source.top + source.height / 2 - destination.top - destination.height / 2;
  return `translate(${x}px, ${y}px) scale(${source.width / destination.width}, ${source.height / destination.height})`;
}
var MorphSurface = forwardRef(function MorphSurface2({ children, title, close, origin, className = "", description, hideClose = false, escapeGuard }, forwardedRef) {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const initialOrigin = useRef(origin);
  const animations = useRef([]);
  const exiting = useRef(false);
  const mounted = useRef(false);
  const hiddenSource = useRef(null);
  const preview = useRef(null);
  const previewCanvasFrame = useRef(null);
  const borrowedFrames = useRef([]);
  const scrimRef = useRef(null);
  const scrimAnimation = useRef(null);
  const closeRef = useRef(close);
  closeRef.current = close;
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
  function fadeScrim(opacity, duration, easing) {
    const scrim = scrimRef.current;
    if (!scrim) return;
    const from = getComputedStyle(scrim).opacity;
    scrim.style.opacity = from;
    scrimAnimation.current?.cancel();
    if (!duration) {
      scrim.style.opacity = String(opacity);
      scrimAnimation.current = null;
      return;
    }
    const animation = scrim.animate([{ opacity: from }, { opacity }], { duration, easing, fill: "both" });
    scrimAnimation.current = animation;
    animation.finished.then(() => {
      if (scrimAnimation.current !== animation) return;
      scrim.style.opacity = String(opacity);
      animation.cancel();
      scrimAnimation.current = null;
    }).catch(() => {
    });
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
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    restoreFrames();
    preview.current?.remove();
    preview.current = null;
  }
  function createPreview(target, rect) {
    const targetStyle = getComputedStyle(target);
    const layer = document.createElement("div");
    layer.className = `morph-preview ${morph_dialog_default.preview}`;
    layer.style.top = `${dialogRef.current.scrollTop}px`;
    layer.style.bottom = "auto";
    layer.style.height = `${dialogRef.current.clientHeight}px`;
    layer.setAttribute("aria-hidden", "true");
    layer.inert = true;
    layer.style.background = targetStyle.background;
    const card = target.cloneNode(true);
    const originals = [target, ...target.querySelectorAll("*")];
    const copies = [card, ...card.querySelectorAll("*")];
    const typography = ["font-family", "font-size", "font-weight", "font-style", "font-stretch", "font-variant", "font-feature-settings", "font-variation-settings", "line-height", "letter-spacing", "text-transform", "text-align", "white-space", "color"];
    originals.forEach((original, index) => {
      const computed = getComputedStyle(original);
      typography.forEach((property) => copies[index].style.setProperty(property, computed.getPropertyValue(property)));
    });
    const canvases = originals.flatMap((original, index) => {
      const copy = copies[index];
      if (!(original instanceof HTMLCanvasElement) || !(copy instanceof HTMLCanvasElement)) return [];
      const context = copy.getContext("2d");
      return context ? [{ original, copy, context }] : [];
    });
    const frames = originals.flatMap((original, index) => {
      const copy = copies[index];
      if (!(original instanceof HTMLIFrameElement) || !(copy instanceof HTMLIFrameElement)) return [];
      const parent = original.parentElement, placeholder = document.createElement("div"), slot = document.createElement("div");
      placeholder.className = original.className;
      placeholder.style.cssText = original.style.cssText;
      slot.style.display = "contents";
      copy.removeAttribute("src");
      copy.removeAttribute("srcdoc");
      copy.replaceWith(slot);
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
    card.classList.remove(morph_dialog_default.sourceHidden);
    card.removeAttribute("id");
    card.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    Object.assign(card.style, {
      position: "absolute",
      left: "50%",
      top: "50%",
      margin: "0",
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      minHeight: "0",
      maxWidth: "none",
      maxHeight: "none",
      boxSizing: "border-box",
      color: targetStyle.color,
      background: "transparent",
      borderColor: "transparent",
      boxShadow: "none",
      visibility: "visible",
      transformOrigin: "center"
    });
    layer.append(card);
    dialogRef.current.append(layer);
    for (const { frame, parent, placeholder, slot } of frames) {
      parent.insertBefore(placeholder, frame);
      slot.moveBefore(frame, null);
      borrowedFrames.current.push({ frame, parent, placeholder });
    }
    preview.current = layer;
    return { layer, card };
  }
  function restoreSource() {
    hiddenSource.current?.classList.remove(morph_dialog_default.sourceHidden);
    hiddenSource.current = null;
  }
  function dismiss(afterClose, instant = false) {
    const dialog = dialogRef.current;
    const content = contentRef.current;
    if (!dialog || !content || exiting.current) return;
    exiting.current = true;
    const origin2 = initialOrigin.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timing = morphTiming();
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
      if (origin2?.trigger.isConnected) origin2.trigger.focus({ preventScroll: true });
      (afterClose || closeRef.current)();
    };
    if (instant || origin2?.keyboard) {
      finish();
      return;
    }
    const target = origin2?.element.isConnected ? origin2.element : null;
    const targetRect = target?.getBoundingClientRect();
    const canDock = !reduced && target && targetRect && targetRect.width > 0 && targetRect.height > 0 && targetRect.bottom > 0 && targetRect.top < window.innerHeight && (!target.querySelector("iframe") || typeof Element.prototype.moveBefore === "function");
    if (!canDock) {
      fadeScrim(0, 120, easeOut);
      restoreSource();
      content.style.opacity = contentOpacity;
      const surface2 = dialog.animate([{ transform: currentTransform, opacity: currentOpacity }, { transform: currentTransform, opacity: 0 }], { duration: 120, easing: easeOut, fill: "both" });
      animations.current = [surface2];
      surface2.finished.then(finish).catch(() => {
      });
      return;
    }
    const destination = dialog.getBoundingClientRect();
    const from = new DOMMatrix(currentTransform);
    const to = new DOMMatrix(transformFromRect(targetRect, destination));
    const targetStyle = getComputedStyle(target);
    const parsedRadius = Number.parseFloat(current.borderTopLeftRadius);
    const radius = Number.isNaN(parsedRadius) ? 20 : parsedRadius;
    const targetRadius = parseFloat(targetStyle.borderTopLeftRadius) || 0;
    const { layer, card } = createPreview(target, targetRect);
    target.classList.add(morph_dialog_default.sourceHidden);
    hiddenSource.current = target;
    dialog.style.borderRadius = "0";
    const surfaceFrames = [];
    const cardFrames = [];
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
    const options = { duration: timing.close, easing: "linear", fill: "both" };
    const fadeOptions = { duration: timing.close, easing: timing.easing, fill: "both" };
    fadeScrim(0, timing.close, timing.easing);
    const surface = dialog.animate(surfaceFrames, options);
    const correctedCard = card.animate(cardFrames, options);
    const contents = content.animate([{ offset: 0, opacity: contentOpacity }, { offset: 0.7, opacity: 0 }, { offset: 1, opacity: 0 }], fadeOptions);
    const cardContents = layer.animate([{ offset: 0, opacity: 0 }, { offset: 0.15, opacity: 0 }, { offset: 1, opacity: 1 }], fadeOptions);
    animations.current = [surface, correctedCard, contents, cardContents];
    surface.finished.then(finish).catch(() => {
    });
  }
  useImperativeHandle(forwardedRef, () => ({ dismiss }));
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const content = contentRef.current;
    const origin2 = initialOrigin.current;
    mounted.current = true;
    exiting.current = false;
    content.style.opacity = "";
    dialog.style.borderRadius = "";
    preview.current?.remove();
    preview.current = null;
    dialog.dataset.phase = "opening";
    const scrim = document.createElement("div");
    scrim.className = `morph-scrim ${morph_dialog_default.scrim}`;
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
    const canMorph = !reduced && !origin2?.keyboard && origin2 && origin2.rect.width > 0 && origin2.rect.height > 0 && (!origin2.element.querySelector("iframe") || typeof Element.prototype.moveBefore === "function");
    if (origin2 && !origin2.element.closest("dialog") && canMorph) {
      hiddenSource.current = origin2.element;
      origin2.element.classList.add(morph_dialog_default.sourceHidden);
    }
    const duration = origin2?.keyboard ? 0 : reduced ? 120 : timing.open;
    fadeScrim(1, duration, timing.easing);
    const openingTransform = canMorph ? transformFromRect(origin2.rect, dialog.getBoundingClientRect()) : identity;
    let openingFrames;
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
        { transform: reduced || origin2?.keyboard ? identity : "translate(0px, 0px) scale(0.96, 0.96)", opacity: 0 },
        { transform: identity, opacity: 1 }
      ];
    }
    const surface = dialog.animate(openingFrames, { duration, easing: canMorph ? "linear" : easeOut, fill: "both" });
    const contents = content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: duration ? reduced ? 120 : timing.reveal : 0, delay: canMorph ? 170 : 0, easing: easeOut, fill: "both" });
    animations.current = [surface, contents];
    if (canMorph) {
      const { layer, card } = createPreview(origin2.element, origin2.rect);
      const from = new DOMMatrix(openingTransform);
      const frames = [];
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
      }).catch(() => {
      });
    }
    surface.finished.then(() => {
      if (!mounted.current || exiting.current) return;
      dialog.dataset.phase = "open";
      surface.cancel();
    }).catch(() => {
    });
    contents.finished.then(() => {
      if (mounted.current && !exiting.current) contents.cancel();
    }).catch(() => {
    });
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
  return <dialog
    ref={dialogRef}
    tabIndex={-1}
    aria-labelledby={titleId}
    aria-describedby={description ? descriptionId : void 0}
    className={`morph-dialog ${morph_dialog_default.dialog} ${className}`}
    onCancel={(event) => {
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      if (escapeGuardRef.current?.()) return;
      dismiss(void 0, true);
    }}
    onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss();
    }}
  >
    <div ref={contentRef} className={`morph-content ${morph_dialog_default.content}`}>
      <h2 id={titleId} className={morph_dialog_default.srOnly}>{title}</h2>
      {description && <p id={descriptionId} className={morph_dialog_default.srOnly}>{description}</p>}
      {!hideClose && <button type="button" className={`nibble-close ${morph_dialog_default.close}`} aria-label="Close dialog" onClick={(event) => dismiss(void 0, event.detail === 0)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>}
      {children}
    </div>
  </dialog>;
});

// src/components/catalog/morph-dialog/morph-dialog.tsx
function MorphDialog({ trigger = "Open dialog", title, description, children, className, triggerClassName }) {
  const [open, setOpen] = useState(false);
  const origin = useRef2(null);
  return <>
    <button
    type="button"
    className={`${morph_dialog_default.trigger} ${triggerClassName || ""}`}
    aria-haspopup="dialog"
    aria-expanded={open}
    onClick={(event) => {
      const trigger2 = event.currentTarget;
      origin.current = { element: trigger2, trigger: trigger2, rect: trigger2.getBoundingClientRect(), keyboard: event.detail === 0 };
      setOpen(true);
    }}
  >{trigger}</button>
    {open && <MorphSurface title={title} description={description} origin={origin.current} close={() => setOpen(false)} className={className}>
      <div className={morph_dialog_default.body}>
        <h3>{title}</h3>
        {description && <p className={morph_dialog_default.description}>{description}</p>}
        {children}
      </div>
    </MorphSurface>}
  </>;
}

// src/components/catalog/morph-dialog/Component.jsx
function MorphDialog2(props) {
  return <><style>{"/* src/components/catalog/morph-dialog/morph-dialog.module.css */\n.morph_dialog_dialog {\n  --nibble-ink: var(--ink, #ededed);\n  --nibble-muted: var(--muted, #a0a0a0);\n  --nibble-line: var(--line, #ffffff20);\n  position: fixed;\n  inset: 0;\n  margin: auto;\n  padding: 0;\n  border: 0;\n  width: min(440px, calc(100vw - 32px));\n  max-width: none;\n  max-height: calc(100dvh - 40px);\n  border-radius: 20px;\n  background: var(--soft, #202020);\n  color: var(--ink, #ededed);\n  box-shadow: 0 24px 80px rgb(0 0 0 / 0.35);\n  font-family:\n    var(--font-sans, Arial),\n    Inter,\n    Arial,\n    sans-serif;\n  overflow: auto;\n  overscroll-behavior: contain;\n  transform-origin: center;\n  backface-visibility: hidden;\n  outline: none;\n}\n.morph_dialog_dialog *,\n.morph_dialog_dialog *::before,\n.morph_dialog_dialog *::after {\n  box-sizing: border-box;\n}\n.morph_dialog_dialog button,\n.morph_dialog_dialog input,\n.morph_dialog_dialog select,\n.morph_dialog_dialog textarea {\n  font: inherit;\n}\n.morph_dialog_dialog button {\n  cursor: pointer;\n}\n.morph_dialog_dialog button:focus-visible,\n.morph_dialog_dialog input:focus-visible,\n.morph_dialog_dialog textarea:focus-visible,\n.morph_dialog_dialog select:focus-visible {\n  outline: 2px solid var(--nibble-ink);\n  outline-offset: 3px;\n}\n.morph_dialog_dialog::backdrop {\n  background: transparent;\n  backdrop-filter: none;\n}\n.morph_dialog_scrim[popover] {\n  position: fixed;\n  inset: 0;\n  width: 100vw;\n  height: 100dvh;\n  max-width: none;\n  max-height: none;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  background: rgb(0 0 0 / 28%);\n  backdrop-filter: none;\n  opacity: 0;\n  pointer-events: none;\n}\n.morph_dialog_sourceHidden {\n  visibility: hidden !important;\n}\n.morph_dialog_preview {\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n  pointer-events: none;\n}\n.morph_dialog_content {\n  min-width: 0;\n  height: 100%;\n}\n.morph_dialog_srOnly {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n  border: 0;\n}\n.morph_dialog_close {\n  position: absolute;\n  z-index: 2;\n  top: 16px;\n  right: 16px;\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: inherit;\n}\n.morph_dialog_close:hover {\n  background: #8882;\n}\n.morph_dialog_trigger {\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  border: 0;\n  padding: 13px 22px;\n  border-radius: 999px;\n  background: var(--ink, #ededed);\n  color: var(--bg, #171717);\n  font: inherit;\n  font-weight: 500;\n  cursor: pointer;\n}\n.morph_dialog_trigger:focus-visible {\n  outline: 2px solid var(--ink, #ededed);\n  outline-offset: 4px;\n}\n.morph_dialog_body {\n  padding: 40px 32px 32px;\n}\n.morph_dialog_body h3 {\n  margin: 0 24px 12px 0;\n  font-size: 28px;\n  line-height: 1.15;\n  letter-spacing: -.8px;\n  font-weight: 500;\n}\n.morph_dialog_description {\n  margin: 0 0 24px;\n  color: var(--muted, #aaa);\n  font-size: 15px;\n  line-height: 1.6;\n}\n"}</style><MorphDialog {...props} /></>;
}
export {
  MorphDialog2 as MorphDialog
};
