import { defineConfig } from "eslint/config";

import nextPlugin from "@next/eslint-plugin-next";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default defineConfig([
  prettier,
  {
    ignores: [
    ".next/",
    "node_modules/",
    "dist/",
    "build/",
    "coverage/",
    "logs/",
    "tmp/",
    "*.log",
    "*.log.*",
    ]
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}", "__tests__/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...tsPlugin.configs.recommended.rules,

      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            ["^react", "^next"],
            ["^@?\\w"],
            ["^@/"],
            ["^\\u0000"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.?(css)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "warn",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", args: "after-used", ignoreRestSiblings: true },
      ],
      "import/no-duplicates": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "import/first": "error",
      "import/no-useless-path-segments": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
  },
]);
