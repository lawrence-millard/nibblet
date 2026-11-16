"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type StatusId = "none" | "meeting" | "traveling" | "sick" | "resting" | "vacation" | "custom";
type Status = { id: StatusId; label: string; emoji: string };
export type StatusPickerProps = {
  size?: number; hue?: number; bounce?: number; status?: StatusId; customStatus?: string;
  paused?: boolean; disabled?: boolean; replayKey?: number;
  onStatusChange?: (status: Status) => void;
  className?: string; style?: CSSProperties;
};

const statuses: Status[] = [
  { id: "meeting", label: "In a meeting", emoji: "📅" },
  { id: "traveling", label: "Traveling", emoji: "✈️" },
  { id: "sick", label: "Out sick", emoji: "🤒" },
  { id: "resting", label: "Resting", emoji: "😴" },
  { id: "vacation", label: "On vacation", emoji: "🌴" },
  { id: "custom", label: "Custom", emoji: "" },
];
const noStatus: Status = { id: "none", label: "", emoji: "" };
const clamp = (value: number, min: number, max: number, fallback: number) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
const easeOut = [.23, 1, .32, 1] as const;
const css = `
.nsp-stage,.nsp-stage *{box-sizing:border-box}.nsp-stage{width:100%;min-width:0;min-height:384px;display:grid;place-items:center;padding:96px 16px;background:transparent;color:var(--ink,#171717);font:400 16px/1.4 "Nibble Status Inter",Inter,Arial,sans-serif;--nsp-surface:light-dark(#fff,#272727);--nsp-face:var(--bg,#eee);--nsp-ink:var(--ink,#171717);--nsp-muted:var(--muted,#888);--nsp-hover:light-dark(#eee,#3a3a3a);--nsp-tip:light-dark(#171717,#ededed);--nsp-tip-ink:light-dark(#fff,#171717);-webkit-font-smoothing:antialiased}.nsp-widget{position:relative;flex-shrink:0}.nsp-orb{position:absolute;inset:0;isolation:isolate;overflow:hidden;border-radius:50%;background:hsl(calc(var(--nsp-hue) + 20) 98% 59%);box-shadow:inset 0 1px 5px #ffffff60,inset 0 -2px 6px #ffffff24}.nsp-orb-field{position:absolute;inset:-12%;filter:blur(calc(var(--nsp-size) * .13));animation:nsp-orbit 18s linear infinite;will-change:transform}.nsp-orb-field::before,.nsp-orb-field::after{content:"";position:absolute;inset:0;border-radius:50%}.nsp-orb-field::before{background:radial-gradient(ellipse at 28% 62%,hsl(calc(var(--nsp-hue) - 22) 100% 61%) 0%,transparent 28%),radial-gradient(ellipse at 66% 68%,hsl(calc(var(--nsp-hue) - 29) 100% 58%) 0%,transparent 27%),radial-gradient(ellipse at 52% 19%,hsl(calc(var(--nsp-hue) + 29) 100% 57%) 0%,transparent 49%);animation:nsp-current 7s ease-in-out infinite alternate}.nsp-orb-field::after{background:radial-gradient(ellipse at 35% 38%,hsl(calc(var(--nsp-hue) + 28) 100% 57%) 0%,transparent 40%),radial-gradient(ellipse at 71% 77%,hsl(calc(var(--nsp-hue) - 22) 100% 58%) 0%,transparent 26%);animation:nsp-current 9s ease-in-out -3s infinite alternate-reverse;opacity:.7}.nsp-orb-shine{position:absolute;inset:0;border-radius:50%;background:radial-gradient(ellipse at 50% -55%,#fff6 0%,transparent 61%),radial-gradient(ellipse at -18% 60%,#ffffff42 0%,transparent 49%),radial-gradient(ellipse at 60% 118%,#ffffff38 0%,transparent 48%);box-shadow:inset 0 0 5px #ffffff3b;pointer-events:none}.nsp-trigger{position:absolute;top:-14px;left:61%;z-index:2;display:flex;align-items:center;justify-content:center;min-width:64px;max-width:min(196px,calc(50vw - var(--nsp-size) * .11 - 16px));height:64px;border:0;border-radius:999px;padding:6px;background:var(--nsp-surface);color:var(--nsp-ink);font:400 16px/1.3 "Nibble Status Inter",Inter,Arial,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}.nsp-trigger:disabled{cursor:default;opacity:.55}.nsp-trigger[data-hidden=true]{opacity:0;pointer-events:none}.nsp-badge-face{display:flex;align-items:center;justify-content:center;min-width:52px;height:52px;max-width:184px;border-radius:999px;background:var(--nsp-face);padding:0 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nsp-badge-face[data-custom=true]{display:block;line-height:52px}.nsp-emoji{font:28px/1 "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif;display:block}.nsp-trigger:focus-visible,.nsp-option:focus-visible{outline:2px solid color-mix(in srgb,var(--nsp-ink) 65%,transparent);outline-offset:4px}.nsp-stage svg{display:block;flex-shrink:0}.nsp-popover{position:fixed;inset:auto;margin:0;padding:0;border:0;overflow:visible;background:transparent;color:var(--nsp-ink);font:400 16px/1.4 "Nibble Status Inter",Inter,Arial,sans-serif;height:64px;transition:display 1000ms allow-discrete,overlay 1000ms allow-discrete}.nsp-popover[data-visible=false]{visibility:hidden}.nsp-popover::backdrop{background:transparent}.nsp-surface{position:absolute;left:0;top:0;height:64px;border-radius:999px;background:var(--nsp-surface);pointer-events:none}.nsp-options{position:absolute;inset:6px;display:flex;align-items:center;isolation:isolate}.nsp-option{position:relative;z-index:1;height:52px;flex:1;min-width:0;border:0;border-radius:50%;padding:0;display:grid;place-items:center;background:transparent;color:var(--nsp-muted);cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.nsp-hover{position:absolute;left:0;top:0;width:52px;height:52px;border-radius:50%;background:var(--nsp-hover);pointer-events:none}.nsp-tip{position:absolute;top:-44px;left:0;z-index:5;pointer-events:none}.nsp-tip-body{position:relative;transform:translateX(-50%);border-radius:999px;background:var(--nsp-tip);color:var(--nsp-tip-ink);padding:7px 14px;min-height:32px;font-size:16px;line-height:20px;white-space:nowrap}.nsp-custom{position:absolute;inset:0;display:flex;align-items:center;gap:14px;padding:0 22px;color:var(--nsp-muted)}.nsp-custom input{font:400 20px/1.3 "Nibble Status Inter",Inter,Arial,sans-serif;min-width:0;width:100%;color:var(--nsp-ink);background:transparent;border:0;padding:0;outline:0;border-radius:0}.nsp-custom input::placeholder{color:var(--nsp-muted);opacity:1}.nsp-ghost{position:absolute;display:grid;place-items:center;height:52px;border-radius:999px;background:var(--nsp-face);color:var(--nsp-ink);white-space:nowrap;overflow:hidden;font-size:16px;pointer-events:none}.nsp-live{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.nsp-stage[data-running=false] .nsp-orb-field,.nsp-stage[data-running=false] .nsp-orb-field::before,.nsp-stage[data-running=false] .nsp-orb-field::after{animation-play-state:paused}@keyframes nsp-orbit{to{transform:rotate(360deg)}}@keyframes nsp-current{from{transform:translate(-4%,-3%) rotate(-12deg) scale(.97)}to{transform:translate(5%,5%) rotate(15deg) scale(1.08)}}@media(prefers-reduced-motion:reduce){.nsp-stage *, .nsp-stage *::before,.nsp-stage *::after{animation:none!important;transition:none!important}}@media(max-width:350px){.nsp-custom{padding:0 17px;gap:11px}.nsp-custom input{font-size:18px}}
`;

