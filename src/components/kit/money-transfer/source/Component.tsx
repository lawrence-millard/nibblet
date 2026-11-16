"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type MoneyTransferProps = {
  amount?: number; recipient?: string; account?: string; exchangeRate?: number;
  duration?: number; glowStrength?: number; cardWidth?: number; paused?: boolean; replayKey?: number;
};

const css = `
.nmt-scene,.nmt-scene *{box-sizing:border-box}.nmt-scene{width:100%;display:grid;place-items:center;padding:24px 0;color:#171717;font-family:"Nibble Money Inter",Inter,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.nmt-card{position:relative;width:min(100%,var(--nmt-width));padding:16px;background:#fff;border-radius:30px;overflow:hidden;isolation:isolate;box-shadow:0 10px 40px #0000000a;border:1px solid #ffffff80}
.nmt-content{position:relative;transition:filter .4s cubic-bezier(.23,1,.32,1),opacity .4s cubic-bezier(.23,1,.32,1);filter:blur(0);opacity:1}
.nmt-header{padding:9px 10px 19px;min-height:76px}.nmt-header h3{font-size:20px;line-height:1.2;letter-spacing:-.55px;font-weight:500;margin:0 36px 4px 0}.nmt-header p{font-size:14px;line-height:1.5;margin:0;color:#404040}
.nmt-close{position:absolute;z-index:5;top:26px;right:26px;width:30px;height:30px;display:grid;place-items:center;border:1px solid #e5e5e5;border-radius:50%;background:#f1f2f0;color:#242424;cursor:pointer;padding:0}
.nmt-sheet{background:#f5f5f3;border:1px solid #fafbf8;border-radius:23px;padding:22px 28px 18px;box-shadow:inset 0 0 15px #ffffff50}.nmt-caption{font-size:13px;color:#4b4b4b;margin:0 0 9px}.nmt-amount{display:flex;align-items:center;gap:7px;white-space:nowrap;font-size:clamp(24px,7.7vw,35px);line-height:1.15;letter-spacing:-.7px;font-weight:500;margin-bottom:12px;font-variant-numeric:tabular-nums}.nmt-currency{font-weight:400;color:#5c5c5c;letter-spacing:-.7px}.nmt-sent .nmt-amount{color:#15a629}.nmt-sent .nmt-currency{color:#8cca8c}
.nmt-flag{flex-shrink:0;margin-left:auto;width:29px;height:29px;display:block;filter:drop-shadow(0 1px 2px #0001)}.nmt-row{display:flex;justify-content:space-between;align-items:baseline;gap:15px;padding:13px 0;border-top:1px solid #e6e6e2;font-size:14px;line-height:1.4}.nmt-amount + .nmt-row{border:0}.nmt-row span{color:#51534f;flex-shrink:0}.nmt-row strong{font-weight:400;text-align:right;overflow-wrap:anywhere}
.nmt-actions{display:flex;gap:8px;margin-top:15px}.nmt-button{display:grid;place-items:center;flex:1;min-width:0;border:1px solid #141414;border-radius:999px;background:#151517;color:#fff;min-height:44px;padding:10px 15px;font:400 14px/1.3 "Nibble Money Inter",Inter,Arial,sans-serif;cursor:pointer;transition:background 160ms ease,transform 160ms cubic-bezier(.23,1,.32,1)}.nmt-button:hover{background:#2b2b2e}.nmt-button:active{transform:scale(.98)}.nmt-button:focus-visible,.nmt-close:focus-visible{outline:2px solid #6366f1;outline-offset:3px}.nmt-secondary{background:#f0f1ee;border-color:#f0f1ee;color:#222}.nmt-secondary:hover{background:#e5e6e3}
.nmt-card[data-busy=true] .nmt-close{background:#f1f2f040;border-color:transparent}.nmt-card[data-busy=true] .nmt-content{pointer-events:none;user-select:none}.nmt-content{transition:none}.nmt-content>header,.nmt-content>.nmt-sheet,.nmt-content>.nmt-actions{will-change:filter,opacity}.nmt-card[data-receipt=true] .nmt-amount{color:#15a629}.nmt-card[data-receipt=true] .nmt-currency{color:#8cca8c}
.nmt-light{position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;mix-blend-mode:multiply;opacity:0}.nmt-card[data-busy=true] .nmt-light{opacity:var(--nmt-glow)}
.nmt-busy{position:absolute;z-index:4;inset:0;display:grid;place-items:center;pointer-events:none}.nmt-status{display:flex;align-items:center;gap:9px;font-size:14px;color:#454844}.nmt-status-text{background:linear-gradient(100deg,#454844 20%,#454844 40%,#c9ccc8 51%,#454844 62%,#454844 80%);background-size:240% 100%;background-clip:text;-webkit-background-clip:text;color:transparent;animation:nmt-shimmer 2.1s linear infinite}.nmt-spinner{width:15px;height:15px;border:1px solid #b7bbb6;border-top-color:#393e39;border-radius:50%;animation:nmt-spin .9s linear infinite}
.nmt-scene[data-running=false] *{animation-play-state:paused!important}@keyframes nmt-spin{to{transform:rotate(360deg)}}@keyframes nmt-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}
@media(max-width:420px){.nmt-card{padding:12px;border-radius:25px}.nmt-sheet{padding:20px 16px 10px}.nmt-header{padding:8px 6px 18px}.nmt-header h3{font-size:19px}.nmt-header p{max-width:90%;font-size:12px}.nmt-row{font-size:12px;gap:8px;padding:13px 0}.nmt-amount{font-size:27px;gap:5px}.nmt-flag{width:25px;height:25px}.nmt-close{top:21px;right:20px;width:27px;height:27px}}
@media(prefers-reduced-motion:reduce){.nmt-scene *{animation:none!important;transition:none!important}.nmt-spinner{border-top-color:#393e39}}
`;

