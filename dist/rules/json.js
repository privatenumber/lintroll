"use strict";
var import_create_config = require("../utils/create-config");
module.exports = (0, import_create_config.createConfig)({
  ignorePatterns: [
    "package-lock.json"
  ],
  overrides: [
    {
      files: "*.{json,json5,jsonc}",
      extends: "plugin:jsonc/base",
      rules: {
        "jsonc/indent": ["error", "tab"],
        "jsonc/key-spacing": [
          "error",
          {
            beforeColon: false,
            afterColon: true,
            mode: "strict"
          }
        ],
        "jsonc/object-property-newline": "error"
      }
    },
    {
      files: "package.json",
      rules: {
        "jsonc/sort-keys": [
          "error",
          {
            pathPattern: "^$",
            order: [
              "name",
              "version",
              "private",
              "publishConfig",
              "description",
              "keywords",
              "license",
              "repository",
              "funding",
              "author",
              "type",
              "files",
              "main",
              "module",
              "types",
              "exports",
              "imports",
              "bin",
              "unpkg",
              "scripts",
              "husky",
              "simple-git-hooks",
              "lint-staged",
              "peerDependencies",
              "peerDependenciesMeta",
              "dependencies",
              "optionalDependencies",
              "devDependencies",
              "bundledDependencies",
              "bundleDependencies",
              "overrides",
              "eslintConfig"
            ]
          },
          {
            pathPattern: "^(?:dev|peer|optional|bundled)?Dependencies$",
            order: { type: "asc" }
          }
        ]
      }
    },
    {
      files: "tsconfig.json",
      extends: "plugin:jsonc/recommended-with-jsonc"
    }
  ]
});