function StatusIcon({ smile = false, size = 26 }: { smile?: boolean; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{smile ? <><path d="M22.5 13.7a10.5 10.5 0 1 1-9-10.1M20 2.5v7m-3.5-3.5h7" /><path d="M9 16.5a5.8 5.8 0 0 0 10 0M9.5 10.8v.4m6 0v.4" /></> : <><path d="M24 13.4A10.5 10.5 0 0 1 8.1 22.5L3.5 24l1.3-4.8A10.5 10.5 0 1 1 24 13.4Z" /><path d="M14 8v10m-5-5h10" /></>}</svg>;
}

function initialSelection(id: StatusId, text: string): Status {
  return id === "custom" && text.trim() ? { id: "custom", label: text.trim().slice(0, 40), emoji: "" } : statuses.find(item => item.id === id && id !== "custom") ?? noStatus;
}

export function StatusPicker({ size = 128, hue = 220, bounce = 35, status = "none", customStatus = "", paused = false, disabled = false, replayKey = 0, onStatusChange, className = "", style }: StatusPickerProps) {
  const reduced = useReducedMotion(), id = useId();
  const host = useRef<HTMLDivElement>(null), widget = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), popup = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  const choices = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState<Status>(() => initialSelection(status, customStatus));
  const [open, setOpen] = useState(false), [closing, setClosing] = useState(false), [mode, setMode] = useState<"choices" | "custom">("choices");
  const [draft, setDraft] = useState(customStatus), [highlight, setHighlight] = useState<number | null>(null), [visible, setVisible] = useState(true);
  const [geometry, setGeometry] = useState({ left: 0, top: 0, width: 324, x: 176, y: 58, closedWidth: 64 });
  const snapshot = useRef({ mode, draft, selected, reduced, onStatusChange }); snapshot.current = { mode, draft, selected, reduced, onStatusChange };
  const cancel = useRef(false), committed = useRef(false), keyboard = useRef(false);
  const diameter = clamp(size, 80, 200, 128), angle = clamp(hue, 0, 360, 220);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, duration: .5, bounce: clamp(bounce, 0, 100, 35) / 100 };
  const fade = { duration: reduced ? 0 : .16, ease: easeOut };

  const measure = () => {
    if (!widget.current || !trigger.current) return;
    const orb = widget.current.getBoundingClientRect(), badge = trigger.current.getBoundingClientRect();
    const width = Math.min(324, Math.max(240, innerWidth - 16));
    const left = Math.max(8, Math.min(innerWidth - width - 8, orb.left + orb.width / 2 - width / 2));
    const top = Math.max(52, orb.top - 72);
    const next = { left, top, width, x: badge.left - left, y: badge.top - top, closedWidth: badge.width };
    setGeometry(previous => Object.keys(next).every(key => next[key as keyof typeof next] === previous[key as keyof typeof next]) ? previous : next);
  };
  const commit = (value: Status) => { committed.current = true; setSelected(value); snapshot.current.onStatusChange?.(value); };
  const close = (restore = true) => { popup.current?.hidePopover(); if (restore) trigger.current?.focus({ preventScroll: true }); };
  const choose = (value: Status) => {
    setHighlight(null);
    if (value.id === "custom") { setDraft(selected.id === "custom" ? selected.label : ""); setMode("custom"); return; }
    commit(value); close();
  };

  useEffect(() => {
    cancel.current = true;
    if (popup.current?.matches(":popover-open")) popup.current.hidePopover();
    setSelected(initialSelection(status, customStatus)); setDraft(customStatus);
  }, [status, customStatus, replayKey]);

  useEffect(() => {
    if (disabled && popup.current?.matches(":popover-open")) popup.current.hidePopover();
  }, [disabled]);

  useEffect(() => {
    const element = popup.current!;
    const toggle = (event: Event) => {
      const showing = (event as ToggleEvent).newState === "open";
      if (showing) {
        cancel.current = committed.current = false; setClosing(false); setOpen(true); setMode("choices");
        if (keyboard.current) requestAnimationFrame(() => choices.current[Math.max(0, statuses.findIndex(item => item.id === snapshot.current.selected.id))]?.focus());
      } else {
        const current = snapshot.current;
        if (current.mode === "custom" && !cancel.current && !committed.current && current.draft.trim()) {
          const value: Status = { id: "custom", label: current.draft.trim().slice(0, 40), emoji: "" };
          setSelected(value); current.onStatusChange?.(value);
        }
        setHighlight(null); setOpen(false); setClosing(!current.reduced);
        if (current.reduced) setMode("choices");
      }
    };
    element.addEventListener("beforetoggle", toggle);
    return () => element.removeEventListener("beforetoggle", toggle);
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(measure); observer.observe(widget.current!); observer.observe(trigger.current!); measure();
    const reposition = () => { if (popup.current?.matches(":popover-open")) measure(); };
    window.addEventListener("resize", reposition); window.addEventListener("scroll", reposition, true);
    return () => { observer.disconnect(); window.removeEventListener("resize", reposition); window.removeEventListener("scroll", reposition, true); };
  }, []);

  useEffect(() => {
    if (open && mode === "custom") {
      const raf = requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
      return () => cancelAnimationFrame(raf);
    }
  }, [open, mode]);

  useEffect(() => {
    let onScreen = true;
    const sync = () => setVisible(onScreen && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); });
    observer.observe(host.current!); document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % statuses.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + statuses.length - 1) % statuses.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = statuses.length - 1;
    else return;
    event.preventDefault(); choices.current[next]?.focus();
  };
  const slot = (geometry.width - 12) / statuses.length;
  const closedTransform = `translate(${geometry.x}px,${geometry.y}px)`;
  const icon = selected.emoji ? <span className="nsp-emoji">{selected.emoji}</span> : selected.id === "custom" ? selected.label : <StatusIcon smile />;

  return <div ref={host} className={`nsp-stage ${className}`} role="group" aria-label="Status picker" data-status={selected.id} data-open={open} data-running={!paused && visible} style={{ "--nsp-size": `${diameter}px`, "--nsp-hue": angle, ...style } as CSSProperties}>
    <style>{css}</style>
    <div ref={widget} className="nsp-widget" style={{ width: diameter, height: diameter }}>
      <div className="nsp-orb" aria-hidden="true"><div className="nsp-orb-field" /><div className="nsp-orb-shine" /></div>
      <button ref={trigger} type="button" className="nsp-trigger" popoverTarget={id} disabled={disabled} aria-label={selected.id === "none" ? "Set status" : `Change status: ${selected.label}`} aria-haspopup="dialog" aria-expanded={open} data-hidden={open || closing} onClick={event => { measure(); keyboard.current = event.detail === 0; }} onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); keyboard.current = true; trigger.current?.click(); } }}>
        <span className="nsp-badge-face" data-custom={selected.id === "custom"}>{icon}</span>
      </button>
    </div>
    <div ref={popup} id={id} popover="auto" role="dialog" aria-label="Choose your status" className="nsp-popover" data-visible={open || closing} inert={!open} style={{ width: geometry.width, left: geometry.left, top: geometry.top }} onKeyDownCapture={event => { if (event.key === "Escape") cancel.current = true; }}>
      <motion.div className="nsp-surface" initial={false} style={{ width: geometry.width + 48, left: -24 }} animate={{ clipPath: `inset(0px ${24 + (open ? 0 : Math.max(0, geometry.width - geometry.closedWidth))}px 0px 24px round 32px)`, transform: open ? "translate(0px,0px)" : closedTransform }} transition={spring} onAnimationComplete={() => { if (!open && closing) { setClosing(false); setMode("choices"); } }} />
      <AnimatePresence initial={false}>
        <motion.div key="choices" className="nsp-options" inert={mode !== "choices" || !open} aria-hidden={mode !== "choices"} role="toolbar" aria-label="Status options" initial={false} animate={{ opacity: open || closing ? 1 : 0 }} transition={fade} onPointerLeave={() => setHighlight(null)}>
          {highlight !== null && open && mode === "choices" && <motion.div className="nsp-hover" style={{ width: slot }} initial={false} animate={{ transform: `translateX(${highlight * slot}px)` }} transition={spring} />}
          {statuses.map((item, index) => <motion.button key={item.id} ref={element => { choices.current[index] = element; }} type="button" className="nsp-option" aria-label={item.label} aria-pressed={selected.id === item.id} tabIndex={index === (highlight ?? 0) ? 0 : -1} onPointerEnter={event => { if (event.pointerType === "mouse") setHighlight(index); }} onFocus={() => setHighlight(index)} onBlur={() => setHighlight(null)} onKeyDown={event => moveFocus(event, index)} onClick={() => choose(item)} initial={false} style={{ zIndex: !open && selected.id === item.id ? 3 : 1 }} animate={{ opacity: mode === "custom" ? 0 : open || (closing && selected.id === item.id) ? 1 : 0, backgroundColor: !open && selected.id === item.id ? "var(--nsp-face)" : "transparent", transform: open ? "translate(0px,0px) scale(1)" : `translate(${geometry.x + geometry.closedWidth / 2 - (6 + index * slot + slot / 2)}px,${geometry.y}px) scale(${selected.id === item.id ? 1 : .65})` }} transition={{ transform: { ...spring, delay: open && !reduced ? index * .03 : 0 }, opacity: { duration: reduced || (mode === "custom" && item.id === "custom") ? 0 : .16, delay: !reduced && open ? mode === "custom" ? (5 - index) * .02 : index * .03 : 0 }, backgroundColor: fade }}>
            {item.emoji ? <span className="nsp-emoji" style={{ fontSize: Math.min(28, slot * .54) }}>{item.emoji}</span> : <StatusIcon />}
          </motion.button>)}
        </motion.div>
        {mode === "custom" && <motion.form key="custom" className="nsp-custom" initial={{ opacity: 1 }} animate={{ opacity: open ? 1 : 0 }} exit={{ opacity: 0 }} transition={fade} onSubmit={event => { event.preventDefault(); if (draft.trim()) { commit({ id: "custom", label: draft.trim().slice(0, 40), emoji: "" }); close(); } }}>
          <motion.span className="nsp-custom-icon" initial={{ transform: reduced ? "translateX(0px)" : `translateX(${geometry.width - 6 - slot / 2 - 35}px)` }} animate={{ transform: "translateX(0px)" }} transition={spring}><StatusIcon /></motion.span><motion.input initial={{ opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }} animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }} transition={{ ...fade, duration: reduced ? 0 : .2, delay: reduced ? 0 : .08 }} ref={input} aria-label="Custom status" autoFocus placeholder="What's your status?" value={draft} maxLength={40} autoComplete="off" onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); const label = event.currentTarget.value.trim().slice(0, 40); if (label) { commit({ id: "custom", label, emoji: "" }); close(); } } }} />
        </motion.form>}
      </AnimatePresence>
      <AnimatePresence>{open && highlight !== null && mode === "choices" && <motion.div className="nsp-tip" role="tooltip" initial={{ opacity: 0 }} animate={{ opacity: 1, transform: `translateX(${6 + highlight * slot + slot / 2}px)` }} exit={{ opacity: 0 }} transition={fade}><div className="nsp-tip-body"><AnimatePresence mode="wait" initial={false}><motion.span key={highlight} style={{ display: "block" }} initial={{ opacity: 0, filter: "blur(3px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(3px)" }} transition={{ duration: reduced ? 0 : .08 }}>{statuses[highlight].label}</motion.span></AnimatePresence></div></motion.div>}</AnimatePresence>
      <motion.div className="nsp-ghost" aria-hidden="true" style={{ width: Math.max(52, geometry.closedWidth - 12) }} initial={false} animate={{ opacity: open || (closing && mode === "choices" && !!selected.emoji) ? 0 : 1, transform: `translate(${geometry.x + 6}px,${geometry.y + 6}px)` }} transition={fade}>{icon}</motion.div>
    </div>
    <span className="nsp-live" role="status" aria-live="polite">{selected.label || "No status selected"}</span>
  </div>;
}

export default StatusPicker;