function Flag() {
  return <svg className="nmt-flag" viewBox="0 0 30 30" aria-label="US dollar"><defs><clipPath id="nmt-flag-circle"><circle cx="15" cy="15" r="14" /></clipPath></defs><g clipPath="url(#nmt-flag-circle)"><path fill="#fff" d="M0 0h30v30H0z" /><path stroke="#ef3542" strokeWidth="2.3" d="M0 2h30M0 6.6h30M0 11.2h30M0 15.8h30M0 20.4h30M0 25h30M0 29.6h30" /><path fill="#20458b" d="M0 0h16v16H0z" /><path fill="#fff" d="M4 2h1v1H4zm5 0h1v1H9zm5 0h1v1h-1zM2 6h1v1H2zm5 0h1v1H7zm5 0h1v1h-1zM4 10h1v1H4zm5 0h1v1H9zm5 0h1v1h-1zM2 14h1v1H2zm5 0h1v1H7zm5 0h1v1h-1z" /></g></svg>;
}

const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
const random = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
};
// A continuous, warped color field. Every pixel and particle is computed here.
const gaussianTable = Float32Array.from({ length: 4097 }, (_, i) => Math.exp(-i / 256));
const gaussian = (distance: number) => gaussianTable[Math.min(4096, Math.floor(distance * distance * 256))];
const lightFields = new WeakMap<HTMLCanvasElement, { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D; pixels: ImageData }>();
const lightColors = [[255, 179, 137], [255, 144, 231], [255, 115, 225], [248, 130, 231], [180, 73, 202], [190, 94, 214], [255, 188, 137], [255, 223, 116]];

