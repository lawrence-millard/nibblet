export type GlyphValue = string | number | boolean;
export type GlyphSettings = Record<string, GlyphValue>;
export type GlyphKnob = {
  key: string; label: string; group: string;
  type: "text" | "float" | "toggle" | "select" | "color";
  def: GlyphValue; min?: number; max?: number; step?: number;
  dark?: string; need?: string; options?: [string, string][];
};
export const DEFAULTS: GlyphSettings;
export const KNOBS: GlyphKnob[];
export type GlyphInstance = {
  readonly dark: boolean;
  values(): GlyphSettings;
  set(values: GlyphSettings): void;
  dispose(): void;
  debug: {
    readonly pending: boolean;
    readonly time: number;
    freeze(value: boolean): void;
    reset(): void;
    step(seconds: number): void;
    pointer(x: number, y: number): void;
    cells(): { grid: number[]; data: Uint8Array };
  };
};
export function createGlyphBlue(container: HTMLElement, values?: GlyphSettings, options?: { maxDpr?: number; preserve?: boolean }): GlyphInstance;
