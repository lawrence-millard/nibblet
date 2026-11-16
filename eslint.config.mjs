import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendor registry installs (Unlumen / shadcn demos) — lint upstream patterns separately
    "src/components/unlumen-ui/**",
    "src/components/demo/**",
    "src/hooks/use-auto-height.tsx",
    "src/hooks/use-controlled-state.tsx",
    "src/hooks/use-data-state.tsx",
    "src/hooks/use-is-in-view.tsx",
    "src/hooks/use-motion-value-state.tsx",
    "scripts/**",
  ]),
]);

export default eslintConfig;
