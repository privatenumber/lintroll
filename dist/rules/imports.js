"use strict";
var import_create_config = require("../utils/create-config.js");
module.exports = (0, import_create_config.createConfig)({
  env: {
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  plugins: ["import"],
  settings: {
    "import/ignore": [
      "node_modules",
      "\\.(css|svg|json)$"
    ]
  },
  rules: {
    "import/default": "off",
    "import/dynamic-import-chunkname": ["off", {
      importFunctions: [],
      webpackChunknameFormat: "[0-9a-zA-Z-_/.]+"
    }],
    "import/export": "error",
    "import/exports-last": "off",
    "import/extensions": ["error", "ignorePackages"],
    "import/first": "error",
    "import/group-exports": "off",
    "import/max-dependencies": ["warn", { max: 15 }],
    "import/named": "error",
    "import/namespace": "off",
    "import/newline-after-import": "error",
    "import/no-absolute-path": "error",
    "import/no-amd": "error",
    "import/no-anonymous-default-export": ["off", {
      allowAnonymousClass: false,
      allowAnonymousFunction: false,
      allowArray: false,
      allowArrowFunction: false,
      allowLiteral: false,
      allowObject: false
    }],
    "import/no-commonjs": "off",
    "import/no-cycle": ["error", {
      ignoreExternal: true,
      maxDepth: "\u221E"
    }],
    "import/no-duplicates": "error",
    "import/no-extraneous-dependencies": ["error", {
      devDependencies: [
        "src/**",
        "build/**",
        "build.{js,ts}",
        "**/scripts/**",
        "{test,tests,test-d}/**",
        "test.js",
        "test-*.js",
        "**/*{.,_}{test,spec}.js",
        "**/__{tests,mocks}__/**",
        "**/*.config.{js,ts}",
        "**/.*.js",
        "examples/**",
        "README.md"
      ],
      optionalDependencies: false
    }],
    "import/no-mutable-exports": "error",
    "import/no-named-as-default": "error",
    "import/no-named-as-default-member": "error",
    "import/no-named-default": "error",
    "import/no-self-import": "error",
    "import/no-unresolved": ["error", {
      caseSensitive: true,
      commonjs: true,
      ignore: [
        "^https?://"
      ]
    }],
    "import/no-useless-path-segments": ["error", { commonjs: true }],
    "import/no-webpack-loader-syntax": "error",
    "import/order": "error",
    "import/prefer-default-export": "off"
  },
  overrides: [
    {
      files: "src/",
      rules: {
        "import/no-dynamic-require": "error"
      }
    }
  ]
});
