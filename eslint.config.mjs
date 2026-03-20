import storybook from "eslint-plugin-storybook"

import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "storybook-static/**",
    "node_modules/**",
    "coverage/**",
    "*.config.*",
    "next-env.d.ts",
  ]),
  {
    ignores: ["components/ui/**/*.tsx"],
  },
  ...storybook.configs["flat/recommended"],
])

export default eslintConfig
