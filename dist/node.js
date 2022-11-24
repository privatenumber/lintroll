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
    "./index"
  ],
  settings: {
    node: {
      version: ">=12.22.12"
    }
  },
  rules: {
    "n/file-extension-in-import": ["error", "always", {
      ".ts": "never",
      ".tsx": "never"
    }],
    "n/global-require": "error",
    "n/no-mixed-requires": ["error", {
      allowCall: true,
      grouping: true
    }],
    "n/no-new-require": "error",
    "n/no-path-concat": "error",
    "n/prefer-global/buffer": ["error", "always"],
    "n/prefer-global/console": ["error", "always"],
    "n/prefer-global/process": ["error", "always"],
    "n/prefer-global/text-decoder": ["error", "always"],
    "n/prefer-global/text-encoder": ["error", "always"],
    "n/prefer-global/url": ["error", "always"],
    "n/prefer-global/url-search-params": ["error", "always"],
    "n/prefer-promises/dns": "error",
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
