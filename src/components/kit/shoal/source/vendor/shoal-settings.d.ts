import type { ShoalValues } from "./shoal-engine.js";

export type ShoalKnob = {
  key: string;
  label: string;
  group: string;
  type: "float" | "toggle" | "color" | "text" | "select";
  def: string | number | boolean;
  dark?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: [string, string][];
  show?: { key: string; value: string | string[] };
};
export const DEFAULTS: ShoalValues;
export const KNOBS: ShoalKnob[];
export const PALETTES: { on: ShoalValues; off: ShoalValues };
export const TWINS: string[];
