"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_path = __toESM(require("path"));
var import_create_config = require("./utils/create-config.js");
const currentPackageJson = require(import_path.default.resolve("package.json"));
const isCli = "bin" in currentPackageJson;
module.exports = (0, import_create_config.createConfig)({
  extends: [
    "plugin:n/recommended",
    /**
     * Overwrite eslint-plugin-n/recommended's CommonJS configuration in parserOptions
     * because often times, ESM is compiled to CJS at runtime using tools like tsx:
     * https://github.com/eslint-community/eslint-plugin-n/blob/15.5.1/lib/configs/recommended-script.js#L14-L18
     */
    "./index"
  ],
  rules: {
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/file-extension-in-import.md
    "n/file-extension-in-import": ["error", "always", {
      // TypeScript doesn't allow extensions https://github.com/Microsoft/TypeScript/issues/27481
      // Use .js instead
      ".ts": "never",
      ".tsx": "never"
    }],
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/global-require.md
    "n/global-require": "error",
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-mixed-requires.md
    "n/no-mixed-requires": ["error", {
      allowCall: true,
      grouping: true
    }],
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-new-require.md
    "n/no-new-require": "error",
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-path-concat.md
    "n/no-path-concat": "error",
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/buffer.md
    "n/prefer-global/buffer": ["error", "always"],
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/console.md
    "n/prefer-global/console": ["error", "always"],
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/process.md
    "n/prefer-global/process": ["error", "always"],
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-decoder.md
    "n/prefer-global/text-decoder": ["error", "always"],
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-encoder.md
    "n/prefer-global/text-encoder": ["error", "always"],
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url.md
    "n/prefer-global/url": ["error", "always"],
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url-search-params.md
    "n/prefer-global/url-search-params": ["error", "always"],
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/dns.md
    "n/prefer-promises/dns": "error",
    // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/fs.md
    "n/prefer-promises/fs": "error"
  },
  overrides: [
    ...isCli ? [{
      files: [
        "cli.{js,ts}",
        "**/cli/**/*.{js,ts}"
      ],
      rules: {
        "n/no-process-exit": "off"
      }
    }] : [],
    {
      files: "**/*.md/*",
      rules: {
        "n/no-missing-import": "off"
      }
    }
  ]
});
