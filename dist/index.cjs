'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var module$1 = require('module');
var js = require('@eslint/js');
var globals = require('globals');
var confusingBrowserGlobals = require('confusing-browser-globals');
var eslintCommentsPlugin = require('@eslint-community/eslint-plugin-eslint-comments');
var stylisticPlugin = require('@stylistic/eslint-plugin');
var url = require('url');
var importPlugin = require('eslint-plugin-import');
var tsPlugin = require('@typescript-eslint/eslint-plugin');
var tsParser = require('@typescript-eslint/parser');
var regexpPlugin = require('eslint-plugin-regexp');
var fs = require('node:fs');
var nodePlugin = require('eslint-plugin-n');
var readPackageUp = require('read-package-up');
var index$1 = require('./index-58f2e892.cjs');
var promisePlugin = require('eslint-plugin-promise');
var markdownPlugin = require('eslint-plugin-markdown');
var jsoncPlugin = require('eslint-plugin-jsonc');
var noUseExtendNativePlugin = require('eslint-plugin-no-use-extend-native');
var unicornPlugin = require('eslint-plugin-unicorn');
var reactPlugin = require('eslint-plugin-react');
var reactHooksPlugin = require('eslint-plugin-react-hooks');
var getTsconfig = require('get-tsconfig');
var fs$1 = require('fs');
var vuePlugin = require('eslint-plugin-vue');
var vueParser = require('vue-eslint-parser');
require('node:process');
require('node:fs/promises');
require('node:url');
require('node:path');

const require$1 = module$1.createRequire(`${process.cwd()}/`);
const isInstalled = (specifier) => {
  try {
    require$1.resolve(specifier);
    return true;
  } catch {
  }
  return false;
};
const getExports = (moduleName) => Object.keys(
  // eslint-disable-next-line import/no-dynamic-require
  require$1(moduleName)
);

const properties = [
  "files",
  "ignores",
  "languageOptions",
  "linterOptions",
  "plugins",
  "rules",
  "settings"
];
const deepFreeze = (config) => {
  for (const property of properties) {
    const value = config[property];
    if (!value) {
      continue;
    }
    Object.freeze(value);
    if (property === "rules") {
      const rules = value;
      for (const ruleName in rules) {
        if (Object.hasOwn(rules, ruleName)) {
          const rule = rules[ruleName];
          if (rule) {
            Object.freeze(rule);
          }
        }
      }
    }
    if (property === "languageOptions") {
      const languageOptions = value;
      if (languageOptions.parserOptions) {
        Object.freeze(languageOptions.parserOptions);
      }
      if (languageOptions.globals) {
        Object.freeze(languageOptions.globals);
      }
    }
  }
  return Object.freeze(config);
};
const defineConfig = (config) => Array.isArray(config) ? config.map(deepFreeze) : deepFreeze(config);

