"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Activity = "timer" | "music" | "call";
export type ActivityIslandProps = {
  activity?: Activity; expanded?: boolean; autoplay?: boolean; bounce?: number; paused?: boolean;
  appearance?: "auto" | "light" | "dark"; replayKey?: number;
  onActivityChange?: (activity: Activity) => void; onExpandedChange?: (expanded: boolean) => void; className?: string; style?: CSSProperties;
};
type Call = "incoming" | "active" | "ended";

const activities: { id: Activity; label: string }[] = [{ id: "timer", label: "Timer" }, { id: "music", label: "Music" }, { id: "call", label: "Call" }];
// Photos are embedded so the component needs no network. Sources and licence: assets/sources.json.
const photos = {
  // Kevin's Nibble account avatar, generated with src/lib/account-avatar.ts from his account id (variant 0).
  avatar: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20fill%3D%22none%22%20shape-rendering%3D%22crispEdges%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22sky%22%20x2%3D%220%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2317192a%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23777ab7%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22url(%23sky)%22%2F%3E%3Crect%20x%3D%2246%22%20y%3D%2241%22%20width%3D%220.6%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.65%22%2F%3E%3Crect%20x%3D%2236%22%20y%3D%2220%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2213%22%20y%3D%2241%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2250%22%20y%3D%2215%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.65%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2229%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2249%22%20y%3D%2214%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%228%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.65%22%2F%3E%3Crect%20x%3D%2246%22%20y%3D%2232%22%20width%3D%220.6%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2217%22%20y%3D%2219%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2261%22%20y%3D%2237%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.65%22%2F%3E%3Crect%20x%3D%2227%22%20y%3D%224%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2229%22%20y%3D%2214%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%2248%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.65%22%2F%3E%3Crect%20x%3D%2243%22%20y%3D%2227%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%2236%22%20width%3D%220.6%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2233%22%20y%3D%2227%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.65%22%2F%3E%3Crect%20x%3D%2231%22%20y%3D%2229%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2236%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%2259%22%20y%3D%223%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.65%22%2F%3E%3Crect%20x%3D%227%22%20y%3D%2230%22%20width%3D%220.3%22%20height%3D%220.5%22%20fill%3D%22%23fff4d6%22%20opacity%3D%220.3%22%2F%3E%3Cpath%20d%3D%22M0%2056Q32%2049%2064%2056V64H0Z%22%20fill%3D%22%23777ab7%22%2F%3E%3Cpath%20d%3D%22M0%2060Q32%2054%2064%2060V64H0Z%22%20fill%3D%22%23c0c3ed%22%20opacity%3D%22.35%22%2F%3E%3Cpath%20d%3D%22M23%2042H42V45H45V64H19V46H23Z%22%20fill%3D%22%23287cff%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2247%22%20width%3D%223%22%20height%3D%2217%22%20fill%3D%22%23f73975%22%2F%3E%3Crect%20x%3D%2242%22%20y%3D%2247%22%20width%3D%223%22%20height%3D%2217%22%20fill%3D%22%23f73975%22%2F%3E%3Crect%20x%3D%2225%22%20y%3D%2248%22%20width%3D%2215%22%20height%3D%2210%22%20fill%3D%22%23fff4d6%22%2F%3E%3Crect%20x%3D%2227%22%20y%3D%2250%22%20width%3D%2211%22%20height%3D%226%22%20fill%3D%22%2324292c%22%2F%3E%3Crect%20x%3D%2228%22%20y%3D%2251%22%20width%3D%223%22%20height%3D%222%22%20fill%3D%22%23ff654f%22%2F%3E%3Crect%20x%3D%2234%22%20y%3D%2254%22%20width%3D%223%22%20height%3D%221%22%20fill%3D%22%23f73975%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2261%22%20width%3D%2217%22%20height%3D%222%22%20fill%3D%22%23f73975%22%2F%3E%3Cpath%20d%3D%22M23%2016H41V19H45V24H48V33H44V38H39V42H27V39H22V35H18V25H20V20H23Z%22%20fill%3D%22%23a4e0ad%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%2238%22%20width%3D%225%22%20height%3D%221%22%20fill%3D%22%234d8862%22%2F%3E%3Crect%20x%3D%2217%22%20y%3D%2227%22%20width%3D%2232%22%20height%3D%222%22%20fill%3D%22%23ff654f%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2225%22%20width%3D%2213%22%20height%3D%2211%22%20fill%3D%22%23ff654f%22%2F%3E%3Crect%20x%3D%2234%22%20y%3D%2225%22%20width%3D%2213%22%20height%3D%2211%22%20fill%3D%22%23ff654f%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2227%22%20width%3D%229%22%20height%3D%227%22%20fill%3D%22%23101619%22%2F%3E%3Crect%20x%3D%2236%22%20y%3D%2227%22%20width%3D%229%22%20height%3D%227%22%20fill%3D%22%23101619%22%2F%3E%3Crect%20x%3D%2221%22%20y%3D%2227%22%20width%3D%222%22%20height%3D%226%22%20fill%3D%22%23fffef2%22%2F%3E%3Crect%20x%3D%2237%22%20y%3D%2227%22%20width%3D%222%22%20height%3D%226%22%20fill%3D%22%23fffef2%22%2F%3E%3Cpath%20d%3D%22M18%2026V21H21V18H44V21H47V26H45V22H42V20H23V22H20V26Z%22%20fill%3D%22%2324292c%22%2F%3E%3Crect%20x%3D%2216%22%20y%3D%2227%22%20width%3D%223%22%20height%3D%2210%22%20fill%3D%22%23f73975%22%2F%3E%3Crect%20x%3D%2247%22%20y%3D%2227%22%20width%3D%223%22%20height%3D%2210%22%20fill%3D%22%23f73975%22%2F%3E%3C%2Fsvg%3E",
  tide: "data:image/jpeg;base64,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",
  night: "data:image/jpeg;base64,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",
  dust: "data:image/jpeg;base64,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",
};
const tracks = [
  { title: "Marea baja", artist: "Lunes Lento · Orillas", length: 204, hue: 200, cover: photos.tide },
  { title: "Night signal", artist: "Northern Line · Afterglow", length: 187, hue: 276, cover: photos.night },
  { title: "Polvo", artist: "Casa Lejana · Vol. 2", length: 231, hue: 8, cover: photos.dust },
];
// Every resting shape of the island. Single rows are capsules: the radius is half the height.
const shapes = { idle: [124, 38, 19], compact: [176, 38, 19], row: [340, 76, 38], music: [340, 172, 36] } as const;
const clamp = (value: number, min: number, max: number, fallback: number) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
const clock = (seconds: number, pad = false) => `${pad ? String(Math.floor(seconds / 60)).padStart(2, "0") : Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
const icons = {
  pause: "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z",
  play: "M8.5 5.5v13l10.5-6.5z",
  skip: "M4.5 6.5v11l7.5-5.5zM12.5 6.5v11l7.5-5.5z",
  phone: "M6.5 3h3.2l1.6 4.2-2.1 1.5a12.5 12.5 0 0 0 6.1 6.1l1.5-2.1 4.2 1.6v3.2a1.5 1.5 0 0 1-1.5 1.5A16.5 16.5 0 0 1 3 4.5 1.5 1.5 0 0 1 4.5 3z",
};

const css = `
.nai-stage,.nai-stage *{box-sizing:border-box}
.nai-stage{--nai-ink:light-dark(#171717,#f3f3f3);--nai-muted:light-dark(#6e6e6e,#9a9a9a);--nai-soft:light-dark(#ebebeb,#232323);--nai-chip:light-dark(#fff,#3a3a3a);--nai-ring:light-dark(transparent,rgb(255 255 255/.1));--nai-drop:light-dark(rgb(0 0 0/.22),rgb(0 0 0/.5));--nai-orange:#ffa31a;--nai-green:#34d066;--nai-red:#ff4d42;width:100%;min-width:0;min-height:420px;display:grid;justify-items:center;align-content:center;gap:28px;padding:32px 16px;background:transparent;color:var(--nai-ink);font:400 14px/1.3 "Nibble Island Inter",Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;text-align:left}
.nai-stage button{font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.nai-slot{width:100%;height:172px;display:grid;justify-items:center;align-items:center}
.nai-island{position:relative;overflow:hidden;background:#000;color:#fff;box-shadow:inset 0 0 0 1px var(--nai-ring),0 10px 30px var(--nai-drop);font-variant-numeric:tabular-nums;will-change:width,height}
.nai-view{position:absolute;inset:0}
.nai-hit{width:100%;height:100%;padding:0 8px;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:8px;border:0;border-radius:inherit;background:transparent}
.nai-hit{outline:0}
.nai-island:has(.nai-hit:focus-visible),.nai-tab:focus-visible{outline:2px solid var(--nai-ink);outline-offset:2px}
.nai-round:focus-visible{outline:2px solid #fff;outline-offset:2px}
.nai-lead{flex:none;width:22px;height:22px;display:grid;place-items:center}
.nai-tail{flex:none;min-width:22px;height:22px;padding-right:4px;display:grid;place-items:center;font-size:14px;font-weight:550;letter-spacing:-.01em}
.nai-tail[data-bars=true]{padding-right:0}
.nai-dot{width:8px;height:8px;border-radius:999px;background:var(--nai-green);animation:nai-pulse 2s ease-in-out infinite}
.nai-art{display:block;border-radius:var(--nai-art,6px);background:#222 center/cover no-repeat;box-shadow:inset 0 0 0 1px rgb(255 255 255/.14)}
.nai-bars{height:16px;display:flex;align-items:center;gap:2px}
.nai-bars i{width:3px;height:100%;border-radius:2px;background:linear-gradient(hsl(calc(var(--nai-hue) + 40) 95% 72%),hsl(calc(var(--nai-hue) - 30) 90% 62%));transform-origin:50% 50%;transform:scaleY(.25);animation:nai-bar 1s ease-in-out infinite;animation-play-state:var(--nai-play,running)}
.nai-bars i:nth-child(1){animation-duration:.82s}.nai-bars i:nth-child(2){animation-duration:1.14s;animation-delay:-.4s}.nai-bars i:nth-child(3){animation-duration:.94s;animation-delay:-.7s}.nai-bars i:nth-child(4){animation-duration:1.26s;animation-delay:-.2s}
.nai-bars[data-on=false] i{animation:none}
.nai-row{height:100%;padding:0 16px;display:flex;align-items:center;gap:10px}
.nai-round{flex:none;width:44px;height:44px;padding:0;display:grid;place-items:center;border:0;border-radius:999px;background:rgb(255 255 255/.16);color:#fff;transition:transform .16s cubic-bezier(.23,1,.32,1),filter .16s cubic-bezier(.23,1,.32,1)}
.nai-round:hover{filter:brightness(1.15)}
.nai-round:active{transform:scale(.92)}
.nai-round[data-tone=orange]{background:rgb(255 163 26/.24);color:var(--nai-orange)}
.nai-round[data-tone=green]{background:var(--nai-green)}
.nai-round[data-tone=red]{background:var(--nai-red)}
.nai-round[data-size=small]{width:36px;height:36px;background:transparent}
.nai-fill{flex:1;min-width:0}
.nai-name{margin:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:15px;font-weight:600;letter-spacing:-.01em}
.nai-sub{margin:1px 0 0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:rgb(255 255 255/.6);font-size:13px}
.nai-sub[data-tone=green]{color:var(--nai-green)}
.nai-count{padding-right:8px;text-align:right;color:var(--nai-orange)}
.nai-count small{display:block;font-size:13px;font-weight:500;opacity:.8}
.nai-count b{display:block;font-size:38px;line-height:1;font-weight:300;letter-spacing:-.03em}
.nai-avatar{flex:none;display:block;width:var(--nai-face,44px);height:var(--nai-face,44px);border-radius:999px;background:#222 center/cover no-repeat;box-shadow:inset 0 0 0 1px rgb(255 255 255/.14)}
.nai-player{height:100%;padding:18px;display:grid;grid-template-rows:52px 12px 44px;row-gap:14px;align-content:start}
.nai-head{display:flex;align-items:center;gap:12px;min-width:0}
.nai-seek{display:flex;align-items:center;gap:10px;color:rgb(255 255 255/.6);font-size:11px;font-weight:500}
.nai-seek span{flex:none;width:28px}.nai-seek span:last-child{text-align:right}
.nai-track{flex:1;height:6px;border-radius:3px;background:rgb(255 255 255/.22);overflow:hidden}
.nai-track i{display:block;height:100%;border-radius:3px;background:#fff;transform-origin:0 50%;transition:transform 1s linear}
.nai-controls{display:flex;align-items:center;justify-content:center;gap:20px}
.nai-tabs{position:relative;height:36px;padding:3px;display:flex;border-radius:999px;background:var(--nai-soft)}
.nai-tab{position:relative;height:30px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:var(--nai-muted);font-size:13px;font-weight:500;transition:color .18s cubic-bezier(.23,1,.32,1)}
.nai-tab[aria-checked=true]{color:var(--nai-ink)}
.nai-tab span{position:relative}
.nai-thumb{position:absolute;inset:0;border-radius:999px;background:var(--nai-chip);box-shadow:0 1px 2px rgb(0 0 0/.12)}
.nai-note{margin:-16px 0 0;color:var(--nai-muted);font-size:13px;text-align:center}
@keyframes nai-bar{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
@keyframes nai-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@media (prefers-reduced-motion:reduce){.nai-bars i,.nai-dot{animation:none}.nai-bars i{transform:scaleY(.6)}.nai-track i{transition:none}}
`;

function Glyph({ name, size = 20, flip = false, turn = 0 }: { name: keyof typeof icons; size?: number; flip?: boolean; turn?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", transform: `${flip ? "scaleX(-1)" : ""} rotate(${turn}deg)` }}><path d={icons[name]} /></svg>;
}
function Cross({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" style={{ display: "block" }}><path d="m7 7 10 10M17 7 7 17" /></svg>;
}
function Dial({ progress, size = 20 }: { progress: number; size?: number }) {
  const length = 2 * Math.PI * 8;
  return <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true" style={{ display: "block", transform: "rotate(-90deg)" }}>
    <circle cx="11" cy="11" r="8" stroke="rgb(255 163 26/.3)" strokeWidth="3" /><circle cx="11" cy="11" r="8" stroke="#ffa31a" strokeWidth="3" strokeLinecap="round" strokeDasharray={length} strokeDashoffset={length * (1 - progress)} style={{ transition: "stroke-dashoffset 1s linear" }} />
  </svg>;
}
const Bars = ({ on }: { on: boolean }) => <span className="nai-bars" data-on={on} aria-hidden="true"><i /><i /><i /><i /></span>;

export function ActivityIsland({ activity = "timer", expanded = false, autoplay = true, bounce = 28, paused = false, appearance = "auto", replayKey = 0, onActivityChange, onExpandedChange, className = "", style }: ActivityIslandProps) {
  const reduced = !!useReducedMotion();
  const [current, setCurrent] = useState<Activity>(activity), [open, setOpen] = useState(expanded), [touched, setTouched] = useState(false), [limit, setLimit] = useState(340);
  const [timer, setTimer] = useState({ left: 272, running: true, off: false });
  const [music, setMusic] = useState({ track: 0, at: 47, playing: true });
  const [call, setCall] = useState<{ phase: Call; seconds: number }>({ phase: "incoming", seconds: 0 });
  const stage = useRef<HTMLDivElement>(null), island = useRef<HTMLDivElement>(null), refocus = useRef(false);
  const track = tracks[music.track], idle = (current === "timer" && timer.off) || (current === "call" && call.phase === "ended");
  const ringing = current === "call" && call.phase === "incoming", large = (open || ringing) && !idle;
  const [width, height, radius] = idle ? shapes.idle : !large ? shapes.compact : current === "music" ? shapes.music : shapes.row;
  const view = idle ? "idle" : `${current}-${large ? "open" : "closed"}${current === "call" ? `-${call.phase}` : ""}`;

  const expand = (next: boolean, focus = true) => { if (next === open) return; refocus.current = focus; setOpen(next); onExpandedChange?.(next); };
  const choose = (next: Activity, focus = false) => {
    refocus.current = focus;
    setCurrent(next); onActivityChange?.(next); setOpen(false);
    if (next === "timer") setTimer({ left: 272, running: true, off: false });
    if (next === "call") setCall({ phase: "incoming", seconds: 0 });
    if (next === "music") setMusic(previous => ({ ...previous, playing: true }));
  };
  const skip = (step: number) => setMusic(previous => step < 0 && previous.at > 3 ? { ...previous, at: 0 } : { track: (previous.track + step + tracks.length) % tracks.length, at: 0, playing: true });

  useEffect(() => {
    setCurrent(activity); setOpen(expanded); setTouched(false);
    setTimer({ left: 272, running: true, off: false }); setMusic({ track: 0, at: 47, playing: true }); setCall({ phase: "incoming", seconds: 0 });
  }, [activity, expanded, replayKey]);
  // One clock drives the countdown, the song position and the call duration.
  useEffect(() => {
    if (paused) return;
    const tick = setInterval(() => {
      setTimer(previous => previous.running && !previous.off ? { ...previous, left: previous.left > 0 ? previous.left - 1 : 300 } : previous);
      setMusic(previous => !previous.playing ? previous : previous.at + 1 >= tracks[previous.track].length ? { track: (previous.track + 1) % tracks.length, at: 0, playing: true } : { ...previous, at: previous.at + 1 });
      setCall(previous => previous.phase === "active" ? { ...previous, seconds: previous.seconds + 1 } : previous);
    }, 1000);
    return () => clearInterval(tick);
  }, [paused]);
  // Until someone touches it, the island tours its own states so a still preview shows what it does.
  useEffect(() => {
    if (!autoplay || touched || paused || reduced) return;
    const steps: (() => void)[] = [
      () => setOpen(true), () => { setOpen(false); setCurrent("music"); }, () => setOpen(true),
      () => { setOpen(false); setCurrent("call"); setCall({ phase: "incoming", seconds: 0 }); }, () => { setCall({ phase: "active", seconds: 0 }); setOpen(true); },
      () => setOpen(false), () => { setCurrent("timer"); setTimer(previous => ({ ...previous, off: false })); },
    ];
    let index = 0;
    const tour = setInterval(() => { steps[index++ % steps.length](); }, 2600);
    return () => clearInterval(tour);
  }, [autoplay, touched, paused, reduced]);
  useLayoutEffect(() => {
    const element = stage.current!;
    const measure = () => setLimit(Math.max(240, Math.min(340, element.clientWidth - 32)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!large) return;
    const outside = (event: PointerEvent) => { if (!island.current?.contains(event.target as Node)) expand(false, false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") expand(false); };
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  });
  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    // The outgoing view is still mounted while it fades, so take the button from the incoming one.
    const views = island.current?.querySelectorAll<HTMLElement>(".nai-view");
    views?.[views.length - 1]?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
  }, [view]);

  const spring = reduced ? { duration: 0 } : { type: "spring" as const, duration: .5, bounce: clamp(bounce, 0, 60, 28) / 100 };
  const swap = { duration: reduced ? 0 : .22, ease: [.23, 1, .32, 1] as const };
  const round = (label: string, onClick: () => void, child: ReactNode, tone?: string, size?: string) => <button type="button" className="nai-round" data-tone={tone} data-size={size} aria-label={label} onClick={event => { event.stopPropagation(); onClick(); }}>{child}</button>;
  const compact = (label: string, lead: ReactNode, tail: ReactNode, bars = false, tone?: string) => <button type="button" className="nai-hit" aria-expanded="false" aria-label={label} onClick={() => expand(true)}>
    <span className="nai-lead">{lead}</span><span className="nai-tail" data-bars={bars} style={{ color: tone }}>{tail}</span>
  </button>;

  let content: ReactNode;
  if (idle) content = <button type="button" className="nai-hit" style={{ justifyContent: "center" }} aria-label={`Start ${current} again`} onClick={() => choose(current, true)}><span className="nai-dot" /><span className="nai-tail" style={{ color: "rgb(255 255 255/.6)", fontWeight: 500 }}>Ready</span></button>;
  else if (current === "timer") content = !large
    ? compact(`Timer, ${clock(timer.left, true)} left. Expand`, <Dial progress={timer.left / 300} />, clock(timer.left, true), false, "var(--nai-orange)")
    : <div className="nai-row" role="group" aria-label="Timer">
      {round(timer.running ? "Pause timer" : "Resume timer", () => setTimer(previous => ({ ...previous, running: !previous.running })), <Glyph name={timer.running ? "pause" : "play"} />, "orange")}
      {round("Cancel timer", () => { refocus.current = true; setTimer(previous => ({ ...previous, off: true })); setOpen(false); }, <Cross />)}
      <div className="nai-fill nai-count" aria-live="off"><small>Focus · 5 min</small><b>{clock(timer.left, true)}</b></div>
    </div>;
  else if (current === "music") content = !large
    ? compact(`Playing ${track.title} by ${track.artist}. Expand`, <i className="nai-art" style={{ width: 22, height: 22, backgroundImage: `url("${track.cover}")` }} />, <Bars on={music.playing && !paused} />, true)
    : <div className="nai-player" role="group" aria-label="Now playing">
      <div className="nai-head">
        <i className="nai-art" style={{ flex: "none", width: 52, height: 52, "--nai-art": "18px", backgroundImage: `url("${track.cover}")` } as CSSProperties} />
        <div className="nai-fill"><p className="nai-name">{track.title}</p><p className="nai-sub">{track.artist}</p></div>
        <Bars on={music.playing && !paused} />
      </div>
      <div className="nai-seek"><span>{clock(music.at)}</span><div className="nai-track" role="progressbar" aria-label="Song position" aria-valuemin={0} aria-valuemax={track.length} aria-valuenow={music.at}><i style={{ transform: `scaleX(${music.at / track.length})` }} /></div><span>-{clock(track.length - music.at)}</span></div>
      <div className="nai-controls">
        {round("Previous", () => skip(-1), <Glyph name="skip" size={24} flip />, undefined, "small")}
        {round(music.playing ? "Pause" : "Play", () => setMusic(previous => ({ ...previous, playing: !previous.playing })), <Glyph name={music.playing ? "pause" : "play"} size={24} />)}
        {round("Next", () => skip(1), <Glyph name="skip" size={24} />, undefined, "small")}
      </div>
    </div>;
  else content = !large
    ? compact(`Call with Kevin, ${clock(call.seconds)}. Expand`, <span className="nai-avatar" style={{ "--nai-face": "22px", backgroundImage: `url("${photos.avatar}")` } as CSSProperties} />, clock(call.seconds), false, "var(--nai-green)")
    : <div className="nai-row" role="group" aria-label={ringing ? "Incoming call" : "Call in progress"}>
      <span className="nai-avatar" aria-hidden="true" style={{ backgroundImage: `url("${photos.avatar}")` }} />
      <div className="nai-fill"><p className="nai-name">Kevin</p><p className="nai-sub" data-tone={ringing ? undefined : "green"}>{ringing ? "Mobile · Madrid" : clock(call.seconds)}</p></div>
      {round(ringing ? "Decline" : "End call", () => { refocus.current = true; setCall(previous => ({ ...previous, phase: "ended" })); setOpen(false); }, <Glyph name="phone" turn={135} />, "red")}
      {ringing && round("Accept", () => { refocus.current = true; setCall({ phase: "active", seconds: 0 }); setOpen(true); }, <Glyph name="phone" />, "green")}
    </div>;

  return <div ref={stage} className={`nai-stage ${className}`} data-view={view} onPointerDownCapture={() => setTouched(true)} onKeyDownCapture={() => setTouched(true)}
    style={{ colorScheme: appearance === "auto" ? undefined : appearance, "--nai-hue": track.hue, "--nai-play": paused ? "paused" : "running", ...style } as CSSProperties}>
    <style>{css}</style>
    <div className="nai-slot">
      <motion.div ref={island} className="nai-island" initial={false} animate={{ width: Math.min(width, limit), height, borderRadius: radius }} transition={spring}
        whileHover={large || reduced ? undefined : { scale: 1.03 }} whileTap={large || reduced ? undefined : { scale: .96 }}
        onClick={event => { if (large && !ringing && !(event.target as HTMLElement).closest("button")) expand(false, false); }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div key={view} className="nai-view" initial={{ opacity: 0, scale: reduced ? 1 : .9, filter: reduced ? "blur(0px)" : "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { ...swap, delay: reduced ? 0 : .08 } }} exit={{ opacity: 0, scale: reduced ? 1 : .94, filter: reduced ? "blur(0px)" : "blur(6px)", transition: { duration: reduced ? 0 : .12 } }}>
            {content}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
    <div className="nai-tabs" role="radiogroup" aria-label="Activity">
      {activities.map(item => <button key={item.id} type="button" className="nai-tab" role="radio" aria-checked={item.id === current} onClick={() => choose(item.id)}>
        {item.id === current && <motion.i className="nai-thumb" layoutId="nai-thumb" transition={reduced ? { duration: 0 } : { type: "spring", duration: .4, bounce: .18 }} />}
        <span>{item.label}</span>
      </button>)}
    </div>
    <p className="nai-note">Tap the island to open it.</p>
  </div>;
}
