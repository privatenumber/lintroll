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
var import_confusing_browser_globals = __toESM(require("confusing-browser-globals"));
var import_create_config = require("../utils/create-config");
var import_is_installed = require("../utils/is-installed");
module.exports = (0, import_create_config.createConfig)({
  rules: {
    // enforce or disallow variable initializations at definition
    "init-declarations": "off",
    // disallow the catch clause parameter name being the same as a variable in the outer scope
    "no-catch-shadow": "off",
    // disallow deletion of variables
    "no-delete-var": "error",
    // disallow labels that share a name with a variable
    // https://eslint.org/docs/rules/no-label-var
    "no-label-var": "error",
    "no-restricted-globals": [
      "error",
      ...import_confusing_browser_globals.default
    ],
    // disallow declaration of variables already declared in the outer scope
    "no-shadow": ["error", {
      allow: [
        ...(0, import_is_installed.isInstalled)("manten") ? ["test", "describe", "runTestSuite"] : [],
        ...(0, import_is_installed.isInstalled)("tasuku") ? ["task", "setTitle", "setError", "setWarning", "setStatus", "setOutput"] : []
      ]
    }],
    // disallow shadowing of names such as arguments
    "no-shadow-restricted-names": "error",
    // disallow use of undeclared variables unless mentioned in a /*global */ block
    "no-undef": "error",
    // disallow use of undefined when initializing variables
    "no-undef-init": "error",
    // disallow declaration of variables that are not used in the code
    "no-unused-vars": ["error", {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: true
    }],
    // not always possible for inter-dependent functions
    "no-use-before-define": "off"
  }
});