const baseConfig = defineConfig({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: globals["shared-node-browser"]
  },
  rules: {
    "accessor-pairs": "error",
    // https://eslint.org/docs/latest/rules/array-callback-return
    "array-callback-return": ["error", { allowImplicit: true }],
    // https://eslint.org/docs/latest/rules/arrow-body-style
    "arrow-body-style": ["error", "as-needed"],
    // treat var statements as if they were block scoped
    "block-scoped-var": "error",
    // require camel case names
    camelcase: ["error", {
      ignoreDestructuring: false,
      properties: "never"
    }],
    // https://eslint.org/docs/latest/rules/complexity
    complexity: ["warn", 10],
    "consistent-return": "off",
    // verify super() callings in constructors
    "constructor-super": "error",
    curly: "error",
    // require default case in switch statements
    "default-case": ["error", { commentPattern: "^no default$" }],
    // https://eslint.org/docs/latest/rules/default-case-last
    "default-case-last": "error",
    // https://eslint.org/docs/latest/rules/default-param-last
    "default-param-last": "error",
    "dot-notation": ["error", { allowKeywords: true }],
    // https://eslint.org/docs/latest/rules/eqeqeq
    eqeqeq: ["error", "always", { null: "ignore" }],
    // Enforce “for” loop update clause moving the counter in the right direction
    // https://eslint.org/docs/latest/rules/for-direction
    "for-direction": "error",
    // requires function names to match the name of the variable or property to which they are
    // assigned
    // https://eslint.org/docs/latest/rules/func-name-matching
    "func-name-matching": ["off", "always", {
      considerPropertyDescriptor: true,
      includeCommonJSModuleExports: false
    }],
    // require function expressions to have a name
    // https://eslint.org/docs/latest/rules/func-names
    "func-names": "warn",
    // https://eslint.org/docs/latest/rules/func-style
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    // Enforces that a return statement is present in property getters
    // https://eslint.org/docs/latest/rules/getter-return
    "getter-return": ["error", { allowImplicit: true }],
    // https://eslint.org/docs/latest/rules/grouped-accessor-pairs
    "grouped-accessor-pairs": ["error", "getBeforeSet"],
    // make sure for-in loops have an if statement
    "guard-for-in": "error",
    // https://eslint.org/docs/latest/rules/id-blacklist
    "id-blacklist": "off",
    // disallow specified identifiers
    // https://eslint.org/docs/latest/rules/id-denylist
    "id-denylist": "off",
    // this option enforces minimum and maximum identifier lengths
    // (variable names, property names etc.)
    "id-length": "off",
    // require identifiers to match the provided regular expression
    "id-match": "off",
    // enforce or disallow variable initializations at definition
    "init-declarations": "off",
    // enforce a maximum number of classes per file
    // https://eslint.org/docs/latest/rules/max-classes-per-file
    "max-classes-per-file": ["error", 1],
    // specify the maximum depth that blocks can be nested
    "max-depth": ["off", 4],
    // specify the max number of lines in a file
    // https://eslint.org/docs/latest/rules/max-lines
    "max-lines": ["off", {
      max: 300,
      skipBlankLines: true,
      skipComments: true
    }],
    // enforce a maximum function length
    // https://eslint.org/docs/latest/rules/max-lines-per-function
    "max-lines-per-function": ["off", {
      IIFEs: true,
      max: 50,
      skipBlankLines: true,
      skipComments: true
    }],
    // https://eslint.org/docs/latest/rules/max-nested-callbacks
    "max-nested-callbacks": ["warn", 4],
    // https://eslint.org/docs/latest/rules/max-params
    "max-params": ["warn", 5],
    // https://eslint.org/docs/latest/rules/max-statements
    // Consider test "describe()" containing many tests
    // 'max-statements': ['warn', 10],
    // require a capital letter for constructors
    "new-cap": ["error", {
      capIsNew: false,
      capIsNewExceptions: ["Immutable.Map", "Immutable.Set", "Immutable.List"],
      newIsCap: true,
      newIsCapExceptions: []
    }],
    // allow/disallow an empty newline after var statement
    "newline-after-var": "off",
    // https://eslint.org/docs/latest/rules/newline-before-return
    "newline-before-return": "off",
    // disallow the use of alert, confirm, and prompt
    "no-alert": "warn",
    // disallow use of the Array constructor
    "no-array-constructor": "error",
    // disallow using an async function as a Promise executor
    // https://eslint.org/docs/latest/rules/no-async-promise-executor
    "no-async-promise-executor": "error",
    // disallow use of bitwise operators
    // https://eslint.org/docs/latest/rules/no-bitwise
    "no-bitwise": "error",
    // disallow use of arguments.caller or arguments.callee
    "no-caller": "error",
    // disallow lexical declarations in case/default clauses
    // https://eslint.org/docs/latest/rules/no-case-declarations.html
    "no-case-declarations": "error",
    // disallow the catch clause parameter name being the same as a variable in the outer scope
    "no-catch-shadow": "off",
    // disallow modifying variables of class declarations
    // https://eslint.org/docs/latest/rules/no-class-assign
    "no-class-assign": "error",
    // Disallow comparisons to negative zero
    // https://eslint.org/docs/latest/rules/no-compare-neg-zero
    "no-compare-neg-zero": "error",
    // disallow assignment in conditional expressions
    "no-cond-assign": ["error", "always"],
    // disallow use of console
    "no-console": "warn",
    // disallow modifying variables that are declared using const
    "no-const-assign": "error",
    // disallow use of constant expressions in conditions
    "no-constant-condition": "warn",
    // https://eslint.org/docs/latest/rules/no-constructor-return
    "no-constructor-return": "error",
    // disallow control characters in regular expressions
    "no-control-regex": "error",
    // disallow use of debugger
    "no-debugger": "error",
    // disallow deletion of variables
    "no-delete-var": "error",
    // disallow duplicate arguments in functions
    "no-dupe-args": "error",
    // disallow duplicate class members
    // https://eslint.org/docs/latest/rules/no-dupe-class-members
    "no-dupe-class-members": "error",
    // Disallow duplicate conditions in if-else-if chains
    // https://eslint.org/docs/latest/rules/no-dupe-else-if
    "no-dupe-else-if": "error",
    // disallow duplicate keys when creating object literals
    "no-dupe-keys": "error",
    // disallow a duplicate case label.
    "no-duplicate-case": "error",
    // disallow importing from the same path more than once
    // https://eslint.org/docs/latest/rules/no-duplicate-imports
    // replaced by https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
    "no-duplicate-imports": "off",
    // disallow else after a return in an if
    // https://eslint.org/docs/latest/rules/no-else-return
    "no-else-return": ["error", { allowElseIf: false }],
    // disallow empty statements
    "no-empty": ["error", {
      allowEmptyCatch: true
    }],
    // disallow the use of empty character classes in regular expressions
    "no-empty-character-class": "error",
    // disallow empty functions, except for standalone funcs/arrows
    // https://eslint.org/docs/latest/rules/no-empty-function
    "no-empty-function": ["error", {
      allow: [
        "arrowFunctions",
        "functions",
        "methods"
      ]
    }],
    // disallow empty destructuring patterns
    // https://eslint.org/docs/latest/rules/no-empty-pattern
    "no-empty-pattern": "error",
    "no-eq-null": "error",
    "no-eval": "error",
    // disallow assigning to the exception in a catch block
    "no-ex-assign": "error",
    "no-extend-native": "error",
    // disallow unnecessary function binding
    "no-extra-bind": "error",
    // disallow double-negation boolean casts in a boolean context
    // https://eslint.org/docs/latest/rules/no-extra-boolean-cast
    "no-extra-boolean-cast": "error",
    // https://eslint.org/docs/latest/rules/no-extra-label
    "no-extra-label": "error",
    // disallow fallthrough of case statements
    "no-fallthrough": "error",
    // disallow overwriting functions written as function declarations
    "no-func-assign": "error",
    // disallow reassignments of native objects or read-only globals
    // https://eslint.org/docs/latest/rules/no-global-assign
    "no-global-assign": "error",
    // disallow implicit type conversions
    // https://eslint.org/docs/latest/rules/no-implicit-coercion
    "no-implicit-coercion": ["off", {
      allow: [],
      boolean: false,
      number: true,
      string: true
    }],
    // disallow var and named functions in global scope
    // https://eslint.org/docs/latest/rules/no-implicit-globals
    "no-implicit-globals": "error",
    "no-implied-eval": "error",
    // https://eslint.org/docs/latest/rules/no-import-assign
    "no-import-assign": "error",
    // disallow comments inline after code
    "no-inline-comments": "off",
    // https://eslint.org/docs/latest/rules/no-inner-declarations
    // Function declarations were only allowed at the root pre-ES6. Now, it's fine.
    "no-inner-declarations": "off",
    // disallow invalid regular expression strings in the RegExp constructor
    "no-invalid-regexp": "error",
    // disallow irregular whitespace outside of strings and comments
    "no-irregular-whitespace": "error",
    "no-iterator": "error",
    // disallow labels that share a name with a variable
    // https://eslint.org/docs/latest/rules/no-label-var
    "no-label-var": "error",
    "no-labels": ["error", {
      // Necessary for breaking multi-level loops
      allowLoop: true,
      allowSwitch: false
    }],
    // disallow unnecessary nested blocks
    "no-lone-blocks": "error",
    // disallow if as the only statement in an else block
    // https://eslint.org/docs/latest/rules/no-lonely-if
    "no-lonely-if": "error",
    // disallow creation of functions within loops
    "no-loop-func": "error",
    // https://eslint.org/docs/latest/rules/no-loss-of-precision
    "no-loss-of-precision": "error",
    // https://eslint.org/docs/latest/rules/no-magic-numbers
    "no-magic-numbers": ["off", {
      detectObjects: false,
      enforceConst: true,
      ignore: [],
      ignoreArrayIndexes: true
    }],
    // Disallow characters which are made with multiple code points in character class syntax
    // https://eslint.org/docs/latest/rules/no-misleading-character-class
    "no-misleading-character-class": "error",
    // disallow use of chained assignment expressions
    // https://eslint.org/docs/latest/rules/no-multi-assign
    "no-multi-assign": ["error"],
    // disallow use of multiline strings
    "no-multi-str": "error",
    // disallow negated conditions
    // https://eslint.org/docs/latest/rules/no-negated-condition
    "no-negated-condition": "off",
    // disallow nested ternary expressions
    "no-nested-ternary": "error",
    // disallow use of new operator when not part of the assignment or comparison
    "no-new": "error",
    // disallow use of new operator for Function object
    "no-new-func": "error",
    // disallow use of the Object constructor
    "no-object-constructor": "error",
    // https://eslint.org/docs/latest/rules/no-new-symbol
    "no-new-symbol": "error",
    // disallows creating new instances of String, Number, and Boolean
    "no-new-wrappers": "error",
    // https://eslint.org/docs/latest/rules/no-nonoctal-decimal-escape
    "no-nonoctal-decimal-escape": "error",
    // disallow the use of object properties of the global object (Math and JSON) as functions
    "no-obj-calls": "error",
    // disallow use of (old style) octal literals
    "no-octal": "error",
    // disallow use of octal escape sequences in string literals, such as
    // var foo = 'Copyright \251';
    "no-octal-escape": "error",
    // disallow use of unary operators, ++ and --
    // https://eslint.org/docs/latest/rules/no-plusplus
    "no-plusplus": "error",
    // https://eslint.org/docs/latest/rules/no-promise-executor-return
    "no-promise-executor-return": "error",
    // disallow usage of __proto__ property
    "no-proto": "error",
    // disallow use of Object.prototypes builtins directly
    // https://eslint.org/docs/latest/rules/no-prototype-builtins
    "no-prototype-builtins": "error",
    // disallow declaring the same variable more than once
    "no-redeclare": "error",
    // disallow multiple spaces in a regular expression literal
    "no-regex-spaces": "error",
    // https://eslint.org/docs/latest/rules/no-restricted-exports
    "no-restricted-exports": ["error", {
      restrictedNamedExports: [
        // use `export default` to provide a default export
        // For export { default } from './foo';
        // 'default',
        "then"
        // this will cause tons of confusion when your module is dynamically `import()`ed
      ]
    }],
    "no-restricted-globals": [
      "error",
      ...confusingBrowserGlobals
    ],
    // disallow specific imports
    // https://eslint.org/docs/latest/rules/no-restricted-imports
    "no-restricted-imports": ["off", {
      paths: [],
      patterns: []
    }],
    // disallow certain object properties
    // https://eslint.org/docs/latest/rules/no-restricted-properties
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
    // disallow use of assignment in return statement
    "no-return-assign": ["error", "always"],
    // disallow use of `javascript:` urls.
    "no-script-url": "error",
    // disallow self assignment
    // https://eslint.org/docs/latest/rules/no-self-assign
    "no-self-assign": ["error", {
      props: true
    }],
    // disallow comparisons where both sides are exactly the same
    "no-self-compare": "error",
    // disallow use of comma operator
    "no-sequences": "error",
    // https://eslint.org/docs/latest/rules/no-setter-return
    "no-setter-return": "error",
    // disallow declaration of variables already declared in the outer scope
    "no-shadow": ["error", {
      allow: [
        ...isInstalled("manten") ? ["test", "describe", "runTestSuite", "onFinish", "fixture"] : [],
        ...isInstalled("tasuku") ? ["task", "setTitle", "setError", "setWarning", "setStatus", "setOutput"] : []
      ]
    }],
    // disallow shadowing of names such as arguments
    "no-shadow-restricted-names": "error",
    // disallow sparse arrays
    "no-sparse-arrays": "error",
    // Disallow template literal placeholder syntax in regular strings
    // https://eslint.org/docs/latest/rules/no-template-curly-in-string
    "no-template-curly-in-string": "error",
    // disallow to use this/super before super() calling in constructors.
    // https://eslint.org/docs/latest/rules/no-this-before-super
    "no-this-before-super": "error",
    // restrict what can be thrown as an exception
    "no-throw-literal": "error",
    // disallow use of undeclared variables unless mentioned in a /*global */ block
    "no-undef": "error",
    // disallow use of undefined when initializing variables
    "no-undef-init": "error",
    // Avoid code that looks like two expressions but is actually one
    // https://eslint.org/docs/latest/rules/no-unexpected-multiline
    "no-unexpected-multiline": "error",
    // disallow unmodified conditions of loops
    // https://eslint.org/docs/latest/rules/no-unmodified-loop-condition
    "no-unmodified-loop-condition": "off",
    // disallow the use of Boolean literals in conditional expressions
    // also, prefer `a || b` over `a ? a : b`
    // https://eslint.org/docs/latest/rules/no-unneeded-ternary
    "no-unneeded-ternary": ["error", {
      defaultAssignment: false
    }],
    // disallow unreachable statements after a return, throw, continue, or break statement
    "no-unreachable": "error",
    // https://eslint.org/docs/latest/rules/no-unreachable-loop
    "no-unreachable-loop": "error",
    // disallow return/throw/break/continue inside finally blocks
    // https://eslint.org/docs/latest/rules/no-unsafe-finally
    "no-unsafe-finally": "error",
    // disallow negating the left operand of relational operators
    // https://eslint.org/docs/latest/rules/no-unsafe-negation
    "no-unsafe-negation": "error",
    // disallow usage of expressions in statement position
    "no-unused-expressions": ["error", {
      allowShortCircuit: false,
      allowTaggedTemplates: false,
      allowTernary: false
    }],
    // disallow unused labels
    // https://eslint.org/docs/latest/rules/no-unused-labels
    "no-unused-labels": "error",
    // disallow declaration of variables that are not used in the code
    "no-unused-vars": ["error", {
      args: "after-used",
      ignoreRestSiblings: true,
      vars: "all"
    }],
    // not always possible for inter-dependent functions
    "no-use-before-define": "off",
    // https://eslint.org/docs/latest/rules/no-useless-backreference
    "no-useless-backreference": "error",
    // disallow unnecessary .call() and .apply()
    "no-useless-call": "off",
    // Disallow unnecessary catch clauses
    // https://eslint.org/docs/latest/rules/no-useless-catch
    "no-useless-catch": "error",
    // disallow useless computed property keys
    // https://eslint.org/docs/latest/rules/no-useless-computed-key
    "no-useless-computed-key": "error",
    // disallow useless string concatenation
    // https://eslint.org/docs/latest/rules/no-useless-concat
    "no-useless-concat": "error",
    // disallow unnecessary constructor
    // https://eslint.org/docs/latest/rules/no-useless-constructor
    "no-useless-constructor": "error",
    // disallow unnecessary string escaping
    // https://eslint.org/docs/latest/rules/no-useless-escape
    "no-useless-escape": "error",
    // disallow renaming import, export, and destructured assignments to the same name
    // https://eslint.org/docs/latest/rules/no-useless-rename
    "no-useless-rename": ["error", {
      ignoreDestructuring: false,
      ignoreExport: false,
      ignoreImport: false
    }],
    // disallow redundant return; keywords
    // https://eslint.org/docs/latest/rules/no-useless-return
    "no-useless-return": "error",
    // require let or const instead of var
    "no-var": "error",
    // disallow use of void operator
    // https://eslint.org/docs/latest/rules/no-void
    "no-void": "error",
    // disallow usage of configurable warning terms in comments: e.g. todo
    "no-warning-comments": ["off", {
      location: "start",
      terms: ["todo", "fixme", "xxx"]
    }],
    // disallow use of the with statement
    "no-with": "error",
    // require method and property shorthand syntax for object literals
    // https://eslint.org/docs/latest/rules/object-shorthand
    "object-shorthand": ["error", "always", {
      ignoreConstructors: false
    }],
    // allow just one var statement per function
    "one-var": ["error", "never"],
    // require assignment operator shorthand where possible or prohibit it entirely
    // https://eslint.org/docs/latest/rules/operator-assignment
    "operator-assignment": ["error", "always"],
    // suggest using arrow functions as callbacks
    "prefer-arrow-callback": ["error", {
      allowNamedFunctions: false,
      allowUnboundThis: true
    }],
    // suggest using of const declaration for variables that are never modified after declared
    "prefer-const": ["error", {
      destructuring: "any",
      ignoreReadBeforeAssign: true
    }],
    // Prefer destructuring from arrays and objects
    // https://eslint.org/docs/latest/rules/prefer-destructuring
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
    // https://eslint.org/docs/latest/rules/prefer-exponentiation-operator
    "prefer-exponentiation-operator": "error",
    // Suggest using named capture group in regular expression
    // https://eslint.org/docs/latest/rules/prefer-named-capture-group
    "prefer-named-capture-group": "off",
    // disallow parseInt() in favor of binary, octal, and hexadecimal literals
    // https://eslint.org/docs/latest/rules/prefer-numeric-literals
    "prefer-numeric-literals": "error",
    // Prefer use of an object spread over Object.assign
    // https://eslint.org/docs/latest/rules/prefer-object-spread
    "prefer-object-spread": "error",
    // require using Error objects as Promise rejection reasons
    // https://eslint.org/docs/latest/rules/prefer-promise-reject-errors
    "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],
    // suggest using Reflect methods where applicable
    // https://eslint.org/docs/latest/rules/prefer-reflect
    "prefer-reflect": "off",
    // https://eslint.org/docs/latest/rules/prefer-regex-literals
    "prefer-regex-literals": ["error", {
      disallowRedundantWrapping: true
    }],
    // https://eslint.org/docs/latest/rules/prefer-rest-params
    "prefer-rest-params": "off",
    // suggest using the spread operator instead of .apply()
    // https://eslint.org/docs/latest/rules/prefer-spread
    "prefer-spread": "error",
    // suggest using template literals instead of string concatenation
    // https://eslint.org/docs/latest/rules/prefer-template
    "prefer-template": "error",
    // require use of the second argument for parseInt()
    radix: "error",
    // Disallow assignments that can lead to race conditions due to usage of await or yield
    // https://eslint.org/docs/latest/rules/require-atomic-updates
    // note: not enabled because it is very buggy
    "require-atomic-updates": "off",
    // require `await` in `async function` (note: this is a horrible rule that should never be used)
    // https://eslint.org/docs/latest/rules/require-await
    "require-await": "off",
    // Enforce the use of u flag on RegExp
    // https://eslint.org/docs/latest/rules/require-unicode-regexp
    "require-unicode-regexp": "off",
    // disallow generator functions that do not have yield
    // https://eslint.org/docs/latest/rules/require-yield
    "require-yield": "error",
    // import sorting
    // https://eslint.org/docs/latest/rules/sort-imports
    "sort-imports": ["off", {
      ignoreCase: false,
      ignoreDeclarationSort: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
    }],
    // requires object keys to be sorted
    "sort-keys": ["off", "asc", {
      caseSensitive: false,
      natural: true
    }],
    // sort variables within the same declaration block
    "sort-vars": "off",
    // require a Symbol description
    // https://eslint.org/docs/latest/rules/symbol-description
    "symbol-description": "error",
    // require or disallow the Unicode Byte Order Mark
    // https://eslint.org/docs/latest/rules/unicode-bom
    "unicode-bom": ["error", "never"],
    // disallow comparisons with the value NaN
    "use-isnan": "error",
    // ensure that the results of typeof are compared against a valid string
    // https://eslint.org/docs/latest/rules/valid-typeof
    "valid-typeof": ["error", { requireStringLiterals: true }],
    // requires to declare all vars on top of their containing scope
    "vars-on-top": "error",
    // require or disallow Yoda conditions
    yoda: "error"
  }
});
const serviceWorkers = defineConfig({
  files: ["**/*.sw.js"],
  languageOptions: {
    globals: globals.serviceworker
  },
  rules: {
    "no-restricted-globals": [
      "error",
      ...confusingBrowserGlobals.filter((variable) => variable !== "self")
    ]
  }
});
const base$1 = [
  // https://github.com/eslint/eslint/blob/v8.55.0/packages/js/src/configs/eslint-recommended.js
  defineConfig({
    rules: {
      ...js.configs.recommended.rules,
      /**
       * Deprecated rules enabled by recommended
       */
      "no-mixed-spaces-and-tabs": "off",
      "no-extra-semi": "off"
    }
  }),
  baseConfig,
  serviceWorkers
];

