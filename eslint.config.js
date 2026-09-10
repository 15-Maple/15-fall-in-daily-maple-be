import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";

export default [
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },

    plugins: {
      perfectionist,
    },

    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      semi: ["error", "always"],
      quotes: ["error", "double"],

      "perfectionist/sort-imports": [
        "warn",
        {
          type: "natural",
          order: "asc",
        },
      ],

      "perfectionist/sort-exports": [
        "warn",
        {
          type: "natural",
          order: "asc",
        },
      ],
    },
  },
];
