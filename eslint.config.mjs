import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";
import vue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      // common
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/out/**",
      "**/.vite/**",
      // packages/gent
      "packages/gent/generated/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  {
    files: ["**/*.{ts,mts,cts}"],
    extends: [...tseslint.configs.recommendedTypeChecked],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          // to notice function arguments
          args: "none",
          caughtErrors: "all",
          ignoreRestSiblings: false,
          ignoreUsingDeclarations: false,
          reportUsedIgnorePattern: false,
        },
      ],
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: [
      "packages/{gent,gent-sea,gent-server}/**/*.{js,mjs,cjs,ts,mts,cts}",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["packages/gent-gui/**/*.{js,mjs,cjs,ts,mts,cts}"],
    ignores: ["packages/gent-gui/src/**"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["packages/gent-gui/src/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // Apply Vue's latest recommended flat preset only to SFC files in gent-gui.
  ...vue.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["packages/gent-gui/src/**/*.vue"],
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        // Parse <script setup lang="ts"> blocks with TypeScript + project-aware rules.
        parser: tseslint.parser,
        projectService: true,
        extraFileExtensions: [".vue"],
      },
      globals: {
        ...globals.browser,
        ...config.languageOptions?.globals,
      },
    },
  })),
  eslintConfigPrettier,
]);
