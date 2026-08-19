import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,

  {
    plugins: {
      "unused-imports": unusedImports,
    },

    rules: {
      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
    },
  },

  prettierRecommended,

  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "coverage/**", "public/**"],
  },
]);
