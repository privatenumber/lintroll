"use strict";
var import_create_config = require("../utils/create-config");
module.exports = (0, import_create_config.createConfig)({
  extends: "plugin:eslint-comments/recommended",
  rules: {
    // Disallow disable directives that don't affect any rules
    "eslint-comments/no-unused-disable": "error",
    // Disabled in favor of `unicorn/no-abusive-eslint-disable`
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/c137daa/index.js#L33
    "eslint-comments/no-unlimited-disable": "off"
  }
});