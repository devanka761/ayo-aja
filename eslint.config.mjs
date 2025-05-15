import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["node_modules/", "server/", "client/", "ex/", "templates/", "views/", "*.json", "webpack*"]),
  { "rules": {
    "@typescript-eslint/no-unused-vars": [ "error",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true
      }
    ]
  }},
  { files: ["**/*.{js,ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,ts}"], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
]);