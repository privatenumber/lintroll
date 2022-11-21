"use strict";
var import_create_config = require("../utils/create-config.js");
module.exports = (0, import_create_config.createConfig)({
  overrides: [
    {
      files: "*.md",
      plugins: ["markdown"],
      processor: "markdown/markdown"
    },
    {
      files: "**/*.md/*.{js,jsx,ts,tsx,vue}",
      rules: {
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "no-console": "off",
        "no-new": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "warn",
        "unicorn/filename-case": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/prefer-object-from-entries": "off"
      }
    },
    {
      files: "**/*.md/*.{jsx,tsx}",
      rules: {
        "react/jsx-indent-props": ["error", 4],
        "react/jsx-no-undef": "off",
        "react/react-in-jsx-scope": "off"
      }
    },
    {
      files: "**/*.md/*.{js,jsx,vue}",
      rules: {
        "comma-dangle": ["error", "never"],
        indent: ["error", 4],
        semi: ["error", "never"]
      }
    },
    {
      files: "**/*.md/*.vue",
      rules: {
        "vue/html-indent": ["error", 4],
        "vue/no-undef-components": "warn"
      }
    },
    {
      files: "**/*.md/*.{ts,tsx}",
      rules: {
        "@typescript-eslint/comma-dangle": ["error", "never"],
        "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/member-delimiter-style": [
          "error",
          {
            multiline: {
              delimiter: "none",
              requireLast: false
            },
            multilineDetection: "brackets",
            singleline: {
              delimiter: "semi",
              requireLast: false
            }
          }
        ],
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/semi": ["error", "never"],
        "comma-dangle": "off",
        indent: "off",
        semi: "off"
      }
    },
    {
      files: "**/*.md/*.{json,json5}",
      rules: {
        "jsonc/indent": ["error", 4],
        "unicorn/filename-case": "off"
      }
    }
  ]
});
