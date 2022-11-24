"use strict";
var import_create_config = require("../utils/create-config.js");
module.exports = (0, import_create_config.createConfig)({
  extends: "plugin:unicorn/recommended",
  rules: {
    "unicorn/better-regex": "off",
    "unicorn/consistent-function-scoping": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/no-for-loop": "off",
    "unicorn/no-new-buffer": "off",
    "unicorn/no-null": "off",
    "unicorn/no-process-exit": "off",
    "unicorn/prefer-export-from": ["off", {
      ignoreUsedVariables: true
    }],
    "unicorn/prefer-json-parse-buffer": "off",
    "unicorn/prefer-module": "off",
    "unicorn/prefer-node-protocol": "off",
    "unicorn/prefer-spread": "off",
    "unicorn/prefer-ternary": "off",
    "unicorn/prefer-top-level-await": "off",
    "unicorn/prevent-abbreviations": ["error", {
      allowList: {
        i: true,
        j: true
      },
      replacements: {
        args: false,
        dev: false,
        dist: false,
        env: false,
        pkg: false,
        prop: false,
        props: false,
        ref: false,
        src: false
      }
    }],
    "unicorn/template-indent": "off"
  }
});
