"use strict";
var import_create_config = require("../utils/create-config.js");
var import_is_installed = require("../utils/is-installed.js");
module.exports = (0, import_create_config.createConfig)(
  (0, import_is_installed.isInstalled)("jest") ? {
    overrides: [{
      files: "**/{test,tests}/*",
      env: {
        jest: true
      }
    }]
  } : {}
);
