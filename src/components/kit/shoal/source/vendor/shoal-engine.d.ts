export type ShoalValues = Record<string, string | number | boolean>;
export type ShoalInstance = {
  set(values: ShoalValues): void;
  dispose(): void;
  debug: { freeze(frozen: boolean): void; render(): void };
};
export const DEFAULTS: ShoalValues;
export function createShoal(
  element: HTMLElement,
  values: ShoalValues,
  options: { maxDpr?: number; onReady?: () => void },
): ShoalInstance;