const eslintComments = defineConfig({
  plugins: {
    "@eslint-community/eslint-comments": eslintCommentsPlugin
  },
  rules: {
    ...eslintCommentsPlugin.configs.recommended.rules,
    // Deprecated in favor of official reportUnusedDisableDirectives
    // https://github.com/eslint-community/eslint-plugin-eslint-comments/issues/133
    "@eslint-community/eslint-comments/no-unused-enable": "off"
  }
});

const stylistic = defineConfig({
  plugins: {
    "@stylistic": stylisticPlugin
  },
  rules: {
    // https://eslint.style/rules/default/array-bracket-newline
    "@stylistic/array-bracket-newline": ["error", "consistent"],
    // https://eslint.style/rules/default/array-bracket-spacing
    "@stylistic/array-bracket-spacing": ["error", "never"],
    // https://eslint.style/rules/default/array-element-newline
    "@stylistic/array-element-newline": ["error", "consistent"],
    // require parens in arrow function arguments
    // https://eslint.style/rules/default/arrow-parens
    "@stylistic/arrow-parens": ["error", "as-needed", { requireForBlockBody: true }],
    // require space before/after arrow function's arrow
    // https://eslint.style/rules/default/arrow-spacing
    "@stylistic/arrow-spacing": ["error", {
      after: true,
      before: true
    }],
    // https://eslint.style/rules/default/block-spacing
    "@stylistic/block-spacing": ["error", "always"],
    // enforce one true brace style
    "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
    // require trailing commas in multiline object literals
    "@stylistic/comma-dangle": ["error", {
      arrays: "always-multiline",
      exports: "always-multiline",
      functions: "always-multiline",
      imports: "always-multiline",
      objects: "always-multiline"
    }],
    // enforce spacing before and after comma
    "@stylistic/comma-spacing": ["error", {
      after: true,
      before: false
    }],
    // enforce one true comma style
    "@stylistic/comma-style": ["error", "last", {
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
    // disallow padding inside computed properties
    "@stylistic/computed-property-spacing": ["error", "never"],
    // https://eslint.style/rules/default/dot-location
    "@stylistic/dot-location": ["error", "property"],
    // enforce newline at the end of file, with no multiple empty lines
    "@stylistic/eol-last": ["error", "always"],
    // enforce spacing between functions and their invocations
    // https://eslint.style/rules/default/func-call-spacing
    "@stylistic/func-call-spacing": ["error", "never"],
    // https://eslint.style/rules/default/function-call-argument-newline
    "@stylistic/function-call-argument-newline": ["error", "consistent"],
    // enforce consistent line breaks inside function parentheses
    // https://eslint.style/rules/default/function-paren-newline
    "@stylistic/function-paren-newline": ["error", "consistent"],
    // enforce the spacing around the * in generator functions
    // https://eslint.style/rules/default/generator-star-spacing
    "@stylistic/generator-star-spacing": ["error", {
      after: true,
      before: false
    }],
    // Enforce the location of arrow function bodies with implicit returns
    // https://eslint.style/rules/default/implicit-arrow-linebreak
    "@stylistic/implicit-arrow-linebreak": ["error", "beside"],
    // this option sets a specific tab width for your code
    // https://eslint.style/rules/default/indent
    "@stylistic/indent": ["error", "tab", {
      ArrayExpression: 1,
      CallExpression: {
        arguments: 1
      },
      flatTernaryExpressions: false,
      // MemberExpression: null,
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
        // Don't fix indentations in template literals
        "TemplateLiteral > *",
        // From https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
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
    // enforces spacing between keys and values in object literal properties
    "@stylistic/key-spacing": ["error", {
      afterColon: true,
      beforeColon: false
    }],
    // require a space before & after certain keywords
    "@stylistic/keyword-spacing": ["error", {
      after: true,
      before: true,
      overrides: {
        case: { after: true },
        return: { after: true },
        throw: { after: true }
      }
    }],
    // enforce consistent 'LF' or 'CRLF' as linebreaks
    // https://eslint.style/rules/default/linebreak-style
    "@stylistic/linebreak-style": ["error", "unix"],
    // enforces empty lines around comments
    "@stylistic/lines-around-comment": "off",
    // require or disallow an empty line between class members
    // https://eslint.style/rules/default/lines-between-class-members
    "@stylistic/lines-between-class-members": ["error", "always", { exceptAfterSingleLine: false }],
    // specify the maximum length of a line in your program
    // https://eslint.style/rules/default/max-len
    "@stylistic/max-len": ["error", 100, 2, {
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreUrls: true
    }],
    // https://eslint.style/rules/default/max-statements-per-line
    "@stylistic/max-statements-per-line": ["warn", { max: 1 }],
    // https://eslint.style/rules/default/multiline-ternary
    "@stylistic/multiline-ternary": ["error", "always-multiline"],
    // disallow the omission of parentheses when invoking a constructor with no arguments
    // https://eslint.style/rules/default/new-parens
    "@stylistic/new-parens": "error",
    // enforces new line after each method call in the chain to make it
    // more readable and easy to maintain
    // https://eslint.style/rules/default/newline-per-chained-call
    "@stylistic/newline-per-chained-call": ["error", { ignoreChainWithDepth: 4 }],
    // disallow arrow functions where they could be confused with comparisons
    // https://eslint.style/rules/default/no-confusing-arrow
    "@stylistic/no-confusing-arrow": ["error", {
      allowParens: true
    }],
    // disallow unnecessary parentheses
    // https://eslint.style/rules/default/no-extra-parens
    "@stylistic/no-extra-parens": ["off", "all", {
      conditionalAssign: true,
      // delegate to eslint-plugin-react
      enforceForArrowConditionals: false,
      ignoreJSX: "all",
      nestedBinaryExpressions: false,
      returnAssign: false
    }],
    // disallow unnecessary semicolons
    "@stylistic/no-extra-semi": "error",
    // disallow the use of leading or trailing decimal points in numeric literals
    "@stylistic/no-floating-decimal": "error",
    // disallow un-paren'd mixes of different operators
    // https://eslint.style/rules/default/no-mixed-operators
    "@stylistic/no-mixed-operators": ["error", {
      allowSamePrecedence: false,
      // the list of arithmetic groups disallows mixing `%` and `**`
      // with other arithmetic operators.
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
    // disallow mixed spaces and tabs for indentation
    "@stylistic/no-mixed-spaces-and-tabs": "error",
    // disallow use of multiple spaces
    "@stylistic/no-multi-spaces": ["error", {
      ignoreEOLComments: false
    }],
    // disallow multiple empty lines, only one newline at the end, and no new lines at the beginning
    // https://eslint.style/rules/default/no-multiple-empty-lines
    "@stylistic/no-multiple-empty-lines": ["error", {
      max: 1,
      maxBOF: 0,
      maxEOF: 0
    }],
    // disallow trailing whitespace at the end of lines
    "@stylistic/no-trailing-spaces": ["error", {
      ignoreComments: false,
      skipBlankLines: false
    }],
    // disallow whitespace before properties
    // https://eslint.style/rules/default/no-whitespace-before-property
    "@stylistic/no-whitespace-before-property": "error",
    // enforce the location of single-line statements
    // https://eslint.style/rules/default/nonblock-statement-body-position
    "@stylistic/nonblock-statement-body-position": ["error", "beside", {
      overrides: {}
    }],
    // enforce line breaks between braces
    // https://eslint.style/rules/default/object-curly-newline
    "@stylistic/object-curly-newline": ["error", {
      ExportDeclaration: {
        consistent: true,
        minProperties: 3,
        multiline: true
      },
      ImportDeclaration: {
        consistent: true,
        minProperties: 3,
        multiline: true
      },
      ObjectExpression: {
        consistent: true,
        minProperties: 3,
        multiline: true
      },
      ObjectPattern: {
        consistent: true,
        minProperties: 3,
        multiline: true
      }
    }],
    // require padding inside curly braces
    "@stylistic/object-curly-spacing": ["error", "always"],
    // enforce "same line" or "multiple line" on object properties.
    // https://eslint.style/rules/default/object-property-newline
    "@stylistic/object-property-newline": ["error", {
      allowAllPropertiesOnSameLine: false
    }],
    // require a newline around variable declaration
    // https://eslint.style/rules/default/one-var-declaration-per-line
    "@stylistic/one-var-declaration-per-line": ["error", "always"],
    // Requires operator at the beginning of the line in multiline statements
    // https://eslint.style/rules/default/operator-linebreak
    "@stylistic/operator-linebreak": ["error", "before", {
      overrides: {
        "=": "none"
      }
    }],
    // disallow padding within blocks
    "@stylistic/padded-blocks": ["error", {
      blocks: "never",
      classes: "never",
      switches: "never"
    }, {
      allowSingleLineBlocks: true
    }],
    // Require or disallow padding lines between statements
    // https://eslint.style/rules/default/padding-line-between-statements
    "@stylistic/padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        next: "*",
        prev: "directive"
      }
    ],
    // require quotes around object literal property names
    // https://eslint.style/rules/default/quote-props.html
    "@stylistic/quote-props": ["error", "as-needed", {
      keywords: false,
      numbers: false,
      unnecessary: true
    }],
    // specify whether double or single quotes should be used
    "@stylistic/quotes": ["error", "single", { avoidEscape: true }],
    // enforce spacing between object rest-spread
    // https://eslint.style/rules/default/rest-spread-spacing
    "@stylistic/rest-spread-spacing": ["error", "never"],
    // require or disallow use of semicolons instead of ASI
    "@stylistic/semi": ["error", "always"],
    // enforce spacing before and after semicolons
    "@stylistic/semi-spacing": ["error", {
      after: true,
      before: false
    }],
    // Enforce location of semicolons
    // https://eslint.style/rules/default/semi-style
    "@stylistic/semi-style": ["error", "last"],
    // require or disallow space before blocks
    "@stylistic/space-before-blocks": "error",
    // require or disallow space before function opening parenthesis
    // https://eslint.style/rules/default/space-before-function-paren
    "@stylistic/space-before-function-paren": ["error", {
      anonymous: "always",
      asyncArrow: "always",
      named: "never"
    }],
    // require or disallow spaces inside parentheses
    "@stylistic/space-in-parens": ["error", "never"],
    // require spaces around operators
    "@stylistic/space-infix-ops": "error",
    // Require or disallow spaces before/after unary operators
    // https://eslint.style/rules/default/space-unary-ops
    "@stylistic/space-unary-ops": ["error", {
      nonwords: false,
      overrides: {},
      words: true
    }],
    // require or disallow a space immediately following the // or /* in a comment
    // https://eslint.style/rules/default/spaced-comment
    "@stylistic/spaced-comment": ["error", "always", {
      block: {
        // space here to support sprockets directives and flow comment types
        balanced: true,
        exceptions: ["-", "+"],
        markers: ["=", "!", ":", "::"]
      },
      line: {
        exceptions: ["-", "+"],
        markers: ["=", "!", "/"]
        // space here to support sprockets directives, slash for TS /// comments
      }
    }],
    // Enforce spacing around colons of switch statements
    // https://eslint.style/rules/default/switch-colon-spacing
    "@stylistic/switch-colon-spacing": ["error", {
      after: true,
      before: false
    }],
    // enforce usage of spacing in template strings
    // https://eslint.style/rules/default/template-curly-spacing
    "@stylistic/template-curly-spacing": "error",
    // Require or disallow spacing between template tags and their literals
    // https://eslint.style/rules/default/template-tag-spacing
    "@stylistic/template-tag-spacing": ["error", "never"],
    // require immediate function invocation to be wrapped in parentheses
    // https://eslint.style/rules/default/wrap-iife.html
    "@stylistic/wrap-iife": ["error", "inside", { functionPrototypeMethods: false }],
    // enforce spacing around the * in yield* expressions
    // https://eslint.style/rules/default/yield-star-spacing
    "@stylistic/yield-star-spacing": ["error", "after"]
  }
});

const pkgMapsResolver = url.fileURLToPath(
  undefined("#pkg-maps-resolver")
);
const importsConfig = defineConfig({
  plugins: {
    import: importPlugin
  },
  settings: {
    "import/ignore": [
      "node_modules",
      "\\.(css|svg|json)$"
    ],
    "import/resolver": {
      node: {},
      [pkgMapsResolver]: {}
    }
  },
  rules: {
    ...importPlugin.configs.recommended.rules,
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
    // Always require a file extension except from packages
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
        "**/*.config.{js,cjs,mjs,ts,cts,mts}",
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
  }
});
const imports = [
  importsConfig,
  // Bundled files
  defineConfig({
    files: ["**/src/**/*"],
    rules: {
      // Disallow dynamic imports if compiled
      // https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-dynamic-require.md
      "import/no-dynamic-require": "error"
    }
  })
];

const noExtraneousDependenciesConfig = importsConfig.rules["import/no-extraneous-dependencies"][1];
const typescript = [
  defineConfig({
    files: ["**/*.{ts,tsx,mts,cts}"],
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    languageOptions: {
      parser: tsParser
    },
    settings: {
      ...importPlugin.configs.typescript.settings,
      "import/resolver": {
        ...importPlugin.configs.typescript.settings["import/resolver"],
        // this loads <rootdir>/tsconfig.json to eslint
        typescript: {}
      }
    },
    /**
     * Slow and cant disable for markdown files
     * Was only using for @typescript-eslint/return-await
     *
     * Let's see if:
     *  - We can detect tsconfig.json and only enable this for the files in `include`
     *  - We can generate a fallback tsconfig.json that just has strict mode enabled
     */
    // parserOptions: {
    // 	// Gets closest tsconfig.json
    // 	project: '**/tsconfig.json',
    // },
    rules: {
      ...tsPlugin.configs["eslint-recommended"].overrides[0].rules,
      ...tsPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      /**
       * Suddenly requires parserServices to be generated
       *   Error while loading rule '@typescript-eslint/consistent-type-assertions':
       *     You have used a rule which requires parserServices to be generated.
       *     You must therefore provide a value for the "parserOptions.project"
       *     property for @typescript-eslint/parser.
       * https://github.com/typescript-eslint/typescript-eslint/pull/6885#issuecomment-1701892123
       */
      // '@typescript-eslint/consistent-type-assertions': 'error',
      "@stylistic/member-delimiter-style": "error",
      "@typescript-eslint/no-shadow": baseConfig.rules["no-shadow"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ...baseConfig.rules["no-unused-vars"][1],
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          /**
           * TypeScript ignores any variables that are prefixed with _
           * https://github.com/microsoft/TypeScript/pull/9464
           */
          varsIgnorePattern: "^_"
        }
      ],
      // Function expression can be used to type a function
      "func-style": "off",
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
      "no-shadow": "off",
      "prefer-rest-params": "off",
      // TS disallows .ts extension
      // https://github.com/Microsoft/TypeScript/issues/27481
      "import/extensions": ["error", "ignorePackages", {
        ts: "never",
        tsx: "never",
        cts: "never",
        mts: "never"
      }],
      // Always require await when returning promise
      // https://github.com/goldbergyoni/nodebestpractices/blob/5ba537d/sections/errorhandling/returningpromises.md
      // '@typescript-eslint/return-await': ['error', 'always'],
      "import/no-extraneous-dependencies": ["error", {
        ...noExtraneousDependenciesConfig,
        devDependencies: noExtraneousDependenciesConfig.devDependencies.map(
          (pattern) => pattern.replace(".js", ".{js,ts}")
        )
      }],
      // Not always possible to destructue at top-level when the variable is ambigious
      "unicorn/consistent-destructuring": "off",
      // Allow functions to be passed in only in TS because it's easy to see their types
      "unicorn/no-array-callback-reference": "off",
      // Could be used to pass in an explicit `undefined` to a required parameter
      "unicorn/no-useless-undefined": "off"
    }
  })
];

const regexp = [defineConfig({
  plugins: {
    regexp: regexpPlugin
  },
  rules: regexpPlugin.configs.recommended.rules
})];

const getNodeVersion = () => {
  const foundNvmrc = index$1.findUpSync(".nvmrc");
  if (foundNvmrc) {
    let version = fs.readFileSync(foundNvmrc, "utf8");
    version = version.trim();
    if (version.startsWith("v")) {
      version = version.slice(1);
    }
    return version;
  }
  return "18.19.0";
};
const foundPackageJson = readPackageUp.readPackageUpSync();
const hasCli = foundPackageJson && "bin" in foundPackageJson.packageJson;
const [
  ambiguious,
  mjs,
  cjs
] = nodePlugin.configs["flat/mixed-esm-and-cjs"];
const cjsSupport = defineConfig({
  ...cjs,
  files: [...cjs.files, "**/*.cts"]
});
const node = (options) => {
  const config = [
    cjsSupport
  ];
  if (options?.node) {
    config.push(
      /**
       * Overwrite eslint-plugin-n/recommended's CommonJS configuration in parserOptions
       * because often times, ESM is compiled to CJS at runtime using tools like tsx:
       * https://github.com/eslint-community/eslint-plugin-n/blob/15.5.1/lib/configs/recommended-script.js#L14-L18
       */
      defineConfig({
        ...ambiguious,
        files: [...ambiguious.files, "**/*.ts"],
        languageOptions: {
          ...ambiguious.languageOptions,
          sourceType: "module"
        }
      }),
      defineConfig({
        ...mjs,
        files: [...mjs.files, "**/*.mts"]
      }),
      defineConfig({
        ...cjs,
        files: [...cjs.files, "**/*.cts"]
      }),
      defineConfig({
        plugins: {
          n: nodePlugin
        },
        settings: {
          node: {
            version: `>=${getNodeVersion()}`
          }
        },
        rules: {
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/file-extension-in-import.md
          // TODO: Defer to import plugin
          "n/file-extension-in-import": ["error", "always", {
            // TypeScript doesn't allow extensions https://github.com/Microsoft/TypeScript/issues/27481
            // Use .js instead
            ".ts": "never",
            ".tsx": "never"
          }],
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/global-require.md
          "n/global-require": "error",
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-mixed-requires.md
          "n/no-mixed-requires": ["error", {
            allowCall: true,
            grouping: true
          }],
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-new-require.md
          "n/no-new-require": "error",
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-path-concat.md
          "n/no-path-concat": "error",
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/buffer.md
          "n/prefer-global/buffer": ["error", "always"],
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/console.md
          "n/prefer-global/console": ["error", "always"],
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/process.md
          "n/prefer-global/process": ["error", "always"],
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-decoder.md
          "n/prefer-global/text-decoder": ["error", "always"],
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-encoder.md
          "n/prefer-global/text-encoder": ["error", "always"],
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url.md
          "n/prefer-global/url": ["error", "always"],
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url-search-params.md
          "n/prefer-global/url-search-params": ["error", "always"],
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/dns.md
          "n/prefer-promises/dns": "error",
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/fs.md
          "n/prefer-promises/fs": "error",
          // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-missing-import.md
          // Defer to import plugin
          "n/no-missing-import": "off",
          "n/no-missing-require": "off",
          /**
           * 1. Doesn't support import maps
           * 2. Disabling in favor of https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md
           */
          "n/no-extraneous-import": "off"
        }
      })
    );
  }
  if (hasCli) {
    config.push(
      defineConfig({
        files: [
          "**/cli.{js,ts}",
          "**/cli/**/*.{js,ts}"
        ],
        rules: {
          "n/no-process-exit": "off"
        }
      })
    );
  }
  return config;
};

const promise = [
  defineConfig({
    plugins: {
      promise: promisePlugin
    },
    rules: promisePlugin.configs.recommended.rules
  }),
  defineConfig({
    rules: {
      "promise/always-return": "off",
      "promise/catch-or-return": ["error", {
        allowThen: true
      }]
    }
  })
];

const jest = isInstalled("jest") ? defineConfig({
  files: ["**/{test,tests}/*"],
  languageOptions: {
    globals: globals.jest
  }
}) : void 0;

const [, baseMdSubfiles] = markdownPlugin.configs.recommended.overrides;
const markdown = (options) => [
  defineConfig({
    files: ["**/*.md"],
    plugins: {
      markdown: markdownPlugin
    },
    processor: {
      name: "markdown/markdown",
      ...markdownPlugin.processors.markdown
    }
  }),
  defineConfig({
    files: ["**/*.md/**"],
    languageOptions: {
      parserOptions: baseMdSubfiles.parserOptions
    },
    rules: baseMdSubfiles.rules
  }),
  defineConfig({
    files: ["**/*.md/*.{js,jsx,ts,tsx,vue}"],
    rules: {
      "import/extensions": "off",
      "import/no-extraneous-dependencies": "off",
      "import/no-unresolved": "off",
      "no-console": "off",
      "no-new": "off",
      // Can be snippets that don't fully work
      "no-undef": "off",
      "n/shebang": "off",
      // Allow unused expressions like: argv.command // => "install" (string)
      "no-unused-expressions": "off",
      "unicorn/filename-case": "off",
      // Loose on example code
      "unicorn/no-array-reduce": "off",
      "unicorn/prefer-object-from-entries": "off",
      // Style
      "@stylistic/indent": ["error", 4],
      "@stylistic/semi": ["error", "never"],
      "@stylistic/comma-dangle": ["error", "never"]
    }
  }),
  defineConfig({
    files: ["**/*.md/*.{js,jsx,vue}"],
    rules: {
      "no-unused-vars": "warn"
    }
  }),
  defineConfig({
    files: ["**/*.md/*.{jsx,tsx}"],
    rules: {
      "react/jsx-indent-props": ["error", 4],
      "react/jsx-no-undef": "off",
      "react/react-in-jsx-scope": "off"
    }
  }),
  ...options?.vue ? [defineConfig({
    files: ["**/*.md/*.vue"],
    rules: {
      "vue/html-indent": ["error", 4],
      "vue/no-undef-components": "warn",
      "vue/require-v-for-key": "off"
    }
  })] : [],
  defineConfig({
    files: ["**/*.md/*.{ts,tsx}"],
    rules: {
      "@stylistic/member-delimiter-style": [
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
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }),
  defineConfig({
    files: ["**/*.md/*.{json,json5}"],
    rules: {
      "jsonc/indent": ["error", 4],
      "unicorn/filename-case": "off"
    }
  })
];

const [base] = jsoncPlugin.configs.base.overrides;
const json = [
  defineConfig({
    files: ["**/*.{json,json5,jsonc}"],
    plugins: {
      jsonc: jsoncPlugin
    },
    languageOptions: {
      parser: jsoncPlugin
    },
    rules: {
      ...base.rules,
      "jsonc/indent": ["error", "tab"],
      "jsonc/key-spacing": [
        "error",
        {
          afterColon: true,
          beforeColon: false,
          mode: "strict"
        }
      ],
      "jsonc/object-property-newline": "error"
    }
  }),
  defineConfig({
    files: ["**/package.json"],
    rules: {
      "jsonc/sort-keys": [
        "error",
        {
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
            "engines",
            "peerDependencies",
            "peerDependenciesMeta",
            "dependencies",
            "optionalDependencies",
            "devDependencies",
            "bundledDependencies",
            "bundleDependencies",
            "overrides",
            "eslintConfig"
          ],
          pathPattern: "^$"
        },
        {
          order: { type: "asc" },
          pathPattern: "^(?:dev|peer|optional|bundled)?Dependencies$"
        }
      ]
    }
  }),
  defineConfig({
    files: ["**/tsconfig.json"],
    rules: jsoncPlugin.configs["recommended-with-jsonc"].rules
  })
];

const noUseExtendNative = [
  defineConfig({
    plugins: {
      "no-use-extend-native": noUseExtendNativePlugin
    },
    rules: noUseExtendNativePlugin.configs.recommended.rules
  })
];

const unicorn = [
  defineConfig({
    plugins: {
      unicorn: unicornPlugin
    },
    rules: {
      ...unicornPlugin.configs.recommended.rules,
      // Disable in favor of eslint-plugin-regexp
      "unicorn/better-regex": "off",
      // Had some test files where I was creating inline functions within a test
      // Might make sense to enable this and turn this off for test/
      "unicorn/consistent-function-scoping": "off",
      "unicorn/no-array-for-each": "off",
      /**
       * For-of + iterators currently requires transpilation:
       * https://www.typescriptlang.org/tsconfig#downlevelIteration
       *
       * Given this cost, it doesn't make sense to use instead of for-loops yet
       */
      "unicorn/no-for-loop": "off",
      // Conflicts with eslint-plugin-n/no-deprecated-api
      // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-deprecated-api.md
      "unicorn/no-new-buffer": "off",
      // Too many cases where 3rd party library expects null
      "unicorn/no-null": "off",
      // Conflicts with eslint-plugin-n/no-process-exit
      // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-process-exit.md
      "unicorn/no-process-exit": "off",
      // ts-node can't load TypeScript's compliation of export-from
      // https://github.com/privatenumber/esbuild-loader/issues/232#issuecomment-998487005
      // Disable even warnings because of autofix
      "unicorn/prefer-export-from": ["off", {
        ignoreUsedVariables: true
      }],
      // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1273#issuecomment-1069506684
      "unicorn/prefer-json-parse-buffer": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prefer-node-protocol": "off",
      // Good rule and would like warning but no autofix
      // Some low level libraries that compile using babel would prefer to use
      // Array.from
      "unicorn/prefer-spread": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/prefer-top-level-await": "off",
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/898fcb4/docs/rules/prevent-abbreviations.md
      "unicorn/prevent-abbreviations": ["error", {
        // exact-match
        allowList: {
          // for-loop index
          i: true,
          j: true
        },
        // case insensitive and matches substrings
        replacements: {
          args: false,
          dev: false,
          dist: false,
          env: false,
          pkg: false,
          prop: false,
          props: false,
          ref: false,
          src: false
        }
      }],
      /**
       * Too many false positives.
       *
       * It changed the formatting of inline snapshots in tests
       */
      "unicorn/template-indent": "off",
      // Disabled in favor of
      // https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/no-unlimited-disable.html
      "unicorn/no-abusive-eslint-disable": "off"
    }
  })
];

const tsconfig = getTsconfig.getTsconfig();
const jsx = tsconfig?.config.compilerOptions?.jsx;
const autoJsx = jsx === "react-jsx" || jsx === "react-jsxdev";
const react = [
  // https://github.com/yannickcr/eslint-plugin-react/blob/c8917b0/index.js
  defineConfig({
    plugins: {
      react: reactPlugin
    },
    languageOptions: {
      parserOptions: reactPlugin.configs.recommended.parserOptions
    },
    rules: reactPlugin.configs.recommended.rules,
    settings: {
      react: {
        version: "detect"
      }
    }
  }),
  // React automatically imported in JSX files
  ...autoJsx ? [defineConfig({
    languageOptions: {
      parserOptions: reactPlugin.configs["jsx-runtime"].parserOptions
    },
    rules: reactPlugin.configs["jsx-runtime"].rules
  })] : [],
  defineConfig({
    plugins: {
      "react-hooks": reactHooksPlugin
    },
    rules: reactHooksPlugin.configs.recommended.rules
  }),
  defineConfig({
    files: ["**/*.{jsx,tsx}"],
    rules: {
      // https://eslint.org/docs/latest/rules/jsx-quotes
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
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
  })
];

const vue3Rules = {
  ...vuePlugin.configs.base.rules,
  ...vuePlugin.configs["vue3-essential"].rules,
  ...vuePlugin.configs["vue3-strongly-recommended"].rules,
  ...vuePlugin.configs["vue3-recommended"].rules
};
const detectAutoImport = () => {
  if (!isInstalled("unplugin-auto-import")) {
    return {};
  }
  return Object.fromEntries(
    [
      "vue",
      "vue-router",
      "@vueuse/core",
      "@vueuse/head"
    ].flatMap((moduleName) => isInstalled(moduleName) ? getExports(moduleName).map(
      (exportName) => [exportName, "readonly"]
    ) : [])
  );
};
const detectAutoImportComponents = () => {
  const components = [];
  if (isInstalled("vitepress")) {
    components.push(
      "content",
      "client-only",
      "outbound-link"
    );
  }
  const componentsPath = "./src/components";
  if (isInstalled("unplugin-vue-components") && fs$1.existsSync(componentsPath)) {
    const files = fs$1.readdirSync(componentsPath);
    const componentFiles = files.filter((filename) => filename.endsWith(".vue")).map((filename) => filename.replace(".vue", ""));
    components.push(...componentFiles);
  }
  if (isInstalled("unplugin-icons")) {
    components.push("icon-*");
  }
  return components;
};
const vue = [
  defineConfig({
    files: ["**/*.vue"],
    plugins: {
      vue: vuePlugin
    },
    processor: vuePlugin.processors[".vue"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...vuePlugin.environments["setup-compiler-macros"].globals,
        // Types incorrect: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/67852
        ...detectAutoImport()
      },
      parser: vueParser,
      parserOptions: {
        // https://github.com/vuejs/vue-eslint-parser#parseroptionsparser
        parser: {
          ts: "@typescript-eslint/parser"
        }
      }
    },
    rules: {
      ...vue3Rules,
      // For Vue 2
      // 'vue/no-deprecated-slot-attribute': ['error'],
      // 'vue/no-deprecated-slot-scope-attribute': ['error'],
      // 'vue/no-deprecated-scope-attribute': ['error'],
      "unicorn/filename-case": ["error", {
        case: "pascalCase"
      }],
      "vue/html-indent": ["error", "tab"],
      "vue/multi-word-component-names": "off",
      "vue/no-undef-components": ["error", {
        ignorePatterns: [
          "router-view",
          "router-link",
          ...detectAutoImportComponents()
        ]
      }],
      // Deprecated
      "vue/component-tags-order": "off",
      "vue/block-order": ["error", {
        order: [
          "script[setup]",
          ["script", "template"],
          "style"
        ]
      }]
    }
  })
];

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var config = {};

Object.defineProperty(config, "__esModule", { value: true });
config.USE_IMPLICIT = config.USE_EXPLICIT = config.USE_ARROW_WHEN_SINGLE_RETURN = config.USE_ARROW_WHEN_FUNCTION = config.DEFAULT_OPTIONS = void 0;
config.DEFAULT_OPTIONS = {
    allowNamedFunctions: false,
    classPropertiesAllowed: false,
    disallowPrototype: false,
    returnStyle: 'unchanged',
    singleReturnOnly: false,
};
config.USE_ARROW_WHEN_FUNCTION = 'Prefer using arrow functions over plain functions';
config.USE_ARROW_WHEN_SINGLE_RETURN = 'Prefer using arrow functions when the function contains only a return';
config.USE_EXPLICIT = 'Prefer using explicit returns when the arrow function contain only a return';
config.USE_IMPLICIT = 'Prefer using implicit returns when the arrow function contain only a return';

var preferArrowFunctions = {};

Object.defineProperty(preferArrowFunctions, "__esModule", { value: true });
var config_1$1 = config;
preferArrowFunctions.default = {
    meta: {
        docs: {
            category: 'emcascript6',
            description: 'prefer arrow functions',
            recommended: false,
        },
        fixable: 'code',
        schema: [
            {
                additionalProperties: false,
                properties: {
                    allowNamedFunctions: { type: 'boolean' },
                    classPropertiesAllowed: { type: 'boolean' },
                    disallowPrototype: { type: 'boolean' },
                    returnStyle: {
                        default: config_1$1.DEFAULT_OPTIONS.returnStyle,
                        pattern: '^(explicit|implicit|unchanged)$',
                        type: 'string',
                    },
                    singleReturnOnly: { type: 'boolean' },
                },
                type: 'object',
            },
        ],
    },
    create: function (context) {
        var options = context.options[0] || {};
        var getOption = function (name) {
            return typeof options[name] !== 'undefined'
                ? options[name]
                : config_1$1.DEFAULT_OPTIONS[name];
        };
        var allowNamedFunctions = getOption('allowNamedFunctions');
        var singleReturnOnly = getOption('singleReturnOnly');
        var classPropertiesAllowed = getOption('classPropertiesAllowed');
        var disallowPrototype = getOption('disallowPrototype');
        var returnStyle = getOption('returnStyle');
        var sourceCode = context.getSourceCode();
        var isBlockStatementWithSingleReturn = function (node) {
            return (node.body.body &&
                node.body.body.length === 1 &&
                node.body.body[0].type === 'ReturnStatement');
        };
        var isImplicitReturn = function (node) {
            return node.body && !node.body.body;
        };
        var returnsImmediately = function (node) {
            return isBlockStatementWithSingleReturn(node) || isImplicitReturn(node);
        };
        var getBodySource = function (node) {
            if (isBlockStatementWithSingleReturn(node) &&
                returnStyle !== 'explicit') {
                var returnValue = node.body.body[0].argument;
                var source = sourceCode.getText(returnValue);
                return returnValue.type === 'ObjectExpression' ? "(" + source + ")" : source;
            }
            if (isImplicitReturn(node) && returnStyle !== 'implicit') {
                return "{ return " + sourceCode.getText(node.body) + " }";
            }
            return sourceCode.getText(node.body);
        };
        var getParamsSource = function (params) {
            return params.map(function (param) { return sourceCode.getText(param); });
        };
        var getFunctionName = function (node) {
            return node && node.id && node.id.name ? node.id.name : '';
        };
        var isGenericFunction = function (node) { return Boolean(node.typeParameters); };
        var getGenericSource = function (node) { return sourceCode.getText(node.typeParameters); };
        var isAsyncFunction = function (node) { return node.async === true; };
        var isGeneratorFunction = function (node) { return node.generator === true; };
        var getReturnType = function (node) {
            var _a;
            return node.returnType &&
                node.returnType.range && (_a = sourceCode.getText()).substring.apply(_a, node.returnType.range);
        };
        var containsToken = function (type, value, node) {
            return sourceCode
                .getTokens(node)
                .some(function (token) { return token.type === type && token.value === value; });
        };
        var containsSuper = function (node) {
            return containsToken('Keyword', 'super', node);
        };
        var containsThis = function (node) {
            return containsToken('Keyword', 'this', node);
        };
        var containsArguments = function (node) {
            return containsToken('Identifier', 'arguments', node);
        };
        var containsTokenSequence = function (sequence, node) {
            return sourceCode.getTokens(node).some(function (_, tokenIndex, tokens) {
                return sequence.every(function (_a, i) {
                    var expectedType = _a[0], expectedValue = _a[1];
                    var actual = tokens[tokenIndex + i];
                    return (actual &&
                        actual.type === expectedType &&
                        actual.value === expectedValue);
                });
            });
        };
        var containsNewDotTarget = function (node) {
            return containsTokenSequence([
                ['Keyword', 'new'],
                ['Punctuator', '.'],
                ['Identifier', 'target'],
            ], node);
        };
        var writeArrowFunction = function (node) {
            var _a = getFunctionDescriptor(node), body = _a.body, isAsync = _a.isAsync, isGeneric = _a.isGeneric, generic = _a.generic, params = _a.params, returnType = _a.returnType;
            return 'ASYNC<GENERIC>(PARAMS)RETURN_TYPE => BODY'
                .replace('ASYNC', isAsync ? 'async ' : '')
                .replace('<GENERIC>', isGeneric ? generic : '')
                .replace('BODY', body)
                .replace('RETURN_TYPE', returnType ? returnType : '')
                .replace('PARAMS', params.join(', '));
        };
        var writeArrowConstant = function (node) {
            var name = getFunctionDescriptor(node).name;
            return 'const NAME = ARROW_FUNCTION'
                .replace('NAME', name)
                .replace('ARROW_FUNCTION', writeArrowFunction(node));
        };
        var getFunctionDescriptor = function (node) {
            return {
                body: getBodySource(node),
                isAsync: isAsyncFunction(node),
                isGenerator: isGeneratorFunction(node),
                isGeneric: isGenericFunction(node),
                name: getFunctionName(node),
                generic: getGenericSource(node),
                params: getParamsSource(node.params),
                returnType: getReturnType(node),
            };
        };
        var isPrototypeAssignment = function (node) {
            return context
                .getAncestors()
                .reverse()
                .some(function (ancestor) {
                var isPropertyOfReplacementPrototypeObject = ancestor.type === 'AssignmentExpression' &&
                    ancestor.left &&
                    ancestor.left.property &&
                    ancestor.left.property.name === 'prototype';
                var isMutationOfExistingPrototypeObject = ancestor.type === 'AssignmentExpression' &&
                    ancestor.left &&
                    ancestor.left.object &&
                    ancestor.left.object.property &&
                    ancestor.left.object.property.name === 'prototype';
                return (isPropertyOfReplacementPrototypeObject ||
                    isMutationOfExistingPrototypeObject);
            });
        };
        var isWithinClassBody = function (node) {
            return context
                .getAncestors()
                .reverse()
                .some(function (ancestor) {
                return ancestor.type === 'ClassBody';
            });
        };
        var isNamed = function (node) { return node.id && node.id.name; };
        var isNamedDefaultExport = function (node) {
            return isNamed(node) && node.parent.type === 'ExportDefaultDeclaration';
        };
        var isSafeTransformation = function (node) {
            return (!isGeneratorFunction(node) &&
                !containsThis(node) &&
                !containsSuper(node) &&
                !containsArguments(node) &&
                !containsNewDotTarget(node) &&
                (!isNamed(node) || !allowNamedFunctions) &&
                (!isPrototypeAssignment() || disallowPrototype) &&
                (!singleReturnOnly ||
                    (returnsImmediately(node) && !isNamedDefaultExport(node))));
        };
        var getMessage = function (node) {
            return singleReturnOnly && returnsImmediately(node)
                ? config_1$1.USE_ARROW_WHEN_SINGLE_RETURN
                : config_1$1.USE_ARROW_WHEN_FUNCTION;
        };
        return {
            'ExportDefaultDeclaration > FunctionDeclaration': function (node) {
                if (isSafeTransformation(node)) {
                    context.report({
                        fix: function (fixer) {
                            return fixer.replaceText(node, writeArrowFunction(node) + ';');
                        },
                        message: getMessage(node),
                        node: node,
                    });
                }
            },
            ':matches(ClassProperty, MethodDefinition, Property)[key.name][value.type="FunctionExpression"][kind!=/^(get|set)$/]': function (node) {
                var propName = node.key.name;
                var functionNode = node.value;
                if (isSafeTransformation(functionNode) &&
                    (!isWithinClassBody() || classPropertiesAllowed)) {
                    context.report({
                        fix: function (fixer) {
                            return fixer.replaceText(node, isWithinClassBody()
                                ? propName + " = " + writeArrowFunction(functionNode) + ";"
                                : propName + ": " + writeArrowFunction(functionNode));
                        },
                        message: getMessage(functionNode),
                        node: functionNode,
                    });
                }
            },
            'ArrowFunctionExpression[body.type!="BlockStatement"]': function (node) {
                if (returnStyle === 'explicit' && isSafeTransformation(node)) {
                    context.report({
                        fix: function (fixer) { return fixer.replaceText(node, writeArrowFunction(node)); },
                        message: config_1$1.USE_EXPLICIT,
                        node: node,
                    });
                }
            },
            'ArrowFunctionExpression[body.body.length=1][body.body.0.type="ReturnStatement"]': function (node) {
                if (returnStyle === 'implicit' && isSafeTransformation(node)) {
                    context.report({
                        fix: function (fixer) { return fixer.replaceText(node, writeArrowFunction(node)); },
                        message: config_1$1.USE_IMPLICIT,
                        node: node,
                    });
                }
            },
            'FunctionExpression[parent.type!=/^(ClassProperty|MethodDefinition|Property)$/]': function (node) {
                if (isSafeTransformation(node)) {
                    context.report({
                        fix: function (fixer) { return fixer.replaceText(node, writeArrowFunction(node)); },
                        message: getMessage(node),
                        node: node,
                    });
                }
            },
            'FunctionDeclaration[parent.type!="ExportDefaultDeclaration"]': function (node) {
                if (isSafeTransformation(node)) {
                    context.report({
                        fix: function (fixer) {
                            return fixer.replaceText(node, writeArrowConstant(node) + ';');
                        },
                        message: getMessage(node),
                        node: node,
                    });
                }
            },
        };
    },
};

var config_1 = config;
var prefer_arrow_functions_1 = preferArrowFunctions;
var dist = {
    rules: {
        'prefer-arrow-functions': prefer_arrow_functions_1.default,
    },
    rulesConfig: {
        'prefer-arrow-functions': [2, config_1.DEFAULT_OPTIONS],
    },
};

var arrowFunctionsPlugin = /*@__PURE__*/getDefaultExportFromCjs(dist);

const arrowFunctions = defineConfig({
  plugins: {
    "prefer-arrow-functions": arrowFunctionsPlugin
  },
  rules: {
    "prefer-arrow-functions/prefer-arrow-functions": [
      "warn",
      {
        allowNamedFunctions: false,
        classPropertiesAllowed: false,
        disallowPrototype: false,
        returnStyle: "unchanged",
        singleReturnOnly: false
      }
    ]
  }
});

const pvtnbr = (options) => {
  const normalizedOptions = {
    ...options,
    node: options?.node,
    vue: options?.vue || isInstalled("vue"),
    react: options?.react || isInstalled("react")
  };
  return [
    {
      linterOptions: {
        reportUnusedDisableDirectives: true
      }
    },
    {
      ignores: [
        "**/package-lock.json",
        "{tmp,temp}/**",
        "**/*.min.js",
        "**/dist/**",
        "**/node_modules/**",
        "**/vendor/**"
      ]
    },
    ...base$1,
    eslintComments,
    ...imports,
    ...unicorn,
    ...typescript,
    stylistic,
    ...regexp,
    ...promise,
    ...node(normalizedOptions),
    ...noUseExtendNative,
    ...json,
    ...normalizedOptions.vue ? vue : [],
    ...normalizedOptions.react ? react : [],
    ...markdown(normalizedOptions),
    arrowFunctions,
    jest
  ].filter(Boolean);
};
var index = pvtnbr();

exports.default = index;
exports.defineConfig = defineConfig;
exports.pvtnbr = pvtnbr;
