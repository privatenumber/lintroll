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
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/default.md#when-not-to-use-it
    "import/default": "off",
    // dynamic imports require a leading comment with a webpackChunkName
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/dynamic-import-chunkname.md
    "import/dynamic-import-chunkname": ["off", {
      importFunctions: [],
      webpackChunknameFormat: "[0-9a-zA-Z-_/.]+"
    }],
    // Helpful warnings:
    // disallow invalid exports, e.g. multiple defaults
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/export.md
    "import/export": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/exports-last.md
    // Hard to expect this when the grouped exports can't be enabled.
    // In TS, if a type needs to be exported inline, it's dependent types should be right above it
    "import/exports-last": "off",
    // ESM requires all imports to have extensions
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/extensions.md
    "import/extensions": ["error", "ignorePackages"],
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/first.md
    "import/first": "error",
    // https://githubis.com/benmosher/eslint-plugin-import/blob/e6f6018/docs/rules/group-exports.md
    // Excessive. Also, not suppored in TS w/ isolatedModules:
    // Re-exporting a type when the 'isolatedModules' flag is provided requires using 'export type'
    "import/group-exports": "off",
    // Forbid modules to have too many dependencies
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/max-dependencies.md
    "import/max-dependencies": ["warn", { max: 15 }],
    // ensure named imports coupled with named exports
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/named.md#when-not-to-use-it
    "import/named": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/namespace.md
    "import/namespace": "off",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/newline-after-import.md
    "import/newline-after-import": "error",
    // Forbid import of modules using absolute paths
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-absolute-path.md
    "import/no-absolute-path": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-amd.md
    "import/no-amd": "error",
    // Reports if a module's default export is unnamed
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-anonymous-default-export.md
    "import/no-anonymous-default-export": ["off", {
      allowAnonymousClass: false,
      allowAnonymousFunction: false,
      allowArray: false,
      allowArrowFunction: false,
      allowLiteral: false,
      allowObject: false
    }],
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-commonjs.md
    "import/no-commonjs": "off",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-cycle.md
    "import/no-cycle": ["error", {
      ignoreExternal: true,
      maxDepth: "\u221E"
    }],
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-duplicates.md
    "import/no-duplicates": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-deprecated.md
    // Very slow based on TIMING=ALL npx eslint .
    // High cost, low value
    // 'import/no-deprecated': 'error',
    // Forbid the use of extraneous packages
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-extraneous-dependencies.md
    // paths are treated both as absolute paths, and relative to process.cwd()
    "import/no-extraneous-dependencies": ["error", {
      devDependencies: [
        // Source directory - implies bundled
        "src/**",
        // Build configuration related files
        "build/**",
        "build.{js,ts}",
        // Scripts
        "**/scripts/**",
        // Tests
        "{test,tests,test-d}/**",
        "test.js",
        "test-*.js",
        "**/*{.,_}{test,spec}.js",
        // tests where the extension or filename suffix denotes that it is a test
        "**/__{tests,mocks}__/**",
        // jest pattern
        // Config files
        "**/*.config.{js,ts}",
        // any config (eg. jest, webpack, rollup, postcss, vue)
        "**/.*.js",
        // invisible config files
        // Example snippets
        "examples/**",
        // Code snippets
        "README.md"
      ],
      optionalDependencies: false
    }],
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-mutable-exports.md
    "import/no-mutable-exports": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-named-as-default.md
    "import/no-named-as-default": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-named-as-default-member.md
    "import/no-named-as-default-member": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-named-default.md
    "import/no-named-default": "error",
    // Forbid a module from importing itself
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-self-import.md
    "import/no-self-import": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-unresolved.md
    "import/no-unresolved": ["error", {
      caseSensitive: true,
      commonjs: true,
      ignore: [
        "^https?://"
      ]
    }],
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-useless-path-segments.md
    "import/no-useless-path-segments": ["error", { commonjs: true }],
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-webpack-loader-syntax.md
    "import/no-webpack-loader-syntax": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/order.md
    "import/order": "error",
    // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/prefer-default-export.md
    // Excessive. Also, named exports help enforce readable imports.
    "import/prefer-default-export": "off"
  },
  overrides: [
    {
      files: "src/",
      rules: {
        // Disallow dynamic imports if compiled
        // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-dynamic-require.md
        "import/no-dynamic-require": "error"
      }
    }
  ]
});
