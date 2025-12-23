import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["dist/**"],


    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readonly"
      },
    },

    settings: {
      react: {
        version: "detect"
      }
    },  

    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": ts,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Fixes the JSX runtime error
      "react/react-in-jsx-scope": "off",
    },
  },
];