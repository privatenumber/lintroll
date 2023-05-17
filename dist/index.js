"use strict";
var import_create_config = require("./utils/create-config.js");
module.exports = (0, import_create_config.createConfig)({
  extends: [
    "./rules/base",
    "./rules/regexp",
    "./rules/imports",
    "./rules/promise",
    "./rules/unicorn",
    "./rules/no-use-extend-native",
    "./rules/eslint-comments",
    "./rules/json",
    "./rules/typescript",
    "./rules/vue",
    "./rules/react",
    "./rules/markdown",
    "./rules/service-workers",
    "./rules/jest"
  ],
  ignorePatterns: [
    // Nested node_modules
    "**/node_modules/**",
    "{tmp,temp}/**",
    "**/*.min.js",
    "**/vendor/**",
    "**/dist/**"
  ]
});
