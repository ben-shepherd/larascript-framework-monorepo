const globals = require("globals");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
);
