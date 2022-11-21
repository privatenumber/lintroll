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
var import_fs = __toESM(require("fs"));
var import_create_config = require("../utils/create-config.js");
var import_is_installed = require("../utils/is-installed.js");
const getModuleExports = (moduleName) => Object.keys(
  require(moduleName)
);
function detectAutoImport() {
  if (!(0, import_is_installed.isInstalled)("unplugin-auto-import")) {
    return {};
  }
  return Object.fromEntries(
    [
      "vue",
      "vue-router",
      "@vueuse/core",
      "@vueuse/head"
    ].flatMap((moduleName) => (0, import_is_installed.isInstalled)(moduleName) ? getModuleExports(moduleName).map(
      (exportName) => [exportName, "readonly"]
    ) : [])
  );
}
function detectAutoImportComponents() {
  const components = [];
  if ((0, import_is_installed.isInstalled)("vitepress")) {
    components.push(
      "content",
      "client-only",
      "outbound-link"
    );
  }
  const componentsPath = "./src/components";
  if ((0, import_is_installed.isInstalled)("unplugin-vue-components") && import_fs.default.existsSync(componentsPath)) {
    const files = import_fs.default.readdirSync(componentsPath);
    const componentFiles = files.filter((filename) => filename.endsWith(".vue")).map((filename) => filename.replace(".vue", ""));
    components.push(...componentFiles);
  }
  if ((0, import_is_installed.isInstalled)("unplugin-icons")) {
    components.push("icon-*");
  }
  return components;
}
module.exports = (0, import_create_config.createConfig)({
  overrides: [
    {
      files: "*.vue",
      extends: "plugin:vue/vue3-recommended",
      env: {
        "vue/setup-compiler-macros": true
      },
      globals: detectAutoImport(),
      parserOptions: {
        parser: {
          ts: "@typescript-eslint/parser"
        }
      },
      rules: {
        "unicorn/filename-case": ["error", {
          case: "pascalCase"
        }],
        "vue/html-indent": ["error", "tab"],
        "vue/multi-word-component-names": "off",
        "vue/no-undef-components": ["error", {
          ignorePatterns: [
            "router-view",
            "router-link",
            ...detectAutoImportComponents()
          ]
        }]
      }
    }
  ]
});