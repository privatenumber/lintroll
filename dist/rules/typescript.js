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
var import_recommended_module = __toESM(require("eslint-plugin-n/lib/configs/recommended-module.js"));
var import_recommended_script = __toESM(require("eslint-plugin-n/lib/configs/recommended-script.js"));
var import_create_config = require("../utils/create-config.js");
var import_is_installed = require("../utils/is-installed.js");
var import_base = __toESM(require("./base.js"));
var import_imports = __toESM(require("./imports.js"));
const noExtraneousDependenciesConfig = import_imports.default.rules["import/no-extraneous-dependencies"][1];
module.exports = (0, import_create_config.createConfig)(
  (0, import_is_installed.isInstalled)("typescript") ? {
    overrides: [
      {
        files: "*.{ts,tsx,mts,cts,vue}",
        extends: [
          "plugin:@typescript-eslint/recommended",
          "plugin:import/typescript"
        ],
        settings: {
          "import/resolver": {
            typescript: {}
          }
        },
        rules: {
          "@typescript-eslint/consistent-type-assertions": "error",
          "@typescript-eslint/member-delimiter-style": "error",
          "@typescript-eslint/no-shadow": import_base.default.rules["no-shadow"],
          "@typescript-eslint/no-unused-vars": [
            "error",
            {
              ...import_base.default.rules["no-unused-vars"][1],
              argsIgnorePattern: "^_",
              caughtErrorsIgnorePattern: "^_",
              varsIgnorePattern: "^_"
            }
          ],
          "func-style": "off",
          "import/extensions": ["error", "ignorePackages", {
            ts: "never",
            tsx: "never"
          }],
          "import/no-extraneous-dependencies": ["error", {
            ...noExtraneousDependenciesConfig,
            devDependencies: [
              ...noExtraneousDependenciesConfig.devDependencies.map(
                (pattern) => pattern.replace(".js", ".{js,ts}")
              )
            ]
          }],
          "no-shadow": "off",
          "prefer-rest-params": "off",
          "unicorn/consistent-destructuring": "off",
          "unicorn/no-array-callback-reference": "off",
          "unicorn/no-useless-undefined": "off"
        }
      },
      {
        files: "*.cts",
        ...import_recommended_script.default
      },
      {
        files: "*.mts",
        ...import_recommended_module.default
      }
    ]
  } : {}
);
