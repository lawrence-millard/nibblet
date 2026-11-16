/**
 * <VerseText />: text that prints like a misregistered comic, then keeps glitching.
 * React only. The text stays real and selectable; reduced motion shows it printed.
 * Supplied by the publisher for Nibble Studio.
 */
'use client'

import { type CSSProperties, Fragment, type Ref, useEffect, useImperativeHandle, useRef, useState, useSyncExternalStore } from 'react'

function rng(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function mixSeed(a: number, b: number): number {
  let h = (Math.imul(a >>> 0, 0x9e3779b1) ^ (b >>> 0)) >>> 0
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b)
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
  return (h ^ (h >>> 16)) >>> 0
}
const FRAME_MS = 1000 / 24
const FLAT = ['violet', 'magenta', 'green', 'gold'] as const
const FLAT_LIGHT = [false, false, true, true] as const
type Point = [number, number]
interface Plates { c: Point; m: Point; y: Point }
interface Shard { points: Point[]; rim: Point[]; cx: number; cy: number; dx: number; dy: number; turn: number; color: number; streak: number }
interface Copy { dx: number; dy: number; color: number }
interface Look { key: boolean; plates: Plates | null; shards: Shard[] | null; copies: Copy[]; comb: Comb | null; noise: number }
interface Frame { ticks: number; look: Look }
interface WordPrint { start: number; frames: Frame[] }
interface Band { top: number; bottom: number; dx: number }
interface Tear extends Band { tick: number }
interface Schedule { words: WordPrint[]; tears: Tear[]; end: number }
interface BurstHit { index: number; look: Look }
interface BurstFrame { ticks: number; words: BurstHit[]; tear: Band | null; split: number }
interface Burst { start: number; kind: BurstKind; frames: BurstFrame[] }
type WordState = 'waiting' | 'printed' | Look
interface PageLook { words: WordState[]; tear: Band | null; split: number }
function draws(seed: number) {
  const random = rng(seed)
  return { random, between: (lo: number, hi: number) => lo + (hi - lo) * random(), int: (lo: number, hi: number) => lo + Math.floor(random() * (hi - lo + 1)), sign: () => random() < 0.5 ? -1 : 1, chance: (p: number) => random() < p }
}
type Draws = ReturnType<typeof draws>
function noiseSeed(seed: number): number { return (seed % 999_983) + 1 }

