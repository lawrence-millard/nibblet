"use client";
// submitted:component
import { useEffect, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var fragment = "precision highp float;\r\nuniform vec2 u_size;\r\nuniform float u_time;\r\nuniform float u_mode;\r\nuniform float u_scale;\r\nuniform float u_warp;\r\nuniform float u_contrast;\r\nuniform float u_bands;\r\nuniform float u_rotation;\r\nuniform float u_lift;\r\nuniform float u_softness;\r\nuniform float u_grain;\r\nuniform float u_vignette;\r\nuniform float u_seed;\r\nuniform float u_animate;\r\nuniform float u_aSpeed;\r\nuniform float u_aAmount;\r\nuniform float u_aWaves;\r\nuniform vec4 u_color1;\r\nuniform vec4 u_color2;\r\nuniform vec4 u_color3;\r\nuniform vec4 u_color4;\r\nuniform vec4 u_color5;\r\nvec2 wp_hash2(vec2 p) {\r\n  vec2 q = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));\r\n  return fract(sin(q) * 43758.5453) * 2.0 - 1.0;\r\n}\r\n\r\nfloat wp_hash1(vec2 p) {\r\n  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);\r\n}\r\n\r\n\r\nfloat wp_noise(vec2 p) {\r\n  vec2 i = floor(p);\r\n  vec2 f = fract(p);\r\n  vec2 u2 = f * f * (3.0 - 2.0 * f);\r\n  return mix(\r\n    mix(dot(wp_hash2(i), f),\r\n        dot(wp_hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u2.x),\r\n    mix(dot(wp_hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),\r\n        dot(wp_hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u2.x),\r\n    u2.y);\r\n}\r\n\r\n\r\nfloat wp_fbm(vec2 p0) {\r\n  vec2 p = p0;\r\n  float a = 0.6;\r\n  float s = 0.0;\r\n  for (int i = 0; i < 3; i++) {\r\n    s = s + a * wp_noise(p);\r\n    p = p * 2.1;\r\n    a = a * 0.42;\r\n  }\r\n  return s;\r\n}\r\n\r\n\r\nvec3 wp_pal(float t0) {\r\n  float t = clamp(t0, 0.0, 1.0);\r\n  vec3 c = mix(u_color1.rgb, u_color2.rgb, smoothstep(0.00, 0.46, t));\r\n  c = mix(c, u_color3.rgb, smoothstep(0.44, 0.76, t));\r\n  c = mix(c, u_color4.rgb, smoothstep(0.74, 0.93, t));\r\n  c = mix(c, u_color5.rgb, smoothstep(0.92, 1.00, t));\r\n  return c;\r\n}\r\n\r\nvec4 wallpaperMain(vec2 uv01) {\r\n  vec2 res = max(u_size, vec2(1.0));\r\n  \r\n  vec2 fc = vec2(uv01.x * res.x, res.y - uv01.y * res.y);\r\n  vec2 uv = (fc - 0.5 * res) / res.y;\r\n\r\n  \r\n  float soft = clamp(u_softness, 0.0, 1.0);\r\n  float sc = u_scale * (1.05 - soft * 0.55);\r\n  float wa = u_warp * (0.35 + soft * 0.7);\r\n  float th = radians(u_rotation);\r\n  \r\n  \r\n  \r\n  vec2 uvw = uv;\r\n  if (u_animate > 0.5) {\r\n    float ts = u_time * u_aSpeed;\r\n    uvw = uvw + u_aAmount * vec2(sin(ts + uv.y * u_aWaves),\r\n                                      cos(ts * 0.77 + uv.x * u_aWaves));\r\n  }\r\n  vec2 p = vec2(cos(th) * uvw.x + sin(th) * uvw.y,\r\n                    -sin(th) * uvw.x + cos(th) * uvw.y) * sc + vec2(u_seed);\r\n\r\n  vec2 q = vec2(wp_fbm(p), wp_fbm(p + vec2(3.7, 1.3)));\r\n  vec2 r = vec2(wp_fbm(p + wa * q + vec2(1.7, 9.2)),\r\n                    wp_fbm(p + wa * q + vec2(8.3, 2.8)));\r\n  float f = wp_fbm(p + wa * r);\r\n\r\n  float t;\r\n  if (u_mode < 0.5) {\r\n    \r\n    t = 0.46 + f * u_contrast * 1.9;\r\n    float k = t - 0.78;\r\n    if (k > 0.0) { t = 0.78 + k / (1.0 + k * 1.6); }\r\n    t = pow(clamp(t, 0.0, 1.0), 1.35);\r\n  } else {\r\n    \r\n    t = 0.5 + 0.5 * sin(f * 6.2831 * u_bands * 1.7 + u_seed * 2.0);\r\n    t = pow(clamp(t, 0.0, 1.0), u_contrast);\r\n    float k = t - 0.72;\r\n    if (k > 0.0) { t = 0.72 + k / (1.0 + k * 0.6); }\r\n  }\r\n\r\n  vec3 col = wp_pal(t + u_lift);\r\n\r\n  \r\n  float d = length(uv * vec2(0.78, 0.52));\r\n  col = col * mix(1.0, 1.0 - smoothstep(0.1, 1.25, d), clamp(u_vignette, 0.0, 1.0));\r\n\r\n  \r\n  \r\n  float gs = 1500.0 / res.y;\r\n  float g = wp_hash1(floor(fc * gs) + u_seed * 37.0);\r\n  col = col + vec3((g - 0.5) * clamp(u_grain, 0.0, 1.0) * 0.34 * (0.22 + dot(col, vec3(0.333, 0.333, 0.333))));\r\n\r\n  return vec4(max(col, vec3(0.0)), 1.0);\r\n}\r\n\r\nvoid main(){ gl_FragColor=wallpaperMain(vec2(gl_FragCoord.x/u_size.x,1.0-gl_FragCoord.y/u_size.y)); }";
function Abyss({ height = 480, fullScreen = false, paused = false, scale = 1.15, warp = 2.6, seed = 27, contrast = 1.35, bands = 1, rotation = 20, lift = 0.04, softness = 0.5, grain = 0.5, vignette = 0.85, aSpeed = 1, aAmount = 0.05, aWaves = 6, colors = ["#04051A", "#08195E", "#1E5CFF", "#3FD8FF", "#EEF1F6"], style, className, children }) {
  const canvas = useRef(null);
  const palette = colors.join(",");
  useEffect(() => {
    const element = canvas.current;
    const gl = element.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    const shaders = [];
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, "attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}"));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name) => gl.getUniformLocation(program, "u_" + name);
    for (const [key, value] of Object.entries({ mode: 0, scale, warp, seed, contrast, bands, rotation, lift, softness, grain, vignette, aSpeed, aAmount, aWaves })) gl.uniform1f(uniform(key), value);
    palette.split(",").slice(0, 5).forEach((hex, i) => {
      const n = parseInt(hex.replace("#", ""), 16);
      gl.uniform4f(uniform("color" + (i + 1)), (n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255, 1);
    });
    const timeLocation = uniform("time"), sizeLocation = uniform("size"), animateLocation = uniform("animate");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, visible = true, elapsed = 0, previous = 0, disposed = false;
    function draw(now) {
      frame = 0;
      if (disposed || gl.isContextLost()) return;
      const moving = !paused && !reduced.matches && visible && !document.hidden;
      if (moving && previous) elapsed += Math.min((now - previous) / 1e3, 0.1);
      previous = moving ? now : 0;
      const rect = element.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(rect.width * ratio)), h = Math.max(1, Math.round(rect.height * ratio));
      if (element.width !== width || element.height !== h) {
        element.width = width;
        element.height = h;
      }
      gl.viewport(0, 0, width, h);
      gl.uniform2f(sizeLocation, width, h);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(animateLocation, reduced.matches ? 0 : 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (moving) frame = requestAnimationFrame(draw);
    }
    function refresh() {
      cancelAnimationFrame(frame);
      previous = 0;
      frame = requestAnimationFrame(draw);
    }
    const resize = new ResizeObserver(refresh);
    resize.observe(element);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      refresh();
    });
    intersection.observe(element);
    reduced.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    refresh();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      reduced.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
  }, [paused, scale, warp, seed, contrast, bands, rotation, lift, softness, grain, vignette, aSpeed, aAmount, aWaves, palette]);
  return /* @__PURE__ */ jsxs("div", { className, style: { position: fullScreen ? "fixed" : "relative", inset: fullScreen ? 0 : void 0, width: "100%", height: fullScreen ? "100%" : height, overflow: "hidden", background: "#04051A", ...style }, children: [
    /* @__PURE__ */ jsx("canvas", { ref: canvas, "aria-hidden": "true", style: { display: "block", width: "100%", height: "100%" } }),
    /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, pointerEvents: children ? "auto" : "none" }, children })
  ] });
}

// <stdin>
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function Component(props) {
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    /* @__PURE__ */ jsx2("style", { children: "" }),
    /* @__PURE__ */ jsx2(Abyss, { ...props })
  ] });
}
export {
  Component
};
