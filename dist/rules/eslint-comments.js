"use strict";
var import_create_config = require("../utils/create-config.js");
module.exports = (0, import_create_config.createConfig)({
  extends: "plugin:eslint-comments/recommended",
  rules: {
    "eslint-comments/no-unlimited-disable": "off",
    "eslint-comments/no-unused-disable": "error"
  }
});
