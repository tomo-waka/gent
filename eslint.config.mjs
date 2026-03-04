import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import vue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

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
  {
    files: [
      "packages/gent-gui/src/core/**/*.ts",
      "packages/gent-gui/src/features/**/model/**/*.ts",
      "packages/gent-gui/src/features/**/application/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/framework/**"],
              message:
                "Core/model/application layers must not depend on framework adapters.",
            },
            {
              group: ["**/ui/**"],
              message:
                "Core/model/application layers must not depend on UI implementation.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/gent-gui/src/framework/vue/**/*.{ts,vue}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/core/**"],
              message:
                "framework/vue must not directly depend on core; consume feature UI adapters instead.",
            },
            {
              group: [
                "**/features/**/application/**",
                "**/features/**/model/**",
              ],
              message:
                "framework/vue must not directly depend on feature model/application; depend on feature UI only.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/gent-gui/src/features/**/ui/**/*.{ts,vue}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/framework/**"],
              message:
                "Feature UI must not depend on framework adapters to keep one-way dependency flow.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: {
      "import-x": importX,
    },
    rules: {
      "import-x/first": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-duplicates": "error",
      "import-x/no-self-import": "warn",
      "import-x/no-useless-path-segments": "warn",
      "import-x/no-cycle": "warn",
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "unknown",
          ],
          "newlines-between": "ignore",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          named: true,
          warnOnUnassignedImports: false,
        },
      ],
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
