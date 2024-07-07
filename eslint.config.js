const globals = require("globals");
const pluginJs = require("@eslint/js");
const eslintPlugin = require("eslint-plugin-eslint-plugin");
const nodePlugin = require("eslint-plugin-n");

module.exports = [
  pluginJs.configs.recommended,
  eslintPlugin.configs["flat/recommended"],
  nodePlugin.configs["flat/recommended-script"],
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  {
    rules: {
      "n/no-unpublished-import": "off",
      "n/no-unpublished-require": "off",
    },
  },
];
