"use strict";
var import_get_tsconfig = require("get-tsconfig");
var import_create_config = require("../utils/create-config.js");
const tsconfig = (0, import_get_tsconfig.getTsconfig)();
const jsx = tsconfig?.config.compilerOptions?.jsx;
const autoJsx = jsx === "react-jsx" || jsx === "react-jsxdev";
module.exports = (0, import_create_config.createConfig)({
  overrides: [
    {
      files: "*.{jsx,tsx}",
      extends: [
        "plugin:react/recommended",
        ...autoJsx ? ["plugin:react/jsx-runtime"] : [],
        "plugin:react-hooks/recommended"
      ],
      settings: {
        react: {
          version: "detect"
        }
      },
      rules: {
        "jsx-quotes": ["error", "prefer-double"],
        "react/jsx-indent-props": ["error", "tab"],
        "react/jsx-max-props-per-line": ["error", {
          maximum: 1
        }],
        "unicorn/filename-case": ["error", {
          case: "pascalCase",
          ignore: [
            "\\.spec\\.tsx$"
          ]
        }]
      }
    }
  ]
});