// Convex polygon cuts produce three to eight flat-coloured shards.
function polygonArea(points: Point[]): number {
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i] ?? [0, 0]
    const [x1, y1] = points[(i + 1) % points.length] ?? [0, 0]
    sum += x0 * y1 - x1 * y0
  }
  return Math.abs(sum) / 2
}
function centroid(points: Point[]): Point {
  let x = 0, y = 0
  for (const [px, py] of points) { x += px; y += py }
  return [x / points.length, y / points.length]
}
function tidy(points: Point[]): Point[] {
  return points.filter((p, i) => { const q = points[(i + 1) % points.length]; return !q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6 })
}
function split(polygon: Point[], a: Point, b: Point): [Point[], Point[]] {
  const side = (p: Point) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
  const left: Point[] = [], right: Point[] = []
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i], q = polygon[(i + 1) % polygon.length]
    if (!p || !q) continue
    const sp = side(p), sq = side(q)
    if (sp >= 0) left.push(p)
    if (sp <= 0) right.push(p)
    if ((sp > 0 && sq < 0) || (sp < 0 && sq > 0)) {
      const t = sp / (sp - sq)
      const cut: Point = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
      left.push(cut); right.push(cut)
    }
  }
  return [tidy(left), tidy(right)]
}
function onEdge(edge: number, t: number): Point {
  if (edge === 0) return [t * 100, 0]
  if (edge === 1) return [100, t * 100]
  if (edge === 2) return [t * 100, 100]
  return [0, t * 100]
}
function shatter(seed: number): Shard[] {
  const d = draws(seed)
  let pieces: Point[][] = [[[0, 0], [100, 0], [100, 100], [0, 100]]]
  const cuts = d.int(2, 3)
  for (let k = 0; k < 8 && (k < cuts || pieces.length < 3); k++) {
    const from = d.int(0, 3), to = (from + d.int(1, 3)) % 4
    const a = onEdge(from, d.between(0.1, 0.9)), b = onEdge(to, d.between(0.1, 0.9))
    const next: Point[][] = []
    for (const piece of pieces) {
      const [left, right] = split(piece, a, b)
      const whole = left.length >= 3 && right.length >= 3
      const thin = !whole || polygonArea(left) < 900 || polygonArea(right) < 900
      if (thin || next.length + 2 > 8) next.push(piece)
      else next.push(left, right)
    }
    pieces = next
  }
  for (let k = 0; k < 4 && pieces.length < 3; k++) {
    const biggest = pieces.reduce((best, piece) => polygonArea(piece) > polygonArea(best) ? piece : best)
    const [mx, my] = centroid(biggest), angle = d.between(0.35, 1.2) * d.sign()
    const halves = split(biggest, [mx - Math.cos(angle) * 10, my - Math.sin(angle) * 10], [mx + Math.cos(angle) * 10, my + Math.sin(angle) * 10])
    if (halves[0].length < 3 || halves[1].length < 3) continue
    pieces = [...pieces.filter(piece => piece !== biggest), ...halves]
  }
  return pieces.map(points => {
    const [cx, cy] = centroid(points)
    const pushX = ((cx - 50) / 50) * d.between(0.08, 0.3), pushY = ((cy - 50) / 50) * d.between(0.05, 0.2)
    return { points, rim: points.map(([x, y]): Point => [cx + (x - cx) * 1.16, cy + (y - cy) * 1.16]), cx, cy, dx: pushX, dy: pushY, turn: d.sign() * d.between(2, 13), color: d.int(0, FLAT.length - 1), streak: d.chance(0.35) ? (Math.atan2(pushY, pushX) * 180) / Math.PI : -1 }
  })
}
type Arrival = 'shards' | 'copies'
function platesAround(seed: number, reach: number): Plates {
  const angle = rng(seed)() * Math.PI * 2
  const at = (k: number): Point => {
    const t = angle + (k * Math.PI * 2) / 3, x = Math.cos(t), y = Math.sin(t) * 0.55, length = Math.hypot(x, y)
    return [(x / length) * reach, (y / length) * reach]
  }
  return { c: at(0), m: at(1), y: at(2) }
}
function copiesOf(d: Draws, count: number): Copy[] {
  return Array.from({ length: count }, () => ({ dx: d.sign() * d.between(0.1, 0.35), dy: (d.random() - 0.5) * 0.24, color: d.int(0, FLAT.length - 1) }))
}
type Tint = 'c' | 'm'
interface Strip { top: number; bottom: number; slip: number; tint: Tint | null }
interface Comb { slips: number[]; strips: Strip[] }
const COMB_TOP = -0.15, COMB_BOTTOM = 1.35
const COMB_BODY: [number, number] = [0.42, 0.95]
function inBody(strip: Strip): boolean { const middle = (strip.top + strip.bottom) / 2; return middle > COMB_BODY[0] && middle < COMB_BODY[1] }
function combOf(seed: number): Comb {
  const d = draws(seed)
  const slips = Array.from({ length: 3 }, () => d.sign() * d.between(0.03, 0.15))
  const strips: Strip[] = []
  for (let top = COMB_TOP; top < COMB_BOTTOM;) {
    const bottom = top + d.between(0.06, 0.1), slipped = strips.length % 2 === 1
    strips.push({ top, bottom, slip: slipped ? d.int(0, slips.length - 1) : -1, tint: null }); top = bottom
  }
  const tintable = strips.filter(strip => strip.slip >= 0 && inBody(strip))
  for (let k = d.int(1, 3); k > 0 && tintable.length > 0; k--) {
    const [strip] = tintable.splice(d.int(0, tintable.length - 1), 1)
    if (strip) strip.tint = d.chance(0.5) ? 'c' : 'm'
  }
  return { slips, strips }
}
function materialise(seed: number, kind: Arrival): Look {
  const d = draws(mixSeed(seed, 3))
  if (kind === 'shards') return { key: false, plates: null, shards: shatter(mixSeed(seed, 4)), copies: d.chance(0.5) ? copiesOf(d, 1) : [], comb: null, noise: noiseSeed(seed) }
  return { key: false, plates: platesAround(mixSeed(seed, 5), d.between(0.15, 0.4)), shards: null, copies: copiesOf(d, d.int(1, 2)), comb: combOf(mixSeed(seed, 6)), noise: noiseSeed(seed) }
}
function wordFrames(seed: number): Frame[] {
  const d = draws(seed), first: Arrival = d.chance(0.6) ? 'shards' : 'copies', other: Arrival = first === 'shards' ? 'copies' : 'shards'
  const kinds: Arrival[] = d.chance(0.45) ? [first, other] : [first]
  const frames: Frame[] = kinds.map((kind, k) => ({ ticks: 1, look: materialise(mixSeed(seed, k + 1), kind) }))
  const reach = d.between(0.12, 0.22), shares = d.chance(0.5) ? [1, 0.55, 0.25, 0.08] : [1, 0.42, 0.14], lines = mixSeed(seed, 9)
  for (const share of shares) frames.push({ ticks: 2, look: { key: true, plates: platesAround(lines, reach * share), shards: null, copies: [], comb: null, noise: 0 } })
  return frames
}
function pauseAfter(word: string): number {
  if (/(\.\.\.|\u2026)["')\]]?$/.test(word)) return 19
  if (/[.!?]["')\]]?$/.test(word)) return 10
  if (/[,;:]$/.test(word)) return 5
  return 0
}
function wordGap(roll: number): number { if (roll < 0.35) return 2; return roll < 0.75 ? 3 : 4 }
function printSchedule(words: string[], seed: number, startTick = 0): Schedule {
  const d = draws(mixSeed(seed, 1)); let tick = startTick, paired = false
  const prints = words.map((word, i) => {
    const frames = wordFrames(mixSeed(seed, i + 2)), start = tick, pause = pauseAfter(word), pair = pause === 0 && !paired && d.chance(0.08)
    paired = pair
    if (!pair) tick += wordGap(d.random()) + pause
    return { start, frames }
  })
  const end = prints.reduce((latest, word) => Math.max(latest, word.start + word.frames.reduce((sum, frame) => sum + frame.ticks, 0)), startTick)
  const tears: Tear[] = [], attempts = d.int(2, 4)
  for (let k = 0; k < attempts; k++) {
    const at = d.int(startTick + 4, Math.max(startTick + 4, end - 4))
    if (tears.some(tear => Math.abs(tear.tick - at) < 3)) continue
    const top = d.between(0, 78), bottom = Math.min(100, top + d.between(14, 34)), dx = d.sign() * d.between(0.2, 0.8)
    tears.push({ tick: at, top, bottom, dx })
    if (d.chance(0.35)) tears.push({ tick: at + 1, top, bottom, dx: -Math.sign(dx) * d.between(0.2, 0.8) })
  }
  tears.sort((a, b) => a.tick - b.tick)
  return { words: prints, tears, end }
}
const FIRST_BURST = Math.round(600 / FRAME_MS)
const BURST_GAP: [number, number] = [Math.round(1000 / FRAME_MS), Math.round(2500 / FRAME_MS)]
type BurstKind = 'flick' | 'medium' | 'stuck'
const BURST_TICKS: Record<BurstKind, [number, number]> = { flick: [1, 3], medium: [4, 6], stuck: [8, 14] }
function burstKind(roll: number): BurstKind { if (roll < 0.25) return 'stuck'; return roll < 0.55 ? 'medium' : 'flick' }
function burstHolds(d: Draws, kind: BurstKind): number[] {
  const [lo, hi] = BURST_TICKS[kind], holds: number[] = []
  for (let left = d.int(lo, hi); left > 0;) { const hold = Math.min(left, kind === 'stuck' ? 2 : d.int(1, 3)); holds.push(hold); left -= hold }
  return holds
}
function burstLook(seed: number, frame: number, last: boolean): Look {
  if (last) return { key: true, plates: platesAround(seed, 0.05), shards: null, copies: [], comb: null, noise: 0 }
  const d = draws(mixSeed(seed, frame + 11)), roll = d.random()
  if (roll < 0.4) return materialise(mixSeed(seed, frame + 21), 'shards')
  if (roll < 0.7) return materialise(mixSeed(seed, frame + 21), 'copies')
  return { key: true, plates: platesAround(mixSeed(seed, frame + 31), d.between(0.15, 0.3)), shards: null, copies: d.chance(0.5) ? copiesOf(d, 1) : [], comb: combOf(mixSeed(seed, frame + 51)), noise: noiseSeed(mixSeed(seed, frame + 41)) }
}
const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value))
function nudge(look: Look, seed: number): Look {
  const d = draws(seed), by = () => d.between(0.88, 1.12), move = ([x, y]: Point): Point => [x * by(), y * by()], plates = look.plates
  return { ...look, plates: plates ? { c: move(plates.c), m: move(plates.m), y: move(plates.y) } : null, shards: look.shards?.map(shard => ({ ...shard, dx: shard.dx * by(), dy: shard.dy * by(), turn: clamp(shard.turn * by(), -13, 13) })) ?? null, copies: look.copies.map(copy => ({ ...copy, dx: copy.dx * by(), dy: copy.dy * by() })), comb: look.comb ? { ...look.comb, slips: look.comb.slips.map(slip => Math.sign(slip) * clamp(Math.abs(slip) * by(), 0.03, 0.15)) } : null }
}
function burstFrom(seed: number, kind: BurstKind, wordCount: number, start: number, focus: number | null = null): Burst {
  const d = draws(seed), holds = burstHolds(d, kind), band = focus === null && d.chance(0.35)
  const top = d.between(0, 72), bottom = Math.min(100, top + d.between(18, 40)), first = focus ?? d.int(0, Math.max(0, wordCount - 1))
  const pair = (focus !== null || d.chance(0.4)) && first + 1 < wordCount, hits = pair ? [first, first + 1] : [first], stuck = kind === 'stuck'
  const slip = d.sign() * d.between(0.25, 0.7), held = d.chance(0.5) ? d.between(0.15, 0.35) : 0
  const frames = holds.map((ticks, f): BurstFrame => {
    if (band && stuck) return { ticks, words: [], tear: { top, bottom, dx: slip * d.between(0.9, 1.1) }, split: held ? held * d.between(0.9, 1.1) : 0 }
    if (band) return { ticks, words: [], tear: { top, bottom, dx: (f % 2 ? -1 : 1) * d.between(0.2, 0.8) }, split: f % 2 ? d.between(0.15, 0.35) : 0 }
    const settle = kind === 'medium' && holds.length > 1 && f === holds.length - 1
    return { ticks, words: hits.map(index => { const look = burstLook(mixSeed(seed, index), stuck ? 0 : f, settle); return { index, look: stuck && f > 0 ? nudge(look, mixSeed(seed, index * 97 + f)) : look } }), tear: null, split: 0 }
  })
  return { start, kind, frames }
}
function burstAt(seed: number, k: number, wordCount: number, previous: number): Burst {
  const d = draws(mixSeed(seed, 77 + k)), gap = k === 0 ? FIRST_BURST : d.int(...BURST_GAP)
  return burstFrom(mixSeed(seed, 1000 + k), burstKind(d.random()), wordCount, previous + gap)
}
function burstEnd(burst: Burst): number { return burst.start + burst.frames.reduce((sum, frame) => sum + frame.ticks, 0) }
function stateOf(print: WordPrint, tick: number): WordState {
  let age = tick - print.start
  if (age < 0) return 'waiting'
  for (const frame of print.frames) { if (age < frame.ticks) return frame.look; age -= frame.ticks }
  return 'printed'
}
function lookAt(schedule: Schedule, bursts: Burst[], tick: number): PageLook {
  const words: WordState[] = schedule.words.map(word => stateOf(word, tick)), torn = schedule.tears.find(tear => tear.tick === tick)
  let tear: Band | null = torn ? { top: torn.top, bottom: torn.bottom, dx: torn.dx } : null, splitBy = 0
  for (const burst of bursts) {
    let age = tick - burst.start
    if (age < 0) continue
    for (const frame of burst.frames) {
      if (age < frame.ticks) { for (const hit of frame.words) { if (words[hit.index] === 'printed') words[hit.index] = hit.look } if (frame.tear) tear = frame.tear; splitBy = frame.split; break }
      age -= frame.ticks
    }
  }
  return { words, tear, split: splitBy }
}
const timelines = new Map<string, Burst[]>()
function burstList(seed: number, wordCount: number, end: number, tick: number): Burst[] {
  const key = `${seed}|${wordCount}|${end}`; let list = timelines.get(key)
  if (!list) { if (timelines.size > 64) timelines.clear(); list = []; timelines.set(key, list) }
  for (let last = list.at(-1); !last || last.start <= tick; last = list.at(-1)) list.push(burstAt(seed, list.length, wordCount, last ? burstEnd(last) : end))
  return list
}
function startedBy(list: Burst[], tick: number): number {
  let lo = 0, hi = list.length
  while (lo < hi) { const mid = (lo + hi) >> 1; if ((list[mid]?.start ?? Number.POSITIVE_INFINITY) <= tick) lo = mid + 1; else hi = mid }
  return lo
}
function burstIn(bursts: Burst[], tick: number): Burst | null { return bursts[startedBy(bursts, tick) - 1] ?? null }
function burstOn(seed: number, wordCount: number, end: number, tick: number): Burst | null { return burstIn(burstList(seed, wordCount, end, tick), tick) }
interface Token { key: string; text: string; index: number; space: string }
function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  for (const match of text.matchAll(/(\S+)(\s*)/g)) tokens.push({ key: `${tokens.length}:${match[1] ?? ''}`, text: match[1] ?? '', index: tokens.length, space: match[2] ?? '' })
  return tokens
}
/** Amazing Fantasy #15's last caption (1962), as supplied by the publisher. */
const CAPTION = 'And a lean, silent figure slowly fades into the gathering darkness, aware at last that in this world, with great power there must also come... great responsibility!'
const PLATES = ['c', 'm', 'y'] as const
const PAD_X = 15, PAD_Y = 30
function toShardBox([x, y]: Point): string { return `${((x + PAD_X) / (100 + 2 * PAD_X)) * 100}% ${((y + PAD_Y) / (100 + 2 * PAD_Y)) * 100}%` }
function polygon(points: Point[]): string { return `polygon(${points.map(toShardBox).join(', ')})` }
interface Bit { key: string; kind: 'dot' | 'speck' | 'ink'; left: string; top: string; width: string; height: string; color: string }
const em = (value: number) => `${value.toFixed(3)}em`
const INK = { violet: 'var(--vt-paint-violet)', magenta: 'var(--vt-paint-magenta)', green: 'var(--vt-paint-green)', gold: 'var(--vt-paint-gold)', key: 'var(--vt-paint-key)', dot: 'var(--vt-paint-dot)' } as const
const flatInk = (index: number) => INK[FLAT[index] ?? 'violet']
function debris(seed: number, comb: Comb | null, ink: string): Bit[] {
  const random = rng(seed), between = (lo: number, hi: number) => lo + (hi - lo) * random(), bits: Bit[] = []
  const cx = between(-10, 110), cy = between(-70, 170), pitch = 0.12
  for (let row = -2; row <= 2; row++) for (let column = -3; column <= 3; column++) {
    if (random() < 0.42 || Math.hypot(column, row * 1.4) > 3.2) continue
    const ox = (column + (row % 2 ? 0.5 : 0)) * pitch, oy = row * pitch * 0.866, size = em(0.075 + random() * 0.03)
    bits.push({ key: `d${row}:${column}`, kind: 'dot', left: `calc(${cx}% + ${ox}em)`, top: `calc(${cy}% + ${oy}em)`, width: size, height: size, color: INK.dot })
  }
  for (let k = 0, n = 3 + Math.floor(random() * 4); k < n; k++) {
    const size = em(0.04 + random() * 0.04)
    bits.push({ key: `s${k}`, kind: 'speck', left: `${between(-25, 125)}%`, top: `${between(-80, 180)}%`, width: size, height: size, color: INK.gold })
  }
  if (!comb) return bits
  const torn = comb.strips.filter(strip => strip.slip >= 0 && strip.tint === null && inBody(strip))
  for (let k = 0, n = 1 + Math.floor(random() * 2); k < n; k++) {
    const [strip] = torn.splice(Math.floor(random() * torn.length), 1)
    if (!strip) break
    const slip = comb.slips[strip.slip] ?? 0, width = between(0.1, 0.3), away = between(0.04, 0.22)
    bits.push({ key: `t${k}`, kind: 'ink', left: slip > 0 ? `calc(100% + ${em(slip + away)})` : em(slip - away - width), top: em(strip.top), width: em(width), height: em(strip.bottom - strip.top), color: ink })
  }
  return bits
}
const COMB_REACH_Y = 0.75
interface CombLayer { key: string; slip: number; tint: Tint | null; mask: string }
function combLayers(comb: Comb): CombLayer[] {
  const at = (y: number) => em(y + COMB_REACH_Y)
  const groups = new Map<string, { slip: number; tint: Tint | null }>([['-1:', { slip: -1, tint: null }]])
  for (const strip of comb.strips) groups.set(`${strip.slip}:${strip.tint ?? ''}`, { slip: strip.slip, tint: strip.tint })
  return [...groups].map(([key, group]) => {
    const home = group.slip < 0 && group.tint === null, paint = (on: boolean) => on ? '#000' : 'transparent', stops = [`${paint(home)} 0 ${at(COMB_TOP)}`]
    for (const strip of comb.strips) stops.push(`${paint(strip.slip === group.slip && strip.tint === group.tint)} ${at(strip.top)} ${at(strip.bottom)}`)
    stops.push(`${paint(home)} ${at(comb.strips.at(-1)?.bottom ?? COMB_BOTTOM)} 100%`)
    return { key, slip: comb.slips[group.slip] ?? 0, tint: group.tint, mask: `linear-gradient(to bottom, ${stops.join(', ')})` }
  })
}
function Inks({ look, text, keyed }: { look: Look; text: string; keyed: boolean }) {
  const plates = look.plates
  return <>{keyed ? <span className="vt-key-ink">{text}</span> : null}{look.copies.map(copy => <span key={`${copy.dx}:${copy.dy}`} className="vt-copy" style={{ color: flatInk(copy.color), transform: `translate(${copy.dx}em, ${copy.dy}em)` }}>{text}</span>)}{plates ? PLATES.map(plate => <span key={plate} className="vt-plate" data-plate={plate} style={{ transform: `translate(${plates[plate][0]}em, ${plates[plate][1]}em)` }}>{text}</span>) : null}</>
}
function inkOf(look: Look): string { const copy = look.copies[0]; return look.key || !copy ? INK.key : flatInk(copy.color) }
function ShardPiece({ text, shard }: { text: string; shard: Shard }) {
  const move = `translate(${shard.dx}em, ${shard.dy}em) rotate(${shard.turn}deg)`, origin = toShardBox([shard.cx, shard.cy])
  return <><span className="vt-rim" style={{ clipPath: polygon(shard.rim), transform: move, transformOrigin: origin }} /><span className="vt-shard" data-color={FLAT[shard.color]} data-ink={FLAT_LIGHT[shard.color] ? 'dark' : 'light'} data-streak={shard.streak >= 0} style={{ clipPath: polygon(shard.points), transform: move, transformOrigin: origin, '--streak': `${shard.streak + 90}deg` } as CSSProperties}><span className="vt-shard-text">{text}</span></span></>
}
function PressWord({ text, state }: { text: string; state: WordState | undefined }) {
  if (state === undefined || state === 'printed') return <span className="vt-word">{text}</span>
  if (state === 'waiting') return <span className="vt-word" data-state="waiting">{text}</span>
  const look = state, comb = look.comb
  return <span className="vt-word" data-key={look.key && comb === null}>{text}<span className="vt-glitch" aria-hidden="true">
    {comb ? combLayers(comb).map(layer => <span key={layer.key} className="vt-comb" style={{ maskImage: layer.mask, transform: layer.slip ? `translateX(${em(layer.slip)})` : undefined }}><span className="vt-comb-body">{layer.tint ? <span className="vt-comb-ink" data-tint={layer.tint}>{text}</span> : <Inks look={look} text={text} keyed={look.key} />}</span></span>) : <Inks look={look} text={text} keyed={false} />}
    {look.shards ? <><span className="vt-gap" />{look.shards.map(shard => <ShardPiece key={`${shard.cx}:${shard.cy}`} text={text} shard={shard} />)}</> : null}
    {look.noise ? debris(look.noise, comb, inkOf(look)).map(bit => <span key={bit.key} className="vt-bit" data-kind={bit.kind} style={{ left: bit.left, top: bit.top, width: bit.width, height: bit.height, backgroundColor: bit.color }} />) : null}
  </span></span>
}
function Words({ tokens, states }: { tokens: Token[]; states: WordState[] | null }) {
  return tokens.map(token => <Fragment key={token.key}><PressWord text={token.text} state={states?.[token.index]} />{token.space}</Fragment>)
}
const prose = (className?: string) => className ? `vt-prose ${className}` : 'vt-prose'
function bandClip(band: Band): string { return `inset(${band.top}% -12% ${100 - band.bottom}% -12%)` }
function bandHole(band: Band): string { return `linear-gradient(to bottom, black 0 ${band.top}%, transparent ${band.top}% ${band.bottom}%, black ${band.bottom}% 100%)` }
function PressSheet({ tokens, page, className }: { tokens: Token[]; page: PageLook | null; className?: string }) {
  const states = page?.words ?? null, tear = page?.tear ?? null, splitBy = page?.split ?? 0
  const hole = tear ? { maskImage: bandHole(tear), WebkitMaskImage: bandHole(tear) } : undefined
  const plates = tear && splitBy > 0 ? platesAround(mixSeed(Math.round(tear.top * 1000), 3), splitBy) : null
  return <div className="vt-sheet"><p className={prose(className)} style={hole}><Words tokens={tokens} states={states} /></p>
    {tear && !plates ? <p className={prose(className)} data-copy="key" aria-hidden="true" style={{ clipPath: bandClip(tear), transform: `translateX(${tear.dx}em)` }}><Words tokens={tokens} states={states} /></p> : null}
    {tear && plates ? PLATES.map(plate => <p key={plate} className={prose(className)} data-copy="plate" data-plate={plate} aria-hidden="true" style={{ clipPath: bandClip(tear), transform: `translate(${tear.dx * 0.4 + plates[plate][0]}em, ${plates[plate][1]}em)` }}><Words tokens={tokens} states={states} /></p>) : null}
  </div>
}
export interface VerseTextHandle { replay(): void }
export interface VerseTextProps {
  text?: string
  seed?: number
  autoplay?: boolean
  idle?: boolean
  speed?: number
  tone?: 'light' | 'dark'
  className?: string
  style?: CSSProperties
  frame?: number
  ref?: Ref<VerseTextHandle>
}
const plans = new Map<string, { tokens: Token[]; schedule: Schedule }>()
function planFor(text: string, seed: number) {
  const key = `${seed}|${text}`; let plan = plans.get(key)
  if (!plan) { const tokens = tokenize(text); plan = { tokens, schedule: printSchedule(tokens.map(token => token.text), mixSeed(seed, 1), 1) }; if (plans.size > 32) plans.clear(); plans.set(key, plan) }
  return plan
}
function idleBurst(schedule: Schedule, seed: number, tick: number): Burst | null { return burstOn(mixSeed(seed, 1), schedule.words.length, schedule.end, tick) }
function moving(schedule: Schedule, burst: Burst | null, tick: number) { return tick <= schedule.end || (burst !== null && tick <= burstEnd(burst)) }
const REDUCED = '(prefers-reduced-motion: reduce)'
function subscribeToMotion(onChange: () => void) { const query = window.matchMedia(REDUCED); query.addEventListener('change', onChange); return () => query.removeEventListener('change', onChange) }
const readReduced = () => window.matchMedia(REDUCED).matches
const readFull = () => false
const subscribeToNothing = () => () => undefined
const readHydrated = () => true
const readNotHydrated = () => false
const MOST_PER_FRAME = 4
function VerseTextBody({ text = CAPTION, seed = 1610, autoplay = true, idle = true, speed = 1, tone = 'light', className, style, frame, ref }: VerseTextProps) {
  const reduced = useSyncExternalStore(subscribeToMotion, readReduced, readFull)
  const hydrated = useSyncExternalStore(subscribeToNothing, readHydrated, readNotHydrated)
  const { tokens, schedule } = planFor(text, seed)
  const [root, setRoot] = useState<HTMLDivElement | null>(null), [visible, setVisible] = useState(false), [tick, setTick] = useState<number | null>(null)
  const position = useRef(0)
  useImperativeHandle(ref, () => ({ replay() { position.current = 0; setTick(0) } }))
  useEffect(() => {
    if (!root) return
    const observer = new IntersectionObserver(entries => { const seen = entries.some(entry => entry.isIntersecting); setVisible(seen); if (seen && autoplay) setTick(current => current ?? 0) }, { threshold: 0.3 })
    observer.observe(root); return () => observer.disconnect()
  }, [root, autoplay])
  const controlled = frame !== undefined
  const running = !controlled && !reduced && visible && tick !== null && (idle || tick <= schedule.end)
  useEffect(() => {
    if (!running) return
    let last = 0, carry = 0, raf = 0
    const step = (now: number) => {
      if (last > 0) {
        carry += ((now - last) * speed) / FRAME_MS
        const whole = Math.min(Math.floor(carry), MOST_PER_FRAME)
        carry -= Math.floor(carry)
        for (let k = 0; k < whole; k++) {
          const next = position.current + 1, before = idle ? idleBurst(schedule, seed, position.current) : null, after = idle ? idleBurst(schedule, seed, next) : null
          position.current = next
          if (moving(schedule, before, next - 1) || moving(schedule, after, next)) setTick(next)
        }
        if (!idle && position.current > schedule.end) return
      }
      last = now; raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf)
  }, [running, speed, idle, schedule, seed])
  const at = controlled ? hydrated && frame >= 0 ? frame : null : reduced ? null : tick
  let page: PageLook | null = null
  if (at !== null) { const burst = idle ? idleBurst(schedule, seed, at) : null; page = lookAt(schedule, burst ? [burst] : [], at) }
  const waiting = controlled ? !hydrated || frame < 0 : !reduced && autoplay && tick === null
  return <div ref={setRoot} className={className ? `vt-root ${className}` : 'vt-root'} style={style} data-phase={waiting ? 'waiting' : 'live'} data-tone={tone}><PressSheet tokens={tokens} page={page} /></div>
}
/** React 19 hoists the stylesheet into head once per page. */
export function VerseText(props: VerseTextProps) { return <><style href="verse-text" precedence="default">{CSS}</style><VerseTextBody {...props} /></> }
const CSS = `
.vt-root { color: var(--vt-ink, oklch(0.2 0 0)); }
:where(.vt-root[data-tone='dark']) { --vt-ink: oklch(0.955 0 0); --vt-blend: screen; }
@media (scripting: enabled) { .vt-root[data-phase='waiting'] .vt-sheet { opacity: 0; animation: vt-reveal 0s 3s forwards; } }
@keyframes vt-reveal { to { opacity: 1; } }
.vt-sheet { position: relative; }
.vt-prose { margin: 0; font-weight: 400; line-height: var(--vt-leading, 1.62); letter-spacing: -0.006em; text-wrap: var(--vt-wrap, pretty); }
.vt-prose[data-copy] { position: absolute; inset: 0; pointer-events: none; user-select: none; }
.vt-prose[data-copy='plate'] { mix-blend-mode: var(--vt-blend, multiply); }
.vt-prose[data-copy='plate'] .vt-glitch { display: none; }
.vt-prose[data-plate='c'] { color: var(--vt-plate-c, oklch(0.76 0.15 222)); }
.vt-prose[data-plate='m'] { color: var(--vt-plate-m, oklch(0.6 0.26 355)); }
.vt-prose[data-plate='y'] { color: var(--vt-plate-y, oklch(0.93 0.19 104)); }
.vt-word {
  --vt-paint-violet: var(--vt-violet, oklch(0.48 0.29 272));
  --vt-paint-magenta: var(--vt-magenta, oklch(0.64 0.3 328));
  --vt-paint-green: var(--vt-green, oklch(0.72 0.25 145));
  --vt-paint-gold: var(--vt-gold, oklch(0.82 0.17 82));
  --vt-paint-key: var(--vt-key, oklch(0.12 0 0));
  --vt-paint-dot: var(--vt-dot-red, oklch(0.6 0.25 25));
  position: relative;
}
.vt-word[data-state='waiting'], .vt-word[data-key='false'] { color: transparent; }
.vt-glitch { position: absolute; inset: 0; pointer-events: none; user-select: none; }
.vt-copy, .vt-plate, .vt-key-ink, .vt-comb-ink, .vt-shard-text { position: absolute; inset: 0; display: flex; align-items: center; white-space: pre; }
.vt-copy, .vt-plate { mix-blend-mode: var(--vt-blend, multiply); }
.vt-plate[data-plate='c'] { color: var(--vt-plate-c, oklch(0.76 0.15 222)); }
.vt-plate[data-plate='m'] { color: var(--vt-plate-m, oklch(0.6 0.26 355)); }
.vt-plate[data-plate='y'] { color: var(--vt-plate-y, oklch(0.93 0.19 104)); }
.vt-comb { position: absolute; inset: -0.75em -1em; }
.vt-comb-body { position: absolute; inset: 0.75em 1em; }
.vt-key-ink { color: var(--vt-ink, oklch(0.2 0 0)); }
.vt-comb-ink { mix-blend-mode: var(--vt-blend, multiply); }
.vt-comb-ink[data-tint='c'] { color: var(--vt-plate-c, oklch(0.76 0.15 222)); }
.vt-comb-ink[data-tint='m'] { color: var(--vt-plate-m, oklch(0.6 0.26 355)); }
.vt-gap { position: absolute; inset: 0; background-color: var(--vt-key, oklch(0.12 0 0)); }
.vt-rim, .vt-shard { position: absolute; inset: -30% -15%; }
.vt-rim { background-color: var(--vt-key, oklch(0.12 0 0)); }
.vt-shard { background-color: var(--vt-shard); }
.vt-shard[data-color='violet'] { --vt-shard: var(--vt-violet, oklch(0.48 0.29 272)); }
.vt-shard[data-color='magenta'] { --vt-shard: var(--vt-magenta, oklch(0.64 0.3 328)); }
.vt-shard[data-color='green'] { --vt-shard: var(--vt-green, oklch(0.72 0.25 145)); }
.vt-shard[data-color='gold'] { --vt-shard: var(--vt-gold, oklch(0.82 0.17 82)); }
.vt-shard[data-streak='true'] { background-image: repeating-linear-gradient(var(--streak), transparent 0 0.05em, color-mix(in oklab, var(--vt-shard), black 28%) 0.05em 0.085em); }
.vt-shard-text { inset: 18.75% 11.538%; }
.vt-shard[data-ink='light'] .vt-shard-text { color: oklch(0.99 0 0); }
.vt-shard[data-ink='dark'] .vt-shard-text { color: var(--vt-key, oklch(0.12 0 0)); }
.vt-bit { position: absolute; }
.vt-bit[data-kind='dot'], .vt-bit[data-kind='speck'] { border-radius: 50%; }
@media (prefers-reduced-motion: reduce) { .vt-root[data-phase='waiting'] .vt-sheet { opacity: 1; animation: none; } }
`