function paintProceduralLight(canvas: HTMLCanvasElement, progress: number, reduced: boolean) {
  const context = canvas.getContext("2d");
  if (!context) return;
  let field = lightFields.get(canvas);
  if (!field) {
    const buffer = document.createElement("canvas");
    // Smooth continuous bands need no stored image or full-size pixel processing.
    buffer.width = 304; buffer.height = 318;
    const bufferContext = buffer.getContext("2d")!;
    field = { canvas: buffer, context: bufferContext, pixels: bufferContext.createImageData(304, 318) };
    lightFields.set(canvas, field);
  }
  const t = reduced ? .45 : progress, seconds = t * 4.8;
  const entrance = smooth((t - .045) / .16);
  const exit = Math.max(0, Math.min(1, (t - .835) / .165));
  const lift = exit * exit * 1280;
  const fade = 1 - smooth((t - .92) / .08);
  const spread = 1 + exit * 2.1;
  const goldX = 210 - Math.sin(seconds * 1.85) * 23 + Math.cos(seconds * 3.1) * 9;
  const pixels = field.pixels.data, width = field.canvas.width, height = field.canvas.height;
  for (let column = 0; column < width; column++) {
    const x = column * 456 / (width - 1);
    const wave = 398 + Math.sin(x * .014 + seconds * 2.1) * 11 + Math.sin(x * .031 - seconds * 1.7) * 6;
    const bend = Math.sin(x * .009 - seconds * 1.5) * 9;
    const right = gaussian((x - 390 - Math.sin(seconds * 2.3) * 16) / 83);
    const left = gaussian((x - 31 - Math.cos(seconds * 1.8) * 12) / 63);
    const gold = gaussian((x - goldX) / (83 * (1 + exit * .4)));
    const centers = [wave - 50, wave, wave, wave + 60, wave + 40 + bend, wave + 44 - bend, wave + 65, wave + 74];
    const radii = [39, 70, 44, 57, 28, 29, 47, 43];
    const strengths = [.23, .17, (.63 + Math.sin(x * .012 + seconds * 2.6) * .055) * (1 - gold * .17), .29, right * .56, left * .24, gold * .5, gold * .9];
    for (let row = 0; row < height; row++) {
      const y = row * 476 / (height - 1) + lift;
      let red = 255, green = 255, blue = 255;
      for (let layer = 0; layer < lightColors.length; layer++) {
        const alpha = gaussian((y - centers[layer]) / (radii[layer] * spread)) * strengths[layer] * entrance * fade;
        red += (lightColors[layer][0] - red) * alpha;
        green += (lightColors[layer][1] - green) * alpha;
        blue += (lightColors[layer][2] - blue) * alpha;
      }
      const pixel = (row * width + column) * 4;
      pixels[pixel] = red; pixels[pixel + 1] = green; pixels[pixel + 2] = blue; pixels[pixel + 3] = 255;
    }
  }
  field.context.putImageData(field.pixels, 0, 0);
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = "high";
  context.drawImage(field.canvas, 0, 0, canvas.width, canvas.height);
  context.setTransform(canvas.width / 456, 0, 0, canvas.height / 476, 0, 0);
  context.fillStyle = "#fffdf3";
  for (let particle = 0; particle < 154; particle++) {
    const seed = random(particle + 17), life = (t * 3.4 + seed) % 1;
    const x = random(particle * 3 + 107) * 456 + Math.sin(seconds * 1.3 + seed * 6.28) * 7;
    const y = 500 - life * (58 + random(particle + 211) * 52) * spread - lift;
    const alpha = Math.pow(Math.sin(life * Math.PI), 1.5) * entrance * fade * (.4 + random(particle + 311) * .6);
    context.globalAlpha = alpha;
    context.beginPath(); context.arc(x, y, .5 + random(particle + 411) * .8, 0, Math.PI * 2); context.fill();
  }
  context.globalAlpha = 1;
  canvas.dataset.lightTime = progress.toFixed(5);
}

