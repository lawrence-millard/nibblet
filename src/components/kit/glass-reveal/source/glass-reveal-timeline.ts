// Spring timeline from the user's GlassIconReveal adaptation (upstream MIT).
export const GLASS_END = 3.5;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const smoother = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * t * (t * (t * 6 - 15) + 10); };
const rgb = (color: string) => (color.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number).map(value => value / 255);
function spring(t: number, response: number) {
  if (t <= 0) return 0;
  const w = 2 * Math.PI / response;
  return 1 - Math.exp(-w * t) * (1 + w * t);
}
function reach(level: number) {
  let lo = 0, hi = 3;
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (spring(mid, .42) < level) lo = mid; else hi = mid; }
  return hi - .01;
}
const landing = reach(.85), spreading = reach(.92);

export function glassFrame(time: number, background: string, foreground: string, dark: boolean) {
  const T = Math.min(time, GLASS_END), tx = 2.4;
  const grow = spring(T + .01, .42);
  const morph = spring(T - spreading, .4);
  const drop = 1 - smooth(.05, 1, morph);
  const zoom = .25 * spring(T, .7) + .75 * smoother(0, 2.3, T);
  const settle = spring(T - .5, 2.4);
  const release = spring(T - tx - .05, .65);
  const view = (1 + ((dark ? 1.6 : 2.6) - 1) * (1 - zoom)) * (1 - .045 * settle);
  const band = mix(dark ? .22 : .14, .4, drop);
  const scale = mix(.2, 1, grow) * (1 + (dark ? .05 : .12) * spring(T - .3, 2.2)) * (1 + .14 * release);
  const bleed = dark ? .45 : 1.25;
  return {
    uPlateScale: scale, uShapeN: mix(2, dark ? 5 : 4.8, morph), uCornerN: dark ? 5 : 4.8,
    uOptics: 1 - smooth(.55, 1, release), uPlateAlpha: smooth(0, .08, T) * (1 - smooth(.45, 1, release)),
    uLogoHalf: .9 * view, uLogoOff: [0, 0], uBold: .015 * (1 - zoom),
    uBlur: .05 * (1 - smooth(.3, .95, grow)), uFrost: 1 - smooth(.5, .95, grow),
    uDome: .15 * (1 - smooth(.4, .95, grow)), uDrop: drop, uPinch: 0, uTilt: dark ? 0 : .35,
    uRim: 1 + .8 * drop, uHalo: dark ? .5 + .5 * drop : 0,
    uShadow: dark ? 0 : smooth(.45, .8, grow) * (1 - smooth(0, .6, morph)),
    uGhost: smooth(0, .03, T) * (1 - smooth(.04, .08, T)), uRipR: 1 + .9 * Math.max(0, T - landing),
    uRipA: (dark ? .5 : 1) * smooth(landing, landing + .06, T) * Math.exp(-Math.max(0, T - landing) / .6),
    uBare: smooth(tx - .25, tx, T), uReach: band * scale, uCornerPull: dark ? 1.4 : 2.1,
    uStreak: dark ? 1.2 : 2.85, uWiden: dark ? 1.2 : 2.2, uSlab: .3 * (dark ? .75 : 1.1),
    uEtaSpread: .06, uFocus: dark ? .4 : .58, uFocusK: 1, uFocusSplit: .056 * bleed, uRimLine: .09,
    uCornerOn: smooth(.35, 1, morph), uDissolve: release, uGlow: .012 * bleed,
    uFaceDisp: .012 * (dark ? .9 : 1.7), uVivid: .85, uDepth: dark ? .75 : 1.1,
    uDisp: dark ? .9 : 1.7, uDouble: 1, uBevelW: band * (1 - release), uSpec: 1,
    uIconPlate: 0, uUseColor: 0, uLightScene: dark ? 0 : 1,
    uSheen: 1, uSweep: mix(-1.6, 1.6, smoother(.9, tx - .1, T)), uLightAng: .9 * smoother(.4, tx + .4, T),
    uBg: rgb(background), uPlateCol: rgb(background), uLogoCol: rgb(foreground),
  };
}
