import type { ComponentType, CSSProperties } from "react";

export type ShoalProps = {
  count?: number;
  seed?: number;
  appearance?: "auto" | "dark" | "light";
  height?: number | string;
  paused?: boolean;
  settings?: Record<string, string | number | boolean>;
  style?: CSSProperties;
};

export declare const Shoal: ComponentType<ShoalProps>;
