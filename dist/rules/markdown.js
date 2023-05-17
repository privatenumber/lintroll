"use strict";
var import_create_config = require("../utils/create-config");
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
        "unicorn/filename-case": "off",
        "no-console": "off",
        "no-unused-vars": "warn",
        // Can be snippets that don't fully work
        "no-undef": "off",
        "no-new": "off",
        "import/no-unresolved": "off",
        "import/extensions": "off",
        // Allow unused expressions like: argv.command // => "install" (string)
        "no-unused-expressions": "off",
        // Loose on example code
        "unicorn/no-array-reduce": "off",
        "unicorn/prefer-object-from-entries": "off"
      }
    },
    {
      files: "**/*.md/*.{jsx,tsx}",
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/jsx-no-undef": "off",
        "react/jsx-indent-props": ["error", 4]
      }
    },
    {
      files: "**/*.md/*.{js,jsx,vue}",
      rules: {
        // Style
        indent: ["error", 4],
        semi: ["error", "never"],
        "comma-dangle": ["error", "never"]
      }
    },
    {
      files: "**/*.md/*.{ts,tsx}",
      rules: {
        // Style
        indent: "off",
        "@typescript-eslint/indent": ["error", 4],
        semi: "off",
        "@typescript-eslint/semi": ["error", "never"],
        "comma-dangle": "off",
        "@typescript-eslint/comma-dangle": ["error", "never"],
        "@typescript-eslint/member-delimiter-style": [
          "error",
          {
            multiline: {
              delimiter: "none",
              requireLast: false
            },
            singleline: {
              delimiter: "semi",
              requireLast: false
            },
            multilineDetection: "brackets"
          }
        ],
        "@typescript-eslint/no-unused-vars": "warn"
      }
    },
    {
      files: "**/*.md/*.{json,json5}",
      rules: {
        "unicorn/filename-case": "off",
        "jsonc/indent": ["error", 4]
      }
    }
  ]
});
