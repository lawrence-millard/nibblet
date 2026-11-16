"use client";

// Self-contained GlassReveal: component and styles. Requires React.
import * as React from "react";

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/components/catalog/glass-reveal/glass-reveal-engine.js
var glass_reveal_engine_exports = {};
__export(glass_reveal_engine_exports, {
  createRenderer: () => createRenderer,
  loadLogo: () => loadLogo
});
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This image could not be read."));
    img.src = src;
  });
}
function fitToTexture(source, sw, sh) {
  const tmp = document.createElement("canvas");
  tmp.width = TEX;
  tmp.height = TEX;
  const tc = tmp.getContext("2d", { willReadFrequently: true });
  const s0 = Math.min(TEX / sw, TEX / sh);
  const dx0 = (TEX - sw * s0) / 2, dy0 = (TEX - sh * s0) / 2;
  tc.drawImage(source, dx0, dy0, sw * s0, sh * s0);
  const d = tc.getImageData(0, 0, TEX, TEX).data;
  let opaque = true;
  for (let i = 3; i < d.length; i += 4 * 97) {
    if (d[i] < 250) {
      opaque = false;
      break;
    }
  }
  const key = [d[0], d[1], d[2]];
  const keyAlpha = (r, g, b) => Math.min(1, Math.max(0, (Math.hypot(r - key[0], g - key[1], b - key[2]) / 441 - 0.08) / 0.2));
  let x0 = TEX, y0 = TEX, x1 = -1, y1 = -1;
  for (let y = 0; y < TEX; y++) {
    for (let x = 0; x < TEX; x++) {
      const i = (y * TEX + x) * 4;
      const a = opaque ? keyAlpha(d[i], d[i + 1], d[i + 2]) * 255 : d[i + 3];
      if (a > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) throw new Error("The image is empty. Use a logo with visible pixels.");
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
  const s = TEX * BOX / Math.max(bw, bh);
  const out = document.createElement("canvas");
  out.width = TEX;
  out.height = TEX;
  const oc = out.getContext("2d", { willReadFrequently: true });
  oc.imageSmoothingQuality = "high";
  const ox = TEX / 2 - (x0 + bw / 2 - dx0) * s;
  const oy = TEX / 2 - (y0 + bh / 2 - dy0) * s;
  oc.drawImage(source, ox, oy, sw * s0 * s, sh * s0 * s);
  if (opaque) {
    const im = oc.getImageData(0, 0, TEX, TEX), e = im.data;
    for (let i = 0; i < e.length; i += 4) e[i + 3] = Math.round(e[i + 3] * keyAlpha(e[i], e[i + 1], e[i + 2]));
    oc.putImageData(im, 0, 0);
  }
  return out;
}
function buildSdf(canvas) {
  const n = TEX * TEX;
  const alpha = canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, TEX, TEX).data;
  const INF = 1e20;
  const outer = new Float64Array(n), inner = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = alpha[i * 4 + 3] / 255;
    if (a >= 1) {
      outer[i] = 0;
      inner[i] = INF;
    } else if (a <= 0) {
      outer[i] = INF;
      inner[i] = 0;
    } else {
      const dd = 0.5 - a;
      outer[i] = dd > 0 ? dd * dd : 0;
      inner[i] = dd < 0 ? dd * dd : 0;
    }
  }
  const f = new Float64Array(TEX), z = new Float64Array(TEX + 1), v = new Uint16Array(TEX);
  edt(outer, f, v, z, INF);
  edt(inner, f, v, z, INF);
  const sdf = new Float32Array(n);
  for (let i = 0; i < n; i++) sdf[i] = (Math.sqrt(outer[i]) - Math.sqrt(inner[i])) / TEX;
  return sdf;
}
function edt(grid, f, v, z, INF) {
  for (let x = 0; x < TEX; x++) edt1d(grid, x, TEX, f, v, z, INF);
  for (let y = 0; y < TEX; y++) edt1d(grid, y * TEX, 1, f, v, z, INF);
}
function edt1d(grid, offset, stride, f, v, z, INF) {
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  f[0] = grid[offset];
  for (let q = 1, k = 0, s = 0; q < TEX; q++) {
    f[q] = grid[offset + q * stride];
    const q2 = q * q;
    do {
      const r = v[k];
      s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
    } while (s <= z[k] && --k > -1);
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  for (let q = 0, k = 0; q < TEX; q++) {
    while (z[k + 1] < q) k++;
    const r = v[k], qr = q - r;
    grid[offset + q * stride] = f[r] + qr * qr;
  }
}
function loadLogo(url) {
  if (!logoCache.has(url)) {
    const job = loadImage(url).then((img) => {
      const canvas = fitToTexture(img, img.naturalWidth || TEX, img.naturalHeight || TEX);
      return { canvas, sdf: buildSdf(canvas) };
    });
    logoCache.set(url, job);
    job.catch(() => logoCache.delete(url));
  }
  return logoCache.get(url);
}
function createRenderer(canvas, opts = {}) {
  const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: !!opts.preserve });
  if (!gl) return null;
  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(prog, i);
    U[info.name] = gl.getUniformLocation(prog, info.name);
  }
  const sdfTex = gl.createTexture();
  const colTex = gl.createTexture();
  gl.uniform1i(U.uSdf, 0);
  gl.uniform1i(U.uCol, 1);
  let hasLogo = false;
  function setLogo(logo) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sdfTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, TEX, TEX, 0, gl.RED, gl.FLOAT, logo.sdf);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, colTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, logo.canvas);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    hasLogo = true;
  }
  function render(fr, w, h, tilePx, cx = w / 2, cy = h / 2) {
    if (!hasLogo) return;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uCenter, cx, cy);
    gl.uniform1f(U.uTile, tilePx);
    gl.uniform1f(U.uTexSize, TEX);
    gl.uniform1f(U.uBoxFrac, BOX);
    for (const k of FRAME_KEYS) if (U[k]) gl.uniform1f(U[k], fr[k]);
    gl.uniform3fv(U.uBg, fr.uBg);
    gl.uniform3fv(U.uPlateCol, fr.uPlateCol);
    gl.uniform3fv(U.uLogoCol, fr.uLogoCol);
    gl.uniform2fv(U.uLogoOff, fr.uLogoOff);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function dispose() {
    const ext = gl.getExtension("WEBGL_lose_context");
    if (ext) ext.loseContext();
  }
  return { gl, setLogo, render, dispose };
}
var TEX, BOX, logoCache, VERT, FRAG, FRAME_KEYS;
var init_glass_reveal_engine = __esm({
  "src/components/catalog/glass-reveal/glass-reveal-engine.js"() {
    /*!
    MIT License
    
    Copyright (c) 2026 Zanwei Guo
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    TEX = 1024;
    BOX = 0.75;
    logoCache = /* @__PURE__ */ new Map();
    VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;
    FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uCenter;      // device px, GL coords
uniform float uTile;       // tile size, device px
uniform sampler2D uSdf;    // signed distance, texture units, + outside
uniform sampler2D uCol;    // premultiplied colour, mipmapped
uniform float uTexSize;
uniform float uBoxFrac;

uniform float uPlateScale; // plate size relative to the tile
uniform float uShapeN;     // superellipse exponent: 2 = circle
uniform float uCornerN;    // final exponent, used by the ghost
uniform float uOptics;     // 1 = full refraction, 0 = flat
uniform float uPlateAlpha; // 1 = glass shown, 0 = bare logo
uniform float uLogoHalf;   // logo half size in plate units (zoom included)
uniform vec2 uLogoOff;     // where the logo's centre sits, plate units (it scales about this point)
uniform float uBold;       // stroke swell, in logo half-size units
uniform float uBlur;       // edge softness, plate units
uniform float uFrost;      // milky lift inside a young bubble
uniform float uDome;       // lens bulge height
uniform float uDrop;       // 1 while the glass is still a round droplet, 0 once it has spread into the tile
uniform float uPinch;      // the tile face's stretch toward its corners (pincushion), at the rim
uniform float uTilt;       // how much more the rising diagonal's corners stretch than the other two (0–1)
uniform float uRim;
uniform float uHalo;
uniform float uShadow;
uniform float uGhost;
uniform float uRipR;       // ripple radius, plate sizes
uniform float uRipA;
uniform float uBare;       // 1 once the logo may show without glass (the ending)
uniform float uReach;      // the rim band's full width, plate units (the pull depth is sized by it)
uniform float uCornerPull; // how much harder the corners pull than the sides
uniform float uStreak;     // how far a corner smears content along the rim, in band widths
uniform float uWiden;      // how much wider the folding band grows toward the corners
uniform float uSlab;       // how far the slab stands above the logo below its rounded edge, plate units
uniform float uEtaSpread;  // index spread across the spectrum (red highest)
uniform float uFocus;      // how far in along the diagonal a corner focuses, plate units
uniform float uFocusK;     // how quickly the view slides back from the focus across the band
uniform float uFocusSplit; // how much further in red meets than violet, plate units
uniform float uRimLine;    // how far across the band the sight line takes to turn in to the focus
uniform float uCornerOn;   // 0 while the glass is a round droplet, 1 once it has spread into the tile
uniform float uDissolve;   // 0 → 1 as the glass lets go of the logo
uniform float uGlow;       // colour bleed in the rim, plate units on screen
uniform float uFaceDisp;   // lateral colour across the face: red/violet scale apart by ±this
uniform float uVivid;      // chroma lift of the dispersed light

uniform float uDepth;
uniform float uDisp;
uniform float uDouble;
uniform float uBevelW;
uniform float uSpec;
uniform float uIconPlate;
uniform float uUseColor;
uniform float uLightScene; // 1 = light backdrop, 0 = dark

uniform float uSheen;
uniform float uSweep;
uniform float uLightAng;
uniform vec3 uBg;
uniform vec3 uPlateCol;
uniform vec3 uLogoCol;

float px; // one device pixel in plate units
vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }

// aa: footprint of one screen pixel at q, plate units (one pixel where nothing bends the view).
vec4 logoAt(vec2 q, float blur, float aa) {
  float L = uLogoHalf;
  float k = 0.5 * uBoxFrac / L;                    // plate units -> texture units
  vec2 uv = vec2(0.5 + (q.x - uLogoOff.x) * k, 0.5 - (q.y - uLogoOff.y) * k);
  float d = texture(uSdf, uv).r / k;               // plate units
  float w = 0.75 * aa + blur;
  float a = 1.0 - smoothstep(-w, w, d - uBold * L);
  vec3 c = uLogoCol;
  if (uUseColor > 0.5) {
    float lod = log2(max(1.0, w * k * uTexSize));
    vec4 c0 = textureLod(uCol, uv, lod);
    vec4 c1 = textureLod(uCol, uv, lod + 3.0);
    vec4 c2 = textureLod(uCol, uv, 7.0);
    c = c2.rgb / max(c2.a, 1e-4);
    c = mix(c, c1.rgb / max(c1.a, 1e-4), smoothstep(0.0, 0.06, c1.a));
    c = mix(c, c0.rgb / max(c0.a, 1e-4), smoothstep(0.02, 0.3, c0.a));
  }
  return vec4(c, a);
}

// Superellipse field. Returns signed distance (plate units, − inside); g = 1 on the rim.
float shape(vec2 p, float scale, float n, out vec2 nOut, out float g, out vec2 dg) {
  vec2 pp = p / scale;
  vec2 a = max(abs(pp), vec2(1e-6));
  g = pow(pow(a.x, n) + pow(a.y, n), 1.0 / n);
  dg = sign(pp) * pow(a, vec2(n - 1.0)) * pow(max(g, 1e-6), 1.0 - n);
  float dgl = max(length(dg), 1e-6);
  nOut = dg / dgl;
  return (g - 1.0) / dgl * scale;
}

// Curvature radius (plate units) of the shape's contour through p.
float contourRadius(vec2 p, float scale, float n) {
  vec2 a = max(abs(p / scale), vec2(1e-4));
  vec2 a1 = pow(a, vec2(n - 1.0));
  vec2 a2 = pow(a, vec2(n - 2.0));
  float k = (n - 1.0) * (a2.x * a1.y * a1.y + a2.y * a1.x * a1.x) / pow(max(dot(a1, a1), 1e-30), 1.5);
  return scale / max(k, 1e-3);
}

// Where the glass at x = s / bwF across its rounded edge looks. The tile is a slab standing uSlab above
// the logo, its edge a quarter-round of radius bwF. A straight-down sight line meets the edge tilted by
// θ (sin θ = 1 − x), bends inward by θ − θr (Snell, index eta) and reaches the logo plane displaced by
// z·tan(θ − θr), z the height of the surface. So the outer rim looks deepest and the view eases back to
// the face across the edge: whatever lies within reach is drawn out to the rim, mirrored and compressed
// near it, and meets itself at the inner edge of the bevel, where a stroke near the rim melts into it.
// Rays from a curved stretch of rim converge on its centre of curvature R; they reach a little past it
// and no further. The young droplet's dome pulls every sample toward the middle.
vec2 refractSample(float x, float bwF, float eta, float R, vec2 dirOut, vec2 p, float dome, float offMul) {
  float u = clamp(1.0 - x, 0.0, 0.995);
  float th = asin(u), thr = asin(u / eta);
  float z = uSlab + bwF * sqrt(1.0 - u * u);
  float off = offMul * z * tan(th - thr);
  off = off / (1.0 + off / (6.0 * R));
  return p - (dirOut * off + p * dome) * uOptics;
}

float gauss(float x, float c, float w) { float d = (x - c) / w; return exp(-0.5 * d * d); }
float band(float x, float a, float b, float w) { return smoothstep(a - w, a, x) * (1.0 - smoothstep(b, b + w, x)); }

// Visible spectrum, red (0) to violet (1), weighted so a dark edge seen through the glass fringes
// gold → orange → red on one side and cyan → sky → blue → ultramarine on the other (solved over 12
// samples; red reaches into the yellows so warm fringes never read lime).
float bump(float x, float c, float w) { float d = (x - c) / w; return exp(-0.5 * d * d); }
vec3 spectrum(float x) {
  return vec3(bump(x, 0.34, 0.2) + 0.08 * bump(x, 0.93, 0.05), bump(x, 0.58, 0.1), bump(x, 0.8, 0.11));
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  px = 2.0 / uTile;
  vec2 p = (gl_FragCoord.xy - uCenter) * px;       // plate units, y up

  vec4 lg = logoAt(p, uBlur, px);
  vec3 plain = mix(uBg, lg.rgb, lg.a * uBare);

  vec2 nOut, dg; float g;
  float sd = shape(p, uPlateScale, uShapeN, nOut, g, dg);
  float s = -sd;
  float bw = max(uBevelW, 0.004) * uPlateScale;
  float x = clamp(s / bw, 0.0, 1.0);
  float R = contourRadius(p, uPlateScale, uShapeN);
  vec2 pq = p * p;
  float diag = 4.0 * pq.x * pq.y / max((pq.x + pq.y) * (pq.x + pq.y), 1e-6);   // 1 on the diagonals, 0 on the axes
  // The tile sits slightly tipped along its rising diagonal, so light crosses more glass at the lower-left
  // and upper-right corners: they stretch and pull harder than the other two (as in the reference).
  float tilt = mix(1.0 - uTilt, 1.0, smoothstep(-0.02, 0.02, p.x * p.y));
  float pinchPart = uPinch * min(g * g, 1.0) * diag * diag * tilt;
  float dome = uDome * (1.0 - min(g * g, 1.0)) + pinchPart;
  // Light through the rim bends mostly straight across it and a little toward the middle, so near a
  // corner the dark of the logo is drawn along both neighbouring edges.
  vec2 dirOut = normalize(mix(nOut, p / max(length(p), 1e-4), 0.2));
  // A rounded corner curves both ways, so it bends light harder than a straight side: the corners draw
  // content in from deep inside (the reference stretches the heads and the beam's end into them) while
  // the middles of the sides stay light. The extra pull fades out gradually along the two edges next to
  // a corner (it follows how diagonal the position is, not just the edge's direction), so what a corner
  // draws in wraps along them, about halfway to the middle of each side.
  float cornerness = max(smoothstep(0.1, 0.9, 4.0 * nOut.x * nOut.x * nOut.y * nOut.y), smoothstep(0.15, 0.75, diag));
  float offMul = 1.0 + 0.4 * max(uCornerPull - 1.0, 0.0) * tilt * cornerness * uCornerOn;
  // Around a corner the curved edge focuses: every sight line through it, along the arc and along the
  // stretches of edge next to it, meets at one point a little way in along the diagonal. The rim sees
  // that point itself and the view slides back to the face across the band, so whatever lies there (the
  // head, the end of the beam) is spread all round the corner and down both edges.
  vec2 focus = sign(p) * (pow(0.5, 1.0 / uShapeN) - uFocus * 0.70710678) * uPlateScale;
  float focusW = tilt * cornerness * uOptics * uCornerOn;
  // The folding band itself also widens toward those corners, so what the rim draws in from the logo
  // shows as a broad smear hugging the corner rather than a hairline, while along the straight sides it
  // stays as narrow as the bevel. It keeps its width while the glass lets go, so smears fade in place.
  // (Only once the droplet has spread into the tile: a round droplet has no corners.)
  float bwF = max(uReach, 0.004) * (1.0 + uWiden * tilt * cornerness * uCornerOn);
  float xf = clamp(s / bwF, 0.0, 1.0);
  // Footprint of one pixel after refraction (centre wavelength). Measured here, in uniform control flow,
  // so the logo is filtered wherever the glass compresses it instead of breaking into shards.
  vec2 qc = refractSample(xf, bwF, 1.5, R, dirOut, p, dome, offMul);
  float foot = max(max(length(dFdx(qc)), length(dFdy(qc))), 0.25 * px);

  // Backdrop: anticipation ghost, ripple, soft lift shadow and glow.
  vec3 bg = uBg;
  vec3 lift = mix(uBg + vec3(0.06), mix(uBg, vec3(1.0), 0.55), uLightScene);
  if (uGhost > 0.001) {
    vec2 gn, gdg; float gg;
    float gsd = shape(p, 1.0, uCornerN, gn, gg, gdg);
    bg = mix(bg, lift, uGhost * 0.12 * (1.0 - smoothstep(-0.16, 0.14, gsd)));
    bg *= 1.0 - uGhost * 0.03 * uLightScene * exp(-max(gsd, 0.0) / 0.12) * step(0.0, gsd);
  }
  float outside = max(sd, 0.0);
  if (uRipA > 0.001) {
    float d0 = (uRipR - 1.0) * uPlateScale;
    float rx = (sd - d0) / 0.022;
    float ring = exp(-rx * rx);
    bg += uRipA * ring * (0.04 * (0.55 + 0.45 * dot(nOut, normalize(vec2(-0.5, 0.8))))) * mix(0.5, 1.0, uLightScene);
    bg -= uRipA * 0.016 * uLightScene * exp(-(rx - 1.6) * (rx - 1.6));
  }
  // The droplet's soft shadow: about 3 % at its edge and still half that a droplet radius away.
  float shadowFall = max(sd, 0.0) / (0.9 * uPlateScale);
  bg *= 1.0 - uShadow * 0.03 * exp(-shadowFall * shadowFall) * step(0.0, sd);
  vec3 haloCol = mix(vec3(0.62, 0.69, 0.80), vec3(1.0), uLightScene);
  bg = mix(bg, haloCol, clamp(uHalo * (0.30 * exp(-outside / (0.025 * uPlateScale)) + 0.07 * exp(-outside / (0.12 * uPlateScale))), 0.0, 1.0) * step(0.0, sd));

  vec3 col = bg;
  float soft = px + uBlur * 0.8 + 0.06 * uDissolve * uPlateScale;
  if (sd < soft) {
    // Surface for lighting: a superellipse quarter (k = 2.6), flat towards the face and steep at the rim.
    float y1 = 1.0 - x;
    const float K = 2.6;
    float base1 = max(1.0 - pow(y1, K), 1e-4);
    float db = min(pow(y1, K - 1.0) * pow(base1, 1.0 / K - 1.0), 25.0);   // slope of the rim
    // Second, lower step just inside the first one: its slope draws the faint inner line.
    float s1 = bw * 0.62;
    float w2 = bw * 0.22;
    float t2 = clamp((s - s1) / w2, -1.0, 1.0);
    float dh2 = uDouble * bw * 0.16;
    float dd = dh2 * 0.5 * cos(t2 * 1.5707963) * 1.5707963 / w2 * step(abs(t2), 0.999);
    // Lens bulge across the whole face (the young bubble); shades the surface.
    vec2 gDome = -uDome * 2.0 * g * dg * step(g, 1.0);
    vec2 grad = -(db + dd) * nOut + gDome;         // height gradient

    vec3 back = mix(uBg, uPlateCol, uIconPlate);
    // Light bent this far also defocuses: blur grows with the refraction distance. On top of that, in
    // the rim band only, a soft glow of fixed size on screen, so colour bleeds smoothly where the fold
    // compresses the view (foot / px is how much it compresses here). It is capped: right at the edge
    // the compression runs past 20×, and an uncapped glow would reach strokes the rim does not see.
    float rblur = uBlur + 0.05 * length(qc - p) + min(uGlow * uOptics * (1.0 - xf) * foot / px, 0.04);

    // Colour. Each wavelength refracts by its own index, so the displacement, and with it the colour
    // split, grows with how strongly the edge bends the view and vanishes on the flat face: the logo
    // stays crisp while everything the edge draws in fans into colour. Red is made the most strongly bent,
    // which puts the warm line where a smear meets the rim and the broad cyan glow on its inner side, the
    // order in Apple's capture.
    // Around a corner, light also runs along the curved edge, so what the corner draws in is smeared
    // along the rim and wraps the corner. The samples spread along the edge in golden-ratio order, so
    // every colour covers the whole smear.
    float cornerW = smoothstep(0.1, 0.9, 4.0 * nOut.x * nOut.x * nOut.y * nOut.y);
    float streak = 0.35 * uStreak * bw * mix(0.15, 1.0, cornerW) * pow(1.0 - xf, 1.5) * uOptics;
    vec2 tangent = vec2(-nOut.y, nOut.x);
    vec3 acc = vec3(0.0), wsum = vec3(0.0);
    for (int i = 0; i < 20; i++) {
      float lam = (float(i) + 0.5) / 20.0;
      float c = uDisp * (1.0 - 2.0 * lam);   // + red … − violet
      vec2 along = tangent * (streak * 2.0 * (fract(float(i) * 0.618034 + 0.31) - 0.5));
      float cf = uDisp * (1.0 - 2.0 * lam) * (lam > 0.5 ? 1.0 : 0.5);
      vec2 sp = refractSample(xf, bwF, 1.5 + uEtaSpread * c, R, dirOut, p + along,
                              dome + pinchPart * 0.3 * c, offMul);
      // The corner's focus splits by colour too: red meets a little further in, so it stays on the
      // stroke a little longer across the band and the smear's inner side glows cyan. Right at the rim
      // the sight line grazes and first sees the edge itself; blue turns in to the focus sooner than red,
      // so where a smear meets the rim it ends in a thin warm line.
      vec2 focusL = focus - sign(p) * (0.70710678 * uFocusSplit * c * uPlateScale);
      float wFocus = pow(1.0 - xf, uFocusK) * smoothstep(0.0, uRimLine * (1.0 + 0.6 * c), xf);
      sp = mix(sp, mix(p + along, focusL, wFocus), focusW);
      // Across the face the glass is a gentle lens that spreads colour too: edges of the logo facing the
      // rim carry a thin warm line and edges facing the middle a cyan one, as measured on the reference's
      // stem. Red is also a little out of focus, which turns the cyan side into a soft glow.
      // (Only on the flat face: inside the edge band the refraction would magnify this small offset into
      // a broad bar of colour.)
      float faceOnly = smoothstep(0.7, 1.0, xf) * uOptics;
      sp *= 1.0 + uFaceDisp * cf * faceOnly;
      vec4 l = logoAt(sp, rblur + 0.12 * streak + uFaceDisp * 0.5 * max(c, 0.0) * faceOnly, foot);
      vec3 w = spectrum(lam);
      acc += mix(back, l.rgb, l.a) * w;
      wsum += w;
    }
    vec3 trans = acc / wsum;
    // Split light reads as colour, not grey: lift the chroma of whatever the dispersion separated
    // (neutral greys are untouched), so the cyan glow and the gold rim line are as vivid as in the
    // reference, where the cyan is brighter than the backdrop itself.
    float tl = dot(trans, vec3(0.2126, 0.7152, 0.0722));
    trans = clamp(tl + (trans - tl) * (1.0 + uVivid * uOptics), 0.0, 1.0);
    // A young droplet is milky; it clears as it grows. The haze only ever lightens: on a light backdrop
    // it brightens what is light behind it and leaves dark content dark (in the reference the magnified
    // logo stays navy in the milk); on a dark backdrop it lifts the dark and leaves a white logo white.
    float hazeLum = dot(trans, vec3(0.2126, 0.7152, 0.0722));
    float hazeGate = mix(1.0 - smoothstep(0.25, 0.75, hazeLum), smoothstep(0.25, 0.75, hazeLum), uLightScene);
    trans = mix(trans, lift, uFrost * 0.45 * hazeGate);

    // How much glass is left: shading and highlights thin out as the glass lets go, so it never
    // lingers as an empty outline.
    float glassAmt = pow(1.0 - uDissolve, 1.5);
    float lit = uSpec * glassAmt;
    vec3 rimCol = mix(vec3(0.80, 0.87, 0.97), vec3(1.0), uLightScene);

    // Light backdrop, fitted to luminance profiles measured across the reference capture's rim.
    // The thick rounded edge scatters the light of the surroundings, so it glows softly white over a
    // face that stays clear (diffuse light, the frosted look of thick glass):
    //  · the droplet, while round, glows in a broad band about a tenth of its radius wide, some 15
    //    levels above the backdrop, with a crisp bright line at the very edge;
    //  · the tile it spreads into keeps a quieter band, about 7 levels up, from just inside the edge
    //    to a tenth of the tile in, with a bright inner lip about 0.15 of the tile in;
    //  · at the very edge a hairline catches a soft overhead light: bright along the top and right,
    //    turning to a thin dark silhouette line down the left and along the bottom.
    // The glow lifts only what is light behind it, so dark content drawn into the rim keeps its colour.
    float sc = uPlateScale;
    float tLum = dot(trans, vec3(0.2126, 0.7152, 0.0722));
    float lightOnly = smoothstep(0.35, 0.85, tLum);
    float hw = smoothstep(-0.85, 0.5, dot(nOut, rot(vec2(0.5, 0.866), uLightAng)));
    float tileBand = band(s, 0.016 * sc, 0.075 * sc, 0.022 * sc);
    float dropBand = (1.0 - smoothstep(0.06 * sc, 0.13 * sc, s)) * smoothstep(0.0, 0.004 * sc, s);
    float glow = mix(0.32 * tileBand, 0.75 * dropBand, uDrop) * lightOnly;
    float edgeLine = gauss(s, 0.005 * sc, 0.0045 * sc);
    float lip = gauss(s, 0.15 * sc, 0.007 * sc) * uDouble * (1.0 - uDrop);
    vec3 lightGlass = mix(trans, vec3(1.0), glow * glassAmt);
    lightGlass += (0.075 * hw * edgeLine + 0.06 * (0.4 + 0.6 * hw) * lip) * lit;
    lightGlass *= 1.0 - 0.05 * (1.0 - hw) * edgeLine * glassAmt * (1.0 - uDrop);
    lightGlass = mix(lightGlass, vec3(1.0), 0.55 * uDrop * glassAmt * edgeLine);

    // Dark backdrop: a cool rim light that grows toward the steep edge, and a small key highlight.
    vec3 Nl = normalize(vec3(-grad, 1.0));
    float edge = 1.0 - Nl.z;
    vec2 ldir = rot(normalize(vec2(-0.62, 0.78)), uLightAng);
    float side = dot(nOut, ldir);
    float fres = pow(edge, 1.5);
    vec3 rim = rimCol * fres * (0.35 + 0.65 * max(side, -side * 0.8)) * uRim * 0.65;
    vec3 Hv = normalize(normalize(vec3(-0.45, 0.6, 0.66)) + vec3(0.0, 0.0, 1.0));
    float sp = pow(max(dot(Nl, Hv), 0.0), 140.0) * 0.8 * smoothstep(0.0, 0.25, y1);
    vec3 darkGlass = trans * (1.0 - 0.25 * fres) + (rim + vec3(sp)) * lit;

    // On the dark backdrop the droplet wears a soft bright rim; it thins away once the tile has formed.
    darkGlass = mix(darkGlass, rimCol, uDrop * 0.4 * uSpec * (1.0 - smoothstep(0.0, 0.1 * uPlateScale, s)));
    vec3 glass = mix(darkGlass, lightGlass, uLightScene);
    float sweepD = dot(p / uPlateScale, normalize(vec2(0.8, 0.6))) - uSweep;
    float sheen = uSheen * glassAmt * exp(-sweepD * sweepD / 0.03) * (0.55 + 0.45 * (1.0 - x));
    glass = mix(glass, vec3(1.0), sheen * mix(0.22, 0.42, uLightScene));

    // The edge starts soft and sharpens as the bubble condenses, and softens again as the glass
    // dissolves: blur and scale arrive and leave together.
    float cov = clamp(0.5 - sd / soft, 0.0, 1.0);
    col = mix(bg, glass, cov);
  }

  vec3 outc = mix(plain, col, uPlateAlpha);
  outc += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(outc, 1.0);
}`;
    FRAME_KEYS = [
      "uSheen",
      "uSweep",
      "uLightAng",
      "uPlateScale",
      "uShapeN",
      "uCornerN",
      "uOptics",
      "uPlateAlpha",
      "uLogoHalf",
      "uBold",
      "uBlur",
      "uFrost",
      "uDome",
      "uDrop",
      "uPinch",
      "uTilt",
      "uBare",
      "uReach",
      "uCornerPull",
      "uStreak",
      "uWiden",
      "uSlab",
      "uEtaSpread",
      "uFocus",
      "uFocusK",
      "uFocusSplit",
      "uRimLine",
      "uCornerOn",
      "uDissolve",
      "uGlow",
      "uFaceDisp",
      "uVivid",
      "uRim",
      "uHalo",
      "uShadow",
      "uGhost",
      "uRipR",
      "uRipA",
      "uDepth",
      "uDisp",
      "uDouble",
      "uBevelW",
      "uSpec",
      "uIconPlate",
      "uUseColor",
      "uLightScene"
    ];
  }
});

// src/components/catalog/glass-reveal/glass-reveal.tsx
import { useEffect, useRef } from "react";

// src/components/catalog/glass-reveal/glass-reveal-timeline.ts
var GLASS_END = 3.5;
var clamp = (x) => Math.max(0, Math.min(1, x));
var mix = (a, b, t) => a + (b - a) * t;
var smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
var smoother = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
var rgb = (color) => (color.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number).map((value) => value / 255);
function spring(t, response) {
  if (t <= 0) return 0;
  const w = 2 * Math.PI / response;
  return 1 - Math.exp(-w * t) * (1 + w * t);
}
function reach(level) {
  let lo = 0, hi = 3;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (spring(mid, 0.42) < level) lo = mid;
    else hi = mid;
  }
  return hi - 0.01;
}
var landing = reach(0.85);
var spreading = reach(0.92);
function glassFrame(time, background, foreground, dark) {
  const T = Math.min(time, GLASS_END), tx = 2.4;
  const grow = spring(T + 0.01, 0.42);
  const morph = spring(T - spreading, 0.4);
  const drop = 1 - smooth(0.05, 1, morph);
  const zoom = 0.25 * spring(T, 0.7) + 0.75 * smoother(0, 2.3, T);
  const settle = spring(T - 0.5, 2.4);
  const release = spring(T - tx - 0.05, 0.65);
  const view = (1 + ((dark ? 1.6 : 2.6) - 1) * (1 - zoom)) * (1 - 0.045 * settle);
  const band = mix(dark ? 0.22 : 0.14, 0.4, drop);
  const scale = mix(0.2, 1, grow) * (1 + (dark ? 0.05 : 0.12) * spring(T - 0.3, 2.2)) * (1 + 0.14 * release);
  const bleed = dark ? 0.45 : 1.25;
  return {
    uPlateScale: scale,
    uShapeN: mix(2, dark ? 5 : 4.8, morph),
    uCornerN: dark ? 5 : 4.8,
    uOptics: 1 - smooth(0.55, 1, release),
    uPlateAlpha: smooth(0, 0.08, T) * (1 - smooth(0.45, 1, release)),
    uLogoHalf: 0.9 * view,
    uLogoOff: [0, 0],
    uBold: 0.015 * (1 - zoom),
    uBlur: 0.05 * (1 - smooth(0.3, 0.95, grow)),
    uFrost: 1 - smooth(0.5, 0.95, grow),
    uDome: 0.15 * (1 - smooth(0.4, 0.95, grow)),
    uDrop: drop,
    uPinch: 0,
    uTilt: dark ? 0 : 0.35,
    uRim: 1 + 0.8 * drop,
    uHalo: dark ? 0.5 + 0.5 * drop : 0,
    uShadow: dark ? 0 : smooth(0.45, 0.8, grow) * (1 - smooth(0, 0.6, morph)),
    uGhost: smooth(0, 0.03, T) * (1 - smooth(0.04, 0.08, T)),
    uRipR: 1 + 0.9 * Math.max(0, T - landing),
    uRipA: (dark ? 0.5 : 1) * smooth(landing, landing + 0.06, T) * Math.exp(-Math.max(0, T - landing) / 0.6),
    uBare: smooth(tx - 0.25, tx, T),
    uReach: band * scale,
    uCornerPull: dark ? 1.4 : 2.1,
    uStreak: dark ? 1.2 : 2.85,
    uWiden: dark ? 1.2 : 2.2,
    uSlab: 0.3 * (dark ? 0.75 : 1.1),
    uEtaSpread: 0.06,
    uFocus: dark ? 0.4 : 0.58,
    uFocusK: 1,
    uFocusSplit: 0.056 * bleed,
    uRimLine: 0.09,
    uCornerOn: smooth(0.35, 1, morph),
    uDissolve: release,
    uGlow: 0.012 * bleed,
    uFaceDisp: 0.012 * (dark ? 0.9 : 1.7),
    uVivid: 0.85,
    uDepth: dark ? 0.75 : 1.1,
    uDisp: dark ? 0.9 : 1.7,
    uDouble: 1,
    uBevelW: band * (1 - release),
    uSpec: 1,
    uIconPlate: 0,
    uUseColor: 0,
    uLightScene: dark ? 0 : 1,
    uSheen: 1,
    uSweep: mix(-1.6, 1.6, smoother(0.9, tx - 0.1, T)),
    uLightAng: 0.9 * smoother(0.4, tx + 0.4, T),
    uBg: rgb(background),
    uPlateCol: rgb(background),
    uLogoCol: rgb(foreground)
  };
}

// src/components/catalog/glass-reveal/glass-reveal.module.css
var glass_reveal_default = {
  mark: "glass_reveal_mark",
  symbol: "glass_reveal_symbol"
};

// src/components/catalog/glass-reveal/default-logo.ts
var defaultLogo = "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="140 140 692 692"><title>Nibble</title><path fill="#151515" fill-rule="evenodd" clip-rule="evenodd" d="M476.85 166.525C445.528 170.131 418.648 192.546 409.468 222.7C406.22 233.369 405.295 244.753 406.155 255.85C407.244 269.9 412.756 282.176 421.299 293.25C439.065 316.28 466.308 328.944 495.55 325.428C518.311 322.692 538.038 310.198 551.65 292.002C556.244 285.861 560.226 279.184 562.7 271.896C566.531 260.608 566.846 248.049 565.41 236.3C560.102 192.891 520.365 161.515 476.85 166.525ZM249.9 217.551C245.534 217.827 241.191 218.712 237.15 220.41C234.064 221.706 231.177 223.471 228.65 225.669C208.024 243.605 221.66 272.833 224.879 294.95C225.783 301.16 225.768 307.417 226.366 313.65C227.333 323.708 230.222 333.562 234.838 342.55C244.49 361.341 264.505 379.249 285.321 384.2C296.315 386.815 307.65 385.577 318.75 387.382C333.384 389.762 347.749 395.57 362.792 394.4C367.231 394.055 371.636 393.062 375.7 391.22C378.664 389.876 381.425 388.089 383.836 385.9C404.238 367.376 389.722 337.799 386.89 315.35C386.141 309.412 386.308 303.459 385.939 297.5C385.325 287.58 382.781 278.117 377.876 269.45C366.435 249.233 347.434 233.682 324.7 228.216C314.07 225.661 303.131 226.309 292.4 224.476C278.285 222.065 264.422 216.635 249.9 217.551ZM714.85 217.593C702.408 218.44 690.563 222.749 678.3 224.69C667.382 226.417 656.348 225.807 645.58 228.65C621.789 234.931 600.337 253.519 590.765 276.25C587.922 283.001 586.513 290.208 586.061 297.5C585.656 304.04 585.823 310.544 584.879 317.05C582.083 336.333 571.897 357.533 581.18 376.55C583.544 381.392 587.132 385.578 591.6 388.597C594.705 390.696 598.181 392.211 601.8 393.168C606.827 394.499 612.08 394.76 617.251 394.4C629.927 393.517 641.984 389.062 654.5 387.187C665.536 385.534 676.753 386.746 687.65 383.96C710.535 378.109 731.6 357.374 740.263 335.75C743.092 328.687 744.906 321.223 745.633 313.65C746.239 307.345 746.223 301.026 747.15 294.747C749.986 275.537 760.068 254.397 750.82 235.45C748.447 230.59 744.841 226.391 740.35 223.369C737.243 221.278 733.767 219.771 730.15 218.818C725.171 217.508 719.971 217.244 714.85 217.593ZM239.7 406.241C195.6 409.943 162.416 448.706 166.307 493C169.133 525.177 191.809 553.128 222.7 562.532C232.579 565.54 243.007 566.506 253.3 566.005C269.061 565.236 281.813 559.716 294.1 550.039C315.807 532.941 328.031 507.227 325.727 479.4C323.765 455.693 311.209 434.86 292.4 420.65C286.179 415.95 279.406 411.866 272 409.336C261.706 405.819 250.464 405.338 239.7 406.241ZM714.85 406.266C701.482 407.512 689.739 412.903 679.15 420.992C655.402 439.134 642.534 467.252 646.795 497.25C649.934 519.35 662.276 538.393 680 551.651C686.224 556.307 692.999 560.332 700.4 562.8C711.969 566.656 724.93 566.905 736.929 565.25C780.756 559.206 811.621 518.143 805.14 474.3C798.547 429.706 758.846 402.164 714.85 406.266ZM351.05 577.957C339.827 579.325 329.06 583.033 317.9 584.752C306.527 586.504 294.949 585.204 283.737 588.2C259.872 594.577 238.279 616.926 230.35 639.979C228.356 645.776 227.031 651.801 226.411 657.9C225.718 664.703 225.761 671.528 224.69 678.3C221.65 697.514 211.646 719.063 221.825 737.8C224.579 742.871 228.723 747.09 233.75 749.926C237.371 751.969 241.37 753.275 245.464 753.95C250.827 754.834 256.311 754.655 261.683 753.95C272.361 752.549 282.632 749.109 293.25 747.382C304.655 745.528 315.981 746.231 327.25 743.126C345.555 738.083 360.863 726.625 372.059 711.45C376.477 705.462 380.298 698.97 382.699 691.9C386.939 679.41 385.281 667.222 387.187 654.5C390.108 635.003 400.51 613.146 390.147 594.15C387.393 589.1 383.26 584.901 378.25 582.074C374.827 580.142 371.062 578.867 367.2 578.165C361.873 577.197 356.407 577.304 351.05 577.957ZM606.05 577.958C601.902 578.581 597.839 579.839 594.15 581.852C588.964 584.681 584.681 588.964 581.852 594.15C571.289 613.514 582.432 636.237 585.052 656.2C586.089 664.106 585.551 672.098 586.585 680C587.828 689.502 591.256 698.304 596.42 706.35C608.452 725.095 626.62 739.172 648.55 744.073C659.187 746.451 670.145 745.794 680.85 747.745C695.892 750.486 711.025 756.507 726.536 753.95C730.461 753.303 734.299 752.077 737.8 750.175C743.025 747.337 747.337 743.025 750.175 737.8C760.53 718.738 750.038 696.815 747.15 677.253C746.077 669.983 746.265 662.622 745.289 655.35C743.9 645.014 740.472 634.972 735.25 625.945C725.102 608.4 705.98 592.134 685.95 587.631C674.764 585.116 663.221 586.371 651.95 584.398C636.804 581.747 621.658 575.612 606.05 577.958ZM475.15 646.739C452.893 649.786 433.691 662.164 420.349 680C415.693 686.225 411.668 692.998 409.201 700.4C405.34 711.983 405.093 724.941 406.753 736.95C412.783 780.593 453.555 811.411 497.25 805.205C542.063 798.84 569.852 759.017 565.734 714.85C564.488 701.484 559.097 689.738 551.008 679.15C532.954 655.516 505.021 642.65 475.15 646.739Z"/></svg>\n');

// src/components/catalog/glass-reveal/glass-reveal.tsx
function GlassReveal({ src = defaultLogo, size = 160, paused = false, interactive = true, appearance = "auto", replayKey = 0, label = "Animate the logo" } = {}) {
  const pauseRef = useRef(paused);
  pauseRef.current = paused;
  const update = useRef(() => {
  });
  useEffect(() => {
    update.current();
  }, [paused]);
  const ref = useRef(null);
  const replay = useRef(() => {
  });
  useEffect(() => {
    const button = ref.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let cleanup = () => {
    };
    if (reduced.matches) return;
    void Promise.resolve().then(() => (init_glass_reveal_engine(), glass_reveal_engine_exports)).then(async ({ createRenderer: createRenderer2, loadLogo: loadLogo2 }) => {
      if (disposed) return;
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      button.appendChild(canvas);
      let renderer = null;
      let raf = 0, time = 0, last = 0;
      let visible = false, playing = true, dirty = true, started = false, loaded = false;
      let background = "rgb(32, 32, 32)", foreground = "rgb(243, 243, 243)", dark = true;
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };
      const fallback = () => {
        stop();
        playing = false;
        canvas.hidden = true;
        button.dataset.glass = "fallback";
      };
      const colors = () => {
        let parent = button.parentElement;
        while (parent) {
          const color = getComputedStyle(parent).backgroundColor;
          if (color !== "transparent" && color !== "rgba(0, 0, 0, 0)") {
            background = color;
            break;
          }
          parent = parent.parentElement;
        }
        foreground = getComputedStyle(button).color;
        dark = appearance === "auto" ? document.documentElement.dataset.theme !== "light" : appearance === "dark";
        dirty = true;
        kick();
      };
      const tick = (now) => {
        raf = 0;
        if (disposed || !visible || document.hidden || reduced.matches || !loaded) return;
        const dt = Math.min(0.1, (now - last) / 1e3);
        last = now;
        if (playing && !pauseRef.current) {
          time = Math.min(GLASS_END, time + dt);
          dirty = true;
        }
        if (dirty && renderer) {
          const dpr = Math.min(devicePixelRatio || 1, 2);
          const size2 = Math.max(1, Math.round(button.clientWidth * dpr));
          if (canvas.width !== size2 || canvas.height !== size2) canvas.width = canvas.height = size2;
          renderer.render(glassFrame(time, background, foreground, dark), size2, size2, size2 / 1.35);
          canvas.hidden = false;
          button.dataset.glass = pauseRef.current ? "paused" : playing ? "playing" : "rest";
          dirty = false;
        }
        if (time >= GLASS_END) {
          playing = false;
          button.dataset.glass = "rest";
        }
        if (playing && !pauseRef.current) raf = requestAnimationFrame(tick);
      };
      function kick() {
        if (raf || disposed || !visible || document.hidden || reduced.matches || !loaded) return;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
      const play = () => {
        if (pauseRef.current || reduced.matches || !loaded || playing && started && time < GLASS_END) return;
        time = 0;
        playing = true;
        started = true;
        dirty = true;
        colors();
        kick();
      };
      const hover = (event) => {
        if (interactive && event.pointerType === "mouse") play();
      };
      const visibility = () => {
        if (document.hidden) stop();
        else kick();
      };
      const motion = () => {
        if (reduced.matches) fallback();
        else {
          time = GLASS_END;
          playing = false;
          dirty = true;
          kick();
        }
      };
      const lost = (event) => {
        event.preventDefault();
        fallback();
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          started = true;
          kick();
        } else stop();
      });
      const ro = new ResizeObserver(() => {
        dirty = true;
        kick();
      });
      const theme = new MutationObserver(colors);
      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        theme.disconnect();
        button.removeEventListener("pointerenter", hover);
        document.removeEventListener("visibilitychange", visibility);
        reduced.removeEventListener("change", motion);
        canvas.removeEventListener("webglcontextlost", lost);
        renderer?.dispose();
        canvas.remove();
        replay.current = () => {
        };
        update.current = () => {
        };
      };
      try {
        renderer = createRenderer2(canvas);
        if (!renderer) {
          fallback();
          return;
        }
        const logo = await loadLogo2(src);
        if (disposed) return;
        renderer.setLogo(logo);
        loaded = true;
        colors();
        io.observe(button);
        ro.observe(button);
        theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        button.addEventListener("pointerenter", hover);
        document.addEventListener("visibilitychange", visibility);
        reduced.addEventListener("change", motion);
        canvas.addEventListener("webglcontextlost", lost);
        replay.current = play;
        update.current = () => {
          dirty = true;
          kick();
        };
        if (reduced.matches) fallback();
      } catch {
        fallback();
      }
    }).catch(() => {
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [src, appearance, replayKey, interactive]);
  const Tag = interactive ? "button" : "div";
  return <Tag
    ref={ref}
    type={interactive ? "button" : void 0}
    className={glass_reveal_default.mark}
    style={{ width: size, height: size }}
    data-glass="loading"
    role={interactive ? void 0 : "img"}
    aria-label={label}
    onClick={interactive ? () => replay.current() : void 0}
  >
    <span className={glass_reveal_default.symbol} style={{ maskImage: `url(${JSON.stringify(src)})`, WebkitMaskImage: `url(${JSON.stringify(src)})` }} aria-hidden="true" />
  </Tag>;
}

// src/components/catalog/glass-reveal/Component.jsx
function GlassReveal2(props) {
  return <><style>{"/* src/components/catalog/glass-reveal/glass-reveal.module.css */\n.glass_reveal_mark {\n  position: relative;\n  display: inline-grid;\n  place-items: center;\n  isolation: isolate;\n  width: 100%;\n  height: 100%;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n  overflow: hidden;\n  border-radius: 12px;\n}\n.glass_reveal_mark canvas {\n  position: absolute;\n  inset: 0;\n  display: block;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.glass_reveal_mark canvas[hidden] {\n  display: none;\n}\n.glass_reveal_symbol {\n  width: 64%;\n  height: 64%;\n  background: currentColor;\n  mask-size: contain;\n  mask-position: center;\n  mask-repeat: no-repeat;\n  -webkit-mask-size: contain;\n  -webkit-mask-position: center;\n  -webkit-mask-repeat: no-repeat;\n}\n.glass_reveal_mark[data-glass=playing] .glass_reveal_symbol,\n.glass_reveal_mark[data-glass=rest] .glass_reveal_symbol,\n.glass_reveal_mark[data-glass=paused] .glass_reveal_symbol {\n  visibility: hidden;\n}\n.glass_reveal_mark[role=img] {\n  cursor: default;\n}\n.glass_reveal_mark:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 4px;\n}\n"}</style><GlassReveal {...props} /></>;
}
export {
  GlassReveal2 as GlassReveal
};
