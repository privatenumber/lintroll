"use strict";
var import_create_config = require("../utils/create-config.js");
module.exports = (0, import_create_config.createConfig)({
  extends: "plugin:promise/recommended",
  rules: {
    "promise/always-return": "off",
    "promise/catch-or-return": ["error", {
      allowThen: true
    }]
  }
});
