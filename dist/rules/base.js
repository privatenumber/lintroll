"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_confusing_browser_globals = __toESM(require("confusing-browser-globals"));
var import_create_config = require("../utils/create-config.js");
var import_is_installed = require("../utils/is-installed.js");
module.exports = (0, import_create_config.createConfig)({
  extends: "eslint:recommended",
  env: {
    "shared-node-browser": true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    "accessor-pairs": "error",
    "array-bracket-newline": ["error", "consistent"],
    "array-bracket-spacing": ["error", "never"],
    "array-callback-return": ["error", { allowImplicit: true }],
    "array-element-newline": ["error", "consistent"],
    "arrow-body-style": ["error", "as-needed"],
    "arrow-parens": ["error", "as-needed", { requireForBlockBody: true }],
    "arrow-spacing": ["error", { after: true, before: true }],
    "block-scoped-var": "error",
    "block-spacing": ["error", "always"],
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    camelcase: ["error", { ignoreDestructuring: false, properties: "never" }],
    "comma-dangle": ["error", {
      arrays: "always-multiline",
      exports: "always-multiline",
      functions: "always-multiline",
      imports: "always-multiline",
      objects: "always-multiline"
    }],
    "comma-spacing": ["error", { after: true, before: false }],
    "comma-style": ["error", "last", {
      exceptions: {
        ArrayExpression: false,
        ArrayPattern: false,
        ArrowFunctionExpression: false,
        CallExpression: false,
        FunctionDeclaration: false,
        FunctionExpression: false,
        ImportDeclaration: false,
        NewExpression: false,
        ObjectExpression: false,
        ObjectPattern: false,
        VariableDeclaration: false
      }
    }],
    complexity: ["warn", 10],
    "computed-property-spacing": ["error", "never"],
    "consistent-return": "off",
    "constructor-super": "error",
    curly: "error",
    "default-case": ["error", { commentPattern: "^no default$" }],
    "default-case-last": "error",
    "default-param-last": "error",
    "dot-location": ["error", "property"],
    "dot-notation": ["error", { allowKeywords: true }],
    "eol-last": ["error", "always"],
    eqeqeq: ["error", "always", { null: "ignore" }],
    "for-direction": "error",
    "func-call-spacing": ["error", "never"],
    "func-name-matching": ["off", "always", {
      considerPropertyDescriptor: true,
      includeCommonJSModuleExports: false
    }],
    "func-names": "warn",
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    "function-call-argument-newline": ["error", "consistent"],
    "function-paren-newline": ["error", "consistent"],
    "generator-star-spacing": ["error", { after: true, before: false }],
    "getter-return": ["error", { allowImplicit: true }],
    "grouped-accessor-pairs": ["error", "getBeforeSet"],
    "guard-for-in": "error",
    "id-blacklist": "off",
    "id-denylist": "off",
    "id-length": "off",
    "id-match": "off",
    "implicit-arrow-linebreak": ["error", "beside"],
    indent: ["error", "tab", {
      ArrayExpression: 1,
      CallExpression: {
        arguments: 1
      },
      flatTernaryExpressions: false,
      FunctionDeclaration: {
        body: 1,
        parameters: 1
      },
      FunctionExpression: {
        body: 1,
        parameters: 1
      },
      ignoreComments: false,
      ignoredNodes: [
        "TemplateLiteral > *",
        "JSXElement",
        "JSXElement > *",
        "JSXAttribute",
        "JSXIdentifier",
        "JSXNamespacedName",
        "JSXMemberExpression",
        "JSXSpreadAttribute",
        "JSXExpressionContainer",
        "JSXOpeningElement",
        "JSXClosingElement",
        "JSXFragment",
        "JSXOpeningFragment",
        "JSXClosingFragment",
        "JSXText",
        "JSXEmptyExpression",
        "JSXSpreadChild"
      ],
      ImportDeclaration: 1,
      ObjectExpression: 1,
      outerIIFEBody: 1,
      SwitchCase: 1,
      VariableDeclarator: 1
    }],
    "init-declarations": "off",
    "key-spacing": ["error", { afterColon: true, beforeColon: false }],
    "keyword-spacing": ["error", {
      after: true,
      before: true,
      overrides: {
        case: { after: true },
        return: { after: true },
        throw: { after: true }
      }
    }],
    "linebreak-style": ["error", "unix"],
    "lines-around-comment": "off",
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: false }],
    "max-classes-per-file": ["error", 1],
    "max-depth": ["off", 4],
    "max-len": ["error", 100, 2, {
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreUrls: true
    }],
    "max-lines": ["off", {
      max: 300,
      skipBlankLines: true,
      skipComments: true
    }],
    "max-lines-per-function": ["off", {
      IIFEs: true,
      max: 50,
      skipBlankLines: true,
      skipComments: true
    }],
    "max-nested-callbacks": ["warn", 4],
    "max-params": ["warn", 5],
    "max-statements-per-line": ["warn", { max: 1 }],
    "multiline-ternary": ["error", "always-multiline"],
    "new-cap": ["error", {
      capIsNew: false,
      capIsNewExceptions: ["Immutable.Map", "Immutable.Set", "Immutable.List"],
      newIsCap: true,
      newIsCapExceptions: []
    }],
    "new-parens": "error",
    "newline-after-var": "off",
    "newline-before-return": "off",
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 4 }],
    "no-alert": "warn",
    "no-array-constructor": "error",
    "no-async-promise-executor": "error",
    "no-bitwise": "error",
    "no-caller": "error",
    "no-case-declarations": "error",
    "no-catch-shadow": "off",
    "no-class-assign": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": ["error", "always"],
    "no-confusing-arrow": ["error", {
      allowParens: true
    }],
    "no-console": "warn",
    "no-const-assign": "error",
    "no-constant-condition": "warn",
    "no-constructor-return": "error",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-delete-var": "error",
    "no-dupe-args": "error",
    "no-dupe-class-members": "error",
    "no-dupe-else-if": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "off",
    "no-else-return": ["error", { allowElseIf: false }],
    "no-empty": ["error", {
      allowEmptyCatch: true
    }],
    "no-empty-character-class": "error",
    "no-empty-function": ["error", {
      allow: [
        "arrowFunctions",
        "functions",
        "methods"
      ]
    }],
    "no-empty-pattern": "error",
    "no-eq-null": "error",
    "no-eval": "error",
    "no-ex-assign": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-boolean-cast": "error",
    "no-extra-label": "error",
    "no-extra-parens": ["off", "all", {
      conditionalAssign: true,
      enforceForArrowConditionals: false,
      ignoreJSX: "all",
      nestedBinaryExpressions: false,
      returnAssign: false
    }],
    "no-extra-semi": "error",
    "no-fallthrough": "error",
    "no-floating-decimal": "error",
    "no-func-assign": "error",
    "no-global-assign": "error",
    "no-implicit-coercion": ["off", {
      allow: [],
      boolean: false,
      number: true,
      string: true
    }],
    "no-implicit-globals": "error",
    "no-implied-eval": "error",
    "no-import-assign": "error",
    "no-inline-comments": "off",
    "no-inner-declarations": "off",
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": ["error", {
      allowLoop: true,
      allowSwitch: false
    }],
    "no-lone-blocks": "error",
    "no-lonely-if": "error",
    "no-loop-func": "error",
    "no-loss-of-precision": "error",
    "no-magic-numbers": ["off", {
      detectObjects: false,
      enforceConst: true,
      ignore: [],
      ignoreArrayIndexes: true
    }],
    "no-misleading-character-class": "error",
    "no-mixed-operators": ["error", {
      allowSamePrecedence: false,
      groups: [
        ["%", "**"],
        ["%", "+"],
        ["%", "-"],
        ["%", "*"],
        ["%", "/"],
        ["/", "*"],
        ["&", "|", "<<", ">>", ">>>"],
        ["==", "!=", "===", "!=="],
        ["&&", "||"]
      ]
    }],
    "no-mixed-spaces-and-tabs": "error",
    "no-multi-assign": ["error"],
    "no-multi-spaces": ["error", {
      ignoreEOLComments: false
    }],
    "no-multi-str": "error",
    "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
    "no-negated-condition": "off",
    "no-nested-ternary": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-object": "error",
    "no-new-symbol": "error",
    "no-new-wrappers": "error",
    "no-nonoctal-decimal-escape": "error",
    "no-obj-calls": "error",
    "no-octal": "error",
    "no-octal-escape": "error",
    "no-plusplus": "error",
    "no-promise-executor-return": "error",
    "no-proto": "error",
    "no-prototype-builtins": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-restricted-exports": ["error", {
      restrictedNamedExports: [
        "then"
      ]
    }],
    "no-restricted-globals": [
      "error",
      ...import_confusing_browser_globals.default
    ],
    "no-restricted-imports": ["off", {
      paths: [],
      patterns: []
    }],
    "no-restricted-properties": [
      "error",
      {
        message: "arguments.callee is deprecated",
        object: "arguments",
        property: "callee"
      },
      {
        message: "Please use Number.isFinite instead",
        object: "global",
        property: "isFinite"
      },
      {
        message: "Please use Number.isFinite instead",
        object: "self",
        property: "isFinite"
      },
      {
        message: "Please use Number.isFinite instead",
        object: "window",
        property: "isFinite"
      },
      {
        message: "Please use Number.isNaN instead",
        object: "global",
        property: "isNaN"
      },
      {
        message: "Please use Number.isNaN instead",
        object: "self",
        property: "isNaN"
      },
      {
        message: "Please use Number.isNaN instead",
        object: "window",
        property: "isNaN"
      },
      {
        message: "Please use Object.defineProperty instead.",
        property: "__defineGetter__"
      },
      {
        message: "Please use Object.defineProperty instead.",
        property: "__defineSetter__"
      },
      {
        message: "Use the exponentiation operator (**) instead.",
        object: "Math",
        property: "pow"
      }
    ],
    "no-return-assign": ["error", "always"],
    "no-script-url": "error",
    "no-self-assign": ["error", {
      props: true
    }],
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-setter-return": "error",
    "no-shadow": ["error", {
      allow: [
        ...(0, import_is_installed.isInstalled)("manten") ? ["test", "describe", "runTestSuite"] : [],
        ...(0, import_is_installed.isInstalled)("tasuku") ? ["task", "setTitle", "setError", "setWarning", "setStatus", "setOutput"] : []
      ]
    }],
    "no-shadow-restricted-names": "error",
    "no-sparse-arrays": "error",
    "no-template-curly-in-string": "error",
    "no-this-before-super": "error",
    "no-throw-literal": "error",
    "no-trailing-spaces": ["error", {
      ignoreComments: false,
      skipBlankLines: false
    }],
    "no-undef": "error",
    "no-undef-init": "error",
    "no-unexpected-multiline": "error",
    "no-unmodified-loop-condition": "off",
    "no-unneeded-ternary": ["error", {
      defaultAssignment: false
    }],
    "no-unreachable": "error",
    "no-unreachable-loop": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unused-expressions": ["error", {
      allowShortCircuit: false,
      allowTaggedTemplates: false,
      allowTernary: false
    }],
    "no-unused-labels": "error",
    "no-unused-vars": ["error", {
      args: "after-used",
      ignoreRestSiblings: true,
      vars: "all"
    }],
    "no-use-before-define": "off",
    "no-useless-backreference": "error",
    "no-useless-call": "off",
    "no-useless-catch": "error",
    "no-useless-computed-key": "error",
    "no-useless-concat": "error",
    "no-useless-constructor": "error",
    "no-useless-escape": "error",
    "no-useless-rename": ["error", {
      ignoreDestructuring: false,
      ignoreExport: false,
      ignoreImport: false
    }],
    "no-useless-return": "error",
    "no-var": "error",
    "no-void": "error",
    "no-warning-comments": ["off", { location: "start", terms: ["todo", "fixme", "xxx"] }],
    "no-whitespace-before-property": "error",
    "no-with": "error",
    "nonblock-statement-body-position": ["error", "beside", {
      overrides: {}
    }],
    "object-curly-newline": ["error", {
      ExportDeclaration: { consistent: true, minProperties: 4, multiline: true },
      ImportDeclaration: { consistent: true, minProperties: 4, multiline: true },
      ObjectExpression: { consistent: true, minProperties: 4, multiline: true },
      ObjectPattern: { consistent: true, minProperties: 4, multiline: true }
    }],
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": ["error", {
      allowAllPropertiesOnSameLine: true
    }],
    "object-shorthand": ["error", "always", {
      ignoreConstructors: false
    }],
    "one-var": ["error", "never"],
    "one-var-declaration-per-line": ["error", "always"],
    "operator-assignment": ["error", "always"],
    "operator-linebreak": ["error", "before", {
      overrides: {
        "=": "none"
      }
    }],
    "padded-blocks": ["error", {
      blocks: "never",
      classes: "never",
      switches: "never"
    }, {
      allowSingleLineBlocks: true
    }],
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        next: "*",
        prev: "directive"
      }
    ],
    "prefer-arrow-callback": ["error", {
      allowNamedFunctions: false,
      allowUnboundThis: true
    }],
    "prefer-const": ["error", {
      destructuring: "any",
      ignoreReadBeforeAssign: true
    }],
    "prefer-destructuring": ["error", {
      AssignmentExpression: {
        array: true,
        object: false
      },
      VariableDeclarator: {
        array: false,
        object: true
      }
    }, {
      enforceForRenamedProperties: false
    }],
    "prefer-exponentiation-operator": "error",
    "prefer-named-capture-group": "off",
    "prefer-numeric-literals": "error",
    "prefer-object-spread": "error",
    "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],
    "prefer-reflect": "off",
    "prefer-regex-literals": ["error", {
      disallowRedundantWrapping: true
    }],
    "prefer-rest-params": "off",
    "prefer-spread": "error",
    "prefer-template": "error",
    "quote-props": ["error", "as-needed", { keywords: false, numbers: false, unnecessary: true }],
    quotes: ["error", "single", { avoidEscape: true }],
    radix: "error",
    "require-atomic-updates": "off",
    "require-await": "off",
    "require-unicode-regexp": "off",
    "require-yield": "error",
    "rest-spread-spacing": ["error", "never"],
    semi: ["error", "always"],
    "semi-spacing": ["error", { after: true, before: false }],
    "semi-style": ["error", "last"],
    "sort-imports": ["off", {
      ignoreCase: false,
      ignoreDeclarationSort: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
    }],
    "sort-keys": ["off", "asc", { caseSensitive: false, natural: true }],
    "sort-vars": "off",
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", {
      anonymous: "always",
      asyncArrow: "always",
      named: "never"
    }],
    "space-in-parens": ["error", "never"],
    "space-infix-ops": "error",
    "space-unary-ops": ["error", {
      nonwords: false,
      overrides: {},
      words: true
    }],
    "spaced-comment": ["error", "always", {
      block: {
        balanced: true,
        exceptions: ["-", "+"],
        markers: ["=", "!", ":", "::"]
      },
      line: {
        exceptions: ["-", "+"],
        markers: ["=", "!", "/"]
      }
    }],
    "switch-colon-spacing": ["error", { after: true, before: false }],
    "symbol-description": "error",
    "template-curly-spacing": "error",
    "template-tag-spacing": ["error", "never"],
    "unicode-bom": ["error", "never"],
    "use-isnan": "error",
    "valid-typeof": ["error", { requireStringLiterals: true }],
    "vars-on-top": "error",
    "wrap-iife": ["error", "inside", { functionPrototypeMethods: false }],
    "yield-star-spacing": ["error", "after"],
    yoda: "error"
  }
});
