import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier/flat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwindcss from "eslint-plugin-tailwindcss";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  tailwindcss.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    settings: {
      tailwindcss: {
        cssConfigPath: "./app/globals.css",
      },
    },
    rules: {
      "tailwindcss/classnames-order": "off",
      "tailwindcss/enforces-canonical-classname": "off",
      "tailwindcss/enforces-shorthand": "off",
      "tailwindcss/no-unnecessary-arbitrary-value": "off",
      "tailwindcss/no-custom-classname": [
        "warn",
        {
          whitelist: [
            "^data-(?:starting|ending)-style:data-activation-direction=(?:left|right):translate-x-\\[-?50%\\]$",
            "^data-\\[ending-style\\]:easing-\\[ease\\]$",
          ],
        },
      ],
    },
  },
  prettierConfig,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