export function MoneyTransfer({ amount = 100000, recipient = "Müller Logistik GmbH", account = "Grain USD account", exchangeRate = .92, duration = 4.8, glowStrength = 1, cardWidth = 456, paused = false, replayKey = 0 }: MoneyTransferProps) {
  const [phase, setPhase] = useState<"confirm" | "sending" | "verifying" | "settling" | "sent">("confirm");
  const [receipt, setReceipt] = useState(false);
  const [receiptTitle, setReceiptTitle] = useState(false);
  const [visible, setVisible] = useState(true);
  const inViewport = useRef(true);
  const host = useRef<HTMLDivElement>(null), content = useRef<HTMLDivElement>(null), light = useRef<HTMLCanvasElement>(null), status = useRef<HTMLDivElement>(null);
  const progress = useRef(0), currentPhase = useRef(phase), receiptRef = useRef(false), titleRef = useRef(false);
  const repaintLight = useRef<() => void>(() => {});
  const options = useRef({ duration });
  options.current = { duration };
  const busy = phase === "sending" || phase === "verifying" || phase === "settling";
  const reset = () => {
    progress.current = 0; currentPhase.current = "confirm"; receiptRef.current = titleRef.current = false;
    setPhase("confirm"); setReceipt(false); setReceiptTitle(false);
  };
  useEffect(reset, [replayKey]);
  useEffect(() => { if (light.current) light.current.dataset.renderer = "procedural"; }, []);
  useEffect(() => {
    const canvas = light.current!;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(box.width * ratio)), height = Math.max(1, Math.round(box.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; canvas.height = height;
        repaintLight.current();
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas); resize();
    window.addEventListener("resize", resize);
    return () => { observer.disconnect(); window.removeEventListener("resize", resize); };
  }, []);
  useEffect(() => {
    const sync = () => setVisible(inViewport.current && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inViewport.current = entry.isIntersecting; sync(); });
    observer.observe(host.current!);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  useEffect(() => {
    if (!busy) {
      if (content.current) { content.current.style.maskImage = ""; content.current.style.opacity = ""; }
      for (const part of Array.from(content.current?.children ?? [])) {
        (part as HTMLElement).style.opacity = "";
        (part as HTMLElement).style.filter = "";
      }
      return;
    }
    if (paused || !visible) return;
    let disposed = false, raf = 0, previous = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sharpParts = Array.from(content.current!.children) as HTMLElement[];
      function paintLight(t: number) {
        if (light.current) paintProceduralLight(light.current, t, reduced.matches);
      }
      repaintLight.current = () => paintLight(progress.current);
      function tick(now: number) {
        if (disposed) return;
        const seconds = Math.max(.4, Math.min(12, Number.isFinite(options.current.duration) ? options.current.duration : 4.8));
        if (previous) progress.current = Math.min(1, progress.current + Math.max(0, now - previous) / (seconds * 1000));
        previous = now;
        const t = progress.current;
        paintLight(t);
        const headerEnter = smooth(t / .055), bodyEnter = smooth((t - .025) / .09);
        for (let part = 0; part < sharpParts.length; part++) {
          const enter = part === 0 ? headerEnter : bodyEnter;
          // The entire receipt stays soft through the sweep. No spatial mask or cut line.
          const resolve = smooth((t - (part === 0 ? .91 : part === 2 ? .89 : .9)) / (part === 2 ? .095 : part === 0 ? .09 : .1));
          const blur = (part === 0 ? 8 : part === 1 ? 7 : 4.5) * enter * (1 - resolve);
          const ghost = part === 2 && t < .8 ? 1 - smooth((t - .1) / .15) : 1;
          sharpParts[part].style.filter = reduced.matches ? "none" : `blur(${blur.toFixed(2)}px)`;
          sharpParts[part].style.opacity = String((1 - enter * (part === 2 ? .15 : .68) * (1 - resolve)) * ghost);
        }
        if (status.current) status.current.style.opacity = String(Math.min(1, Math.max(0, (t - .065) / .08)) * Math.min(1, Math.max(0, (.925 - t) / .045)));
        if (t >= .8 && !receiptRef.current) { receiptRef.current = true; setReceipt(true); }
        if (t >= .94 && !titleRef.current) { titleRef.current = true; setReceiptTitle(true); }
        const next = t >= 1 ? "sent" : t >= .865 ? "settling" : t >= .49 ? "verifying" : "sending";
        if (next !== currentPhase.current) { currentPhase.current = next; setPhase(next); }
        if (t < 1) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    return () => { disposed = true; cancelAnimationFrame(raf); };
  }, [busy, paused, visible]);
  const sent = receiptTitle;
  const number = (value: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0);
  const receiptBody = <>
        <header className="nmt-header"><h3>{sent ? "Money sent" : "Confirm transfer"}</h3><p>{sent ? `Your payment to ${recipient} is complete` : "Review the payment details before sending"}</p></header>
        <div className="nmt-sheet"><p className="nmt-caption">{sent ? "Transfer sent" : "Transfer amount"}</p><div className="nmt-amount">{number(amount)} <span className="nmt-currency">USD</span><Flag /></div>
          <div className="nmt-row"><span>From</span><strong>{account}</strong></div><div className="nmt-row"><span>To</span><strong>{recipient}</strong></div><div className="nmt-row"><span>Exchange rate</span><strong>1 USD = {Number(exchangeRate).toFixed(4)} EUR</strong></div><div className="nmt-row"><span>Recipient receives</span><strong>€{number(amount * exchangeRate)} EUR</strong></div>
        </div>
        <div className="nmt-actions">{receipt ? <button className="nmt-button" onClick={reset}>Done</button> : <><button className="nmt-button nmt-secondary" onClick={reset}>Cancel</button><button className="nmt-button" onClick={() => setPhase("sending")}>Confirm &amp; Send</button></>}</div>
  </>;
  return <div ref={host} className="nmt-scene" data-running={!paused && visible} style={{ "--nmt-width": `${Math.max(280, Math.min(600, cardWidth))}px`, "--nmt-glow": Math.max(0, Math.min(1, glowStrength)) } as CSSProperties}>
    <style>{css}</style>
    <section className={`nmt-card${receipt ? " nmt-sent" : ""}`} data-phase={phase} data-busy={busy} data-receipt={receipt} aria-label="Money transfer confirmation" aria-busy={busy}>
      <button className="nmt-close" aria-label="Reset transfer" onClick={reset}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m3 3 8 8m0-8-8 8" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg></button>
      <div ref={content} className="nmt-content" inert={busy}>{receiptBody}</div>
      <canvas ref={light} width={456} height={476} className="nmt-light" aria-hidden="true" />
      {busy && <div ref={status} className="nmt-busy" style={{ opacity: 0 }}><div className="nmt-status" role="status" aria-live="polite"><span className="nmt-spinner" aria-hidden="true" /><span className="nmt-status-text">{phase === "sending" ? "Transferring money…" : "Verifying recipient…"}</span></div></div>}
    </section>
  </div>;
}

export default MoneyTransfer;
