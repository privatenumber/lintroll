import confusingBrowserGlobals from 'confusing-browser-globals';
import { createConfig } from '../utils/create-config.js';
import { isInstalled } from '../utils/is-installed.js';

export = createConfig({
	// https://github.com/eslint/eslint/blob/main/conf/eslint-recommended.js
	extends: 'eslint:recommended',

	env: {
		/**
		 * Globals shared across Node.js and Browser
		 * https://github.com/sindresorhus/globals/blob/main/globals.json#LL1710C3-L1710C24
		 */
		'shared-node-browser': true,
	},

	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},

	rules: {
		'accessor-pairs': 'error',

		// https://eslint.org/docs/latest/rules/array-bracket-newline
		'array-bracket-newline': ['error', 'consistent'],

		// https://eslint.org/docs/latest/rules/array-bracket-spacing
		'array-bracket-spacing': ['error', 'never'],

		// https://eslint.org/docs/latest/rules/array-callback-return
		'array-callback-return': ['error', { allowImplicit: true }],

		// https://eslint.org/docs/latest/rules/array-element-newline
		'array-element-newline': ['error', 'consistent'],

		// https://eslint.org/docs/latest/rules/arrow-body-style
		'arrow-body-style': ['error', 'as-needed'],

		// require parens in arrow function arguments
		// https://eslint.org/docs/latest/rules/arrow-parens
		'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],

		// require space before/after arrow function's arrow
		// https://eslint.org/docs/latest/rules/arrow-spacing
		'arrow-spacing': ['error', { after: true, before: true }],

		// treat var statements as if they were block scoped
		'block-scoped-var': 'error',

		// https://eslint.org/docs/latest/rules/block-spacing
		'block-spacing': ['error', 'always'],

		// enforce one true brace style
		'brace-style': ['error', '1tbs', { allowSingleLine: true }],

		// require camel case names
		camelcase: ['error', { ignoreDestructuring: false, properties: 'never' }],

		// require trailing commas in multiline object literals
		'comma-dangle': ['error', {
			arrays: 'always-multiline',
			exports: 'always-multiline',
			functions: 'always-multiline',
			imports: 'always-multiline',
			objects: 'always-multiline',
		}],

		// enforce spacing before and after comma
		'comma-spacing': ['error', { after: true, before: false }],

		// enforce one true comma style
		'comma-style': ['error', 'last', {
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
				VariableDeclaration: false,
			},
		}],

		// https://eslint.org/docs/latest/rules/complexity
		complexity: ['warn', 10],

		// disallow padding inside computed properties
		'computed-property-spacing': ['error', 'never'],

		'consistent-return': 'off',

		// verify super() callings in constructors
		'constructor-super': 'error',

		curly: 'error',

		// require default case in switch statements
		'default-case': ['error', { commentPattern: '^no default$' }],

		// https://eslint.org/docs/latest/rules/default-case-last
		'default-case-last': 'error',

		// https://eslint.org/docs/latest/rules/default-param-last
		'default-param-last': 'error',

		// https://eslint.org/docs/latest/rules/dot-location
		'dot-location': ['error', 'property'],

		'dot-notation': ['error', { allowKeywords: true }],

		// enforce newline at the end of file, with no multiple empty lines
		'eol-last': ['error', 'always'],

		// https://eslint.org/docs/latest/rules/eqeqeq
		eqeqeq: ['error', 'always', { null: 'ignore' }],

		// Enforce “for” loop update clause moving the counter in the right direction
		// https://eslint.org/docs/latest/rules/for-direction
		'for-direction': 'error',

		// enforce spacing between functions and their invocations
		// https://eslint.org/docs/latest/rules/func-call-spacing
		'func-call-spacing': ['error', 'never'],

		// requires function names to match the name of the variable or property to which they are
		// assigned
		// https://eslint.org/docs/latest/rules/func-name-matching
		'func-name-matching': ['off', 'always', {
			considerPropertyDescriptor: true,
			includeCommonJSModuleExports: false,
		}],

		// require function expressions to have a name
		// https://eslint.org/docs/latest/rules/func-names
		'func-names': 'warn',

		// https://eslint.org/docs/latest/rules/func-style
		'func-style': ['error', 'declaration', { allowArrowFunctions: true }],

		// https://eslint.org/docs/latest/rules/function-call-argument-newline
		'function-call-argument-newline': ['error', 'consistent'],

		// enforce consistent line breaks inside function parentheses
		// https://eslint.org/docs/latest/rules/function-paren-newline
		'function-paren-newline': ['error', 'consistent'],

		// enforce the spacing around the * in generator functions
		// https://eslint.org/docs/latest/rules/generator-star-spacing
		'generator-star-spacing': ['error', { after: true, before: false }],

		// Enforces that a return statement is present in property getters
		// https://eslint.org/docs/latest/rules/getter-return
		'getter-return': ['error', { allowImplicit: true }],

		// https://eslint.org/docs/latest/rules/grouped-accessor-pairs
		'grouped-accessor-pairs': ['error', 'getBeforeSet'],

		// make sure for-in loops have an if statement
		'guard-for-in': 'error',

		// https://eslint.org/docs/latest/rules/id-blacklist
		'id-blacklist': 'off',

		// disallow specified identifiers
		// https://eslint.org/docs/latest/rules/id-denylist
		'id-denylist': 'off',

		// this option enforces minimum and maximum identifier lengths
		// (variable names, property names etc.)
		'id-length': 'off',

		// require identifiers to match the provided regular expression
		'id-match': 'off',

		// Enforce the location of arrow function bodies with implicit returns
		// https://eslint.org/docs/latest/rules/implicit-arrow-linebreak
		'implicit-arrow-linebreak': ['error', 'beside'],

		// this option sets a specific tab width for your code
		// https://eslint.org/docs/latest/rules/indent
		indent: ['error', 'tab', {
			ArrayExpression: 1,
			CallExpression: {
				arguments: 1,
			},
			flatTernaryExpressions: false,
			// MemberExpression: null,
			FunctionDeclaration: {
				body: 1,
				parameters: 1,
			},
			FunctionExpression: {
				body: 1,
				parameters: 1,
			},
			ignoreComments: false,
			ignoredNodes: [
				// Don't fix indentations in template literals
				'TemplateLiteral > *',

				// From https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
				'JSXElement',
				'JSXElement > *',
				'JSXAttribute',
				'JSXIdentifier',
				'JSXNamespacedName',
				'JSXMemberExpression',
				'JSXSpreadAttribute',
				'JSXExpressionContainer',
				'JSXOpeningElement',
				'JSXClosingElement',
				'JSXFragment',
				'JSXOpeningFragment',
				'JSXClosingFragment',
				'JSXText',
				'JSXEmptyExpression',
				'JSXSpreadChild',
			],
			ImportDeclaration: 1,
			ObjectExpression: 1,
			outerIIFEBody: 1,
			SwitchCase: 1,
			VariableDeclarator: 1,
		}],

		// enforce or disallow variable initializations at definition
		'init-declarations': 'off',

		// enforces spacing between keys and values in object literal properties
		'key-spacing': ['error', { afterColon: true, beforeColon: false }],

		// require a space before & after certain keywords
		'keyword-spacing': ['error', {
			after: true,
			before: true,
			overrides: {
				case: { after: true },
				return: { after: true },
				throw: { after: true },
			},
		}],

		// enforce consistent 'LF' or 'CRLF' as linebreaks
		// https://eslint.org/docs/latest/rules/linebreak-style
		'linebreak-style': ['error', 'unix'],

		// enforces empty lines around comments
		'lines-around-comment': 'off',

		// require or disallow an empty line between class members
		// https://eslint.org/docs/latest/rules/lines-between-class-members
		'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: false }],

		// enforce a maximum number of classes per file
		// https://eslint.org/docs/latest/rules/max-classes-per-file
		'max-classes-per-file': ['error', 1],

		// specify the maximum depth that blocks can be nested
		'max-depth': ['off', 4],

		// specify the maximum length of a line in your program
		// https://eslint.org/docs/latest/rules/max-len
		'max-len': ['error', 100, 2, {
			ignoreComments: false,
			ignoreRegExpLiterals: true,
			ignoreStrings: true,
			ignoreTemplateLiterals: true,
			ignoreUrls: true,
		}],

		// specify the max number of lines in a file
		// https://eslint.org/docs/latest/rules/max-lines
		'max-lines': ['off', {
			max: 300,
			skipBlankLines: true,
			skipComments: true,
		}],

		// enforce a maximum function length
		// https://eslint.org/docs/latest/rules/max-lines-per-function
		'max-lines-per-function': ['off', {
			IIFEs: true,
			max: 50,
			skipBlankLines: true,
			skipComments: true,
		}],

		// https://eslint.org/docs/latest/rules/max-nested-callbacks
		'max-nested-callbacks': ['warn', 4],

		// https://eslint.org/docs/latest/rules/max-params
		'max-params': ['warn', 5],

		// https://eslint.org/docs/latest/rules/max-statements
		// Consider test "describe()" containing many tests
		// 'max-statements': ['warn', 10],

		// https://eslint.org/docs/latest/rules/max-statements-per-line
		'max-statements-per-line': ['warn', { max: 1 }],

		// https://eslint.org/docs/latest/rules/multiline-ternary
		'multiline-ternary': ['error', 'always-multiline'],

		// require a capital letter for constructors
		'new-cap': ['error', {
			capIsNew: false,
			capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
			newIsCap: true,
			newIsCapExceptions: [],
		}],

		// disallow the omission of parentheses when invoking a constructor with no arguments
		// https://eslint.org/docs/latest/rules/new-parens
		'new-parens': 'error',

		// allow/disallow an empty newline after var statement
		'newline-after-var': 'off',

		// https://eslint.org/docs/latest/rules/newline-before-return
		'newline-before-return': 'off',

		// enforces new line after each method call in the chain to make it
		// more readable and easy to maintain
		// https://eslint.org/docs/latest/rules/newline-per-chained-call
		'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],

		// disallow the use of alert, confirm, and prompt
		'no-alert': 'warn',

		// disallow use of the Array constructor
		'no-array-constructor': 'error',

		// disallow using an async function as a Promise executor
		// https://eslint.org/docs/latest/rules/no-async-promise-executor
		'no-async-promise-executor': 'error',

		// disallow use of bitwise operators
		// https://eslint.org/docs/latest/rules/no-bitwise
		'no-bitwise': 'error',

		// disallow use of arguments.caller or arguments.callee
		'no-caller': 'error',

		// disallow lexical declarations in case/default clauses
		// https://eslint.org/docs/latest/rules/no-case-declarations.html
		'no-case-declarations': 'error',

		// disallow the catch clause parameter name being the same as a variable in the outer scope
		'no-catch-shadow': 'off',

		// disallow modifying variables of class declarations
		// https://eslint.org/docs/latest/rules/no-class-assign
		'no-class-assign': 'error',

		// Disallow comparisons to negative zero
		// https://eslint.org/docs/latest/rules/no-compare-neg-zero
		'no-compare-neg-zero': 'error',

		// disallow assignment in conditional expressions
		'no-cond-assign': ['error', 'always'],

		// disallow arrow functions where they could be confused with comparisons
		// https://eslint.org/docs/latest/rules/no-confusing-arrow
		'no-confusing-arrow': ['error', {
			allowParens: true,
		}],

		// disallow use of console
		'no-console': 'warn',

		// disallow modifying variables that are declared using const
		'no-const-assign': 'error',

		// disallow use of constant expressions in conditions
		'no-constant-condition': 'warn',

		// https://eslint.org/docs/latest/rules/no-constructor-return
		'no-constructor-return': 'error',

		// disallow control characters in regular expressions
		'no-control-regex': 'error',

		// disallow use of debugger
		'no-debugger': 'error',

		// disallow deletion of variables
		'no-delete-var': 'error',

		// disallow duplicate arguments in functions
		'no-dupe-args': 'error',

		// disallow duplicate class members
		// https://eslint.org/docs/latest/rules/no-dupe-class-members
		'no-dupe-class-members': 'error',

		// Disallow duplicate conditions in if-else-if chains
		// https://eslint.org/docs/latest/rules/no-dupe-else-if
		'no-dupe-else-if': 'error',

		// disallow duplicate keys when creating object literals
		'no-dupe-keys': 'error',

		// disallow a duplicate case label.
		'no-duplicate-case': 'error',

		// disallow importing from the same path more than once
		// https://eslint.org/docs/latest/rules/no-duplicate-imports
		// replaced by https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
		'no-duplicate-imports': 'off',

		// disallow else after a return in an if
		// https://eslint.org/docs/latest/rules/no-else-return
		'no-else-return': ['error', { allowElseIf: false }],

		// disallow empty statements
		'no-empty': ['error', {
			allowEmptyCatch: true,
		}],

		// disallow the use of empty character classes in regular expressions
		'no-empty-character-class': 'error',

		// disallow empty functions, except for standalone funcs/arrows
		// https://eslint.org/docs/latest/rules/no-empty-function
		'no-empty-function': ['error', {
			allow: [
				'arrowFunctions',
				'functions',
				'methods',
			],
		}],

		// disallow empty destructuring patterns
		// https://eslint.org/docs/latest/rules/no-empty-pattern
		'no-empty-pattern': 'error',

		'no-eq-null': 'error',

		'no-eval': 'error',

		// disallow assigning to the exception in a catch block
		'no-ex-assign': 'error',

		'no-extend-native': 'error',

		// disallow unnecessary function binding
		'no-extra-bind': 'error',

		// disallow double-negation boolean casts in a boolean context
		// https://eslint.org/docs/latest/rules/no-extra-boolean-cast
		'no-extra-boolean-cast': 'error',

		// https://eslint.org/docs/latest/rules/no-extra-label
		'no-extra-label': 'error',

		// disallow unnecessary parentheses
		// https://eslint.org/docs/latest/rules/no-extra-parens
		'no-extra-parens': ['off', 'all', {
			conditionalAssign: true,
			// delegate to eslint-plugin-react
			enforceForArrowConditionals: false,
			ignoreJSX: 'all',
			nestedBinaryExpressions: false,
			returnAssign: false,
		}],

		// disallow unnecessary semicolons
		'no-extra-semi': 'error',

		// disallow fallthrough of case statements
		'no-fallthrough': 'error',

		// disallow the use of leading or trailing decimal points in numeric literals
		'no-floating-decimal': 'error',

		// disallow overwriting functions written as function declarations
		'no-func-assign': 'error',

		// disallow reassignments of native objects or read-only globals
		// https://eslint.org/docs/latest/rules/no-global-assign
		'no-global-assign': 'error',

		// disallow implicit type conversions
		// https://eslint.org/docs/latest/rules/no-implicit-coercion
		'no-implicit-coercion': ['off', {
			allow: [],
			boolean: false,
			number: true,
			string: true,
		}],

		// disallow var and named functions in global scope
		// https://eslint.org/docs/latest/rules/no-implicit-globals
		'no-implicit-globals': 'error',

		'no-implied-eval': 'error',

		// https://eslint.org/docs/latest/rules/no-import-assign
		'no-import-assign': 'error',

		// disallow comments inline after code
		'no-inline-comments': 'off',

		// https://eslint.org/docs/latest/rules/no-inner-declarations
		// Function declarations were only allowed at the root pre-ES6. Now, it's fine.
		'no-inner-declarations': 'off',

		// disallow invalid regular expression strings in the RegExp constructor
		'no-invalid-regexp': 'error',

		// disallow irregular whitespace outside of strings and comments
		'no-irregular-whitespace': 'error',

		'no-iterator': 'error',

		// disallow labels that share a name with a variable
		// https://eslint.org/docs/latest/rules/no-label-var
		'no-label-var': 'error',

		'no-labels': ['error', {
			// Necessary for breaking multi-level loops
			allowLoop: true,
			allowSwitch: false,
		}],

		// disallow unnecessary nested blocks
		'no-lone-blocks': 'error',

		// disallow if as the only statement in an else block
		// https://eslint.org/docs/latest/rules/no-lonely-if
		'no-lonely-if': 'error',

		// disallow creation of functions within loops
		'no-loop-func': 'error',

		// https://eslint.org/docs/latest/rules/no-loss-of-precision
		'no-loss-of-precision': 'error',

		// https://eslint.org/docs/latest/rules/no-magic-numbers
		'no-magic-numbers': ['off', {
			detectObjects: false,
			enforceConst: true,
			ignore: [],
			ignoreArrayIndexes: true,
		}],

		// Disallow characters which are made with multiple code points in character class syntax
		// https://eslint.org/docs/latest/rules/no-misleading-character-class
		'no-misleading-character-class': 'error',

		// disallow un-paren'd mixes of different operators
		// https://eslint.org/docs/latest/rules/no-mixed-operators
		'no-mixed-operators': ['error', {
			allowSamePrecedence: false,
			// the list of arithmetic groups disallows mixing `%` and `**`
			// with other arithmetic operators.
			groups: [
				['%', '**'],
				['%', '+'],
				['%', '-'],
				['%', '*'],
				['%', '/'],
				['/', '*'],
				['&', '|', '<<', '>>', '>>>'],
				['==', '!=', '===', '!=='],
				['&&', '||'],
			],
		}],

		// disallow mixed spaces and tabs for indentation
		'no-mixed-spaces-and-tabs': 'error',

		// disallow use of chained assignment expressions
		// https://eslint.org/docs/latest/rules/no-multi-assign
		'no-multi-assign': ['error'],

		// disallow use of multiple spaces
		'no-multi-spaces': ['error', {
			ignoreEOLComments: false,
		}],

		// disallow use of multiline strings
		'no-multi-str': 'error',

		// disallow multiple empty lines, only one newline at the end, and no new lines at the beginning
		// https://eslint.org/docs/latest/rules/no-multiple-empty-lines
		'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],

		// disallow negated conditions
		// https://eslint.org/docs/latest/rules/no-negated-condition
		'no-negated-condition': 'off',

		// disallow nested ternary expressions
		'no-nested-ternary': 'error',

		// disallow use of new operator when not part of the assignment or comparison
		'no-new': 'error',

		// disallow use of new operator for Function object
		'no-new-func': 'error',

		// disallow use of the Object constructor
		'no-new-object': 'error',

		// https://eslint.org/docs/latest/rules/no-new-symbol
		'no-new-symbol': 'error',

		// disallows creating new instances of String, Number, and Boolean
		'no-new-wrappers': 'error',

		// https://eslint.org/docs/latest/rules/no-nonoctal-decimal-escape
		'no-nonoctal-decimal-escape': 'error',

		// disallow the use of object properties of the global object (Math and JSON) as functions
		'no-obj-calls': 'error',

		// disallow use of (old style) octal literals
		'no-octal': 'error',

		// disallow use of octal escape sequences in string literals, such as
		// var foo = 'Copyright \251';
		'no-octal-escape': 'error',

		// disallow use of unary operators, ++ and --
		// https://eslint.org/docs/latest/rules/no-plusplus
		'no-plusplus': 'error',

		// https://eslint.org/docs/latest/rules/no-promise-executor-return
		'no-promise-executor-return': 'error',

		// disallow usage of __proto__ property
		'no-proto': 'error',

		// disallow use of Object.prototypes builtins directly
		// https://eslint.org/docs/latest/rules/no-prototype-builtins
		'no-prototype-builtins': 'error',

		// disallow declaring the same variable more than once
		'no-redeclare': 'error',

		// disallow multiple spaces in a regular expression literal
		'no-regex-spaces': 'error',

		// https://eslint.org/docs/latest/rules/no-restricted-exports
		'no-restricted-exports': ['error', {
			restrictedNamedExports: [
				// use `export default` to provide a default export
				// For export { default } from './foo';
				// 'default',
				'then', // this will cause tons of confusion when your module is dynamically `import()`ed
			],
		}],

		'no-restricted-globals': [
			'error',
			...confusingBrowserGlobals,
		],

		// disallow specific imports
		// https://eslint.org/docs/latest/rules/no-restricted-imports
		'no-restricted-imports': ['off', {
			paths: [],
			patterns: [],
		}],

		// disallow certain object properties
		// https://eslint.org/docs/latest/rules/no-restricted-properties
		'no-restricted-properties': [
			'error',
			{
				message: 'arguments.callee is deprecated',
				object: 'arguments',
				property: 'callee',
			},
			{
				message: 'Please use Number.isFinite instead',
				object: 'global',
				property: 'isFinite',
			},
			{
				message: 'Please use Number.isFinite instead',
				object: 'self',
				property: 'isFinite',
			},
			{
				message: 'Please use Number.isFinite instead',
				object: 'window',
				property: 'isFinite',
			},
			{
				message: 'Please use Number.isNaN instead',
				object: 'global',
				property: 'isNaN',
			},
			{
				message: 'Please use Number.isNaN instead',
				object: 'self',
				property: 'isNaN',
			},
			{
				message: 'Please use Number.isNaN instead',
				object: 'window',
				property: 'isNaN',
			},
			{
				message: 'Please use Object.defineProperty instead.',
				property: '__defineGetter__',
			},
			{
				message: 'Please use Object.defineProperty instead.',
				property: '__defineSetter__',
			},
			{
				message: 'Use the exponentiation operator (**) instead.',
				object: 'Math',
				property: 'pow',
			},
		],
		// disallow use of assignment in return statement
		'no-return-assign': ['error', 'always'],

		// disallow use of `javascript:` urls.
		'no-script-url': 'error',

		// disallow self assignment
		// https://eslint.org/docs/latest/rules/no-self-assign
		'no-self-assign': ['error', {
			props: true,
		}],

		// disallow comparisons where both sides are exactly the same
		'no-self-compare': 'error',

		// disallow use of comma operator
		'no-sequences': 'error',

		// https://eslint.org/docs/latest/rules/no-setter-return
		'no-setter-return': 'error',

		// disallow declaration of variables already declared in the outer scope
		'no-shadow': ['error', {
			allow: [
				...(isInstalled('manten')
					? ['test', 'describe', 'runTestSuite']
					: []
				),
				...(isInstalled('tasuku')
					? ['task', 'setTitle', 'setError', 'setWarning', 'setStatus', 'setOutput']
					: []
				),
			],
		}],

		// disallow shadowing of names such as arguments
		'no-shadow-restricted-names': 'error',

		// disallow sparse arrays
		'no-sparse-arrays': 'error',

		// Disallow template literal placeholder syntax in regular strings
		// https://eslint.org/docs/latest/rules/no-template-curly-in-string
		'no-template-curly-in-string': 'error',

		// disallow to use this/super before super() calling in constructors.
		// https://eslint.org/docs/latest/rules/no-this-before-super
		'no-this-before-super': 'error',

		// restrict what can be thrown as an exception
		'no-throw-literal': 'error',

		// disallow trailing whitespace at the end of lines
		'no-trailing-spaces': ['error', {
			ignoreComments: false,
			skipBlankLines: false,
		}],

		// disallow use of undeclared variables unless mentioned in a /*global */ block
		'no-undef': 'error',

		// disallow use of undefined when initializing variables
		'no-undef-init': 'error',

		// Avoid code that looks like two expressions but is actually one
		// https://eslint.org/docs/latest/rules/no-unexpected-multiline
		'no-unexpected-multiline': 'error',

		// disallow unmodified conditions of loops
		// https://eslint.org/docs/latest/rules/no-unmodified-loop-condition
		'no-unmodified-loop-condition': 'off',

		// disallow the use of Boolean literals in conditional expressions
		// also, prefer `a || b` over `a ? a : b`
		// https://eslint.org/docs/latest/rules/no-unneeded-ternary
		'no-unneeded-ternary': ['error', {
			defaultAssignment: false,
		}],

		// disallow unreachable statements after a return, throw, continue, or break statement
		'no-unreachable': 'error',

		// https://eslint.org/docs/latest/rules/no-unreachable-loop
		'no-unreachable-loop': 'error',

		// disallow return/throw/break/continue inside finally blocks
		// https://eslint.org/docs/latest/rules/no-unsafe-finally
		'no-unsafe-finally': 'error',

		// disallow negating the left operand of relational operators
		// https://eslint.org/docs/latest/rules/no-unsafe-negation
		'no-unsafe-negation': 'error',

		// disallow usage of expressions in statement position
		'no-unused-expressions': ['error', {
			allowShortCircuit: false,
			allowTaggedTemplates: false,
			allowTernary: false,
		}],

		// disallow unused labels
		// https://eslint.org/docs/latest/rules/no-unused-labels
		'no-unused-labels': 'error',

		// disallow declaration of variables that are not used in the code
		'no-unused-vars': ['error', {
			args: 'after-used',
			ignoreRestSiblings: true,
			vars: 'all',
		}],

		// not always possible for inter-dependent functions
		'no-use-before-define': 'off',

		// https://eslint.org/docs/latest/rules/no-useless-backreference
		'no-useless-backreference': 'error',

		// disallow unnecessary .call() and .apply()
		'no-useless-call': 'off',

		// Disallow unnecessary catch clauses
		// https://eslint.org/docs/latest/rules/no-useless-catch
		'no-useless-catch': 'error',

		// disallow useless computed property keys
		// https://eslint.org/docs/latest/rules/no-useless-computed-key
		'no-useless-computed-key': 'error',

		// disallow useless string concatenation
		// https://eslint.org/docs/latest/rules/no-useless-concat
		'no-useless-concat': 'error',

		// disallow unnecessary constructor
		// https://eslint.org/docs/latest/rules/no-useless-constructor
		'no-useless-constructor': 'error',

		// disallow unnecessary string escaping
		// https://eslint.org/docs/latest/rules/no-useless-escape
		'no-useless-escape': 'error',

		// disallow renaming import, export, and destructured assignments to the same name
		// https://eslint.org/docs/latest/rules/no-useless-rename
		'no-useless-rename': ['error', {
			ignoreDestructuring: false,
			ignoreExport: false,
			ignoreImport: false,
		}],

		// disallow redundant return; keywords
		// https://eslint.org/docs/latest/rules/no-useless-return
		'no-useless-return': 'error',

		// require let or const instead of var
		'no-var': 'error',

		// disallow use of void operator
		// https://eslint.org/docs/latest/rules/no-void
		'no-void': 'error',

		// disallow usage of configurable warning terms in comments: e.g. todo
		'no-warning-comments': ['off', { location: 'start', terms: ['todo', 'fixme', 'xxx'] }],

		// disallow whitespace before properties
		// https://eslint.org/docs/latest/rules/no-whitespace-before-property
		'no-whitespace-before-property': 'error',

		// disallow use of the with statement
		'no-with': 'error',

		// enforce the location of single-line statements
		// https://eslint.org/docs/latest/rules/nonblock-statement-body-position
		'nonblock-statement-body-position': ['error', 'beside', {
			overrides: {},
		}],

		// enforce line breaks between braces
		// https://eslint.org/docs/latest/rules/object-curly-newline
		'object-curly-newline': ['error', {
			ExportDeclaration: { consistent: true, minProperties: 4, multiline: true },
			ImportDeclaration: { consistent: true, minProperties: 4, multiline: true },
			ObjectExpression: { consistent: true, minProperties: 4, multiline: true },
			ObjectPattern: { consistent: true, minProperties: 4, multiline: true },
		}],

		// require padding inside curly braces
		'object-curly-spacing': ['error', 'always'],

		// enforce "same line" or "multiple line" on object properties.
		// https://eslint.org/docs/latest/rules/object-property-newline
		'object-property-newline': ['error', {
			allowAllPropertiesOnSameLine: true,
		}],

		// require method and property shorthand syntax for object literals
		// https://eslint.org/docs/latest/rules/object-shorthand
		'object-shorthand': ['error', 'always', {
			ignoreConstructors: false,
		}],

		// allow just one var statement per function
		'one-var': ['error', 'never'],

		// require a newline around variable declaration
		// https://eslint.org/docs/latest/rules/one-var-declaration-per-line
		'one-var-declaration-per-line': ['error', 'always'],

		// require assignment operator shorthand where possible or prohibit it entirely
		// https://eslint.org/docs/latest/rules/operator-assignment
		'operator-assignment': ['error', 'always'],

		// Requires operator at the beginning of the line in multiline statements
		// https://eslint.org/docs/latest/rules/operator-linebreak
		'operator-linebreak': ['error', 'before', {
			overrides: {
				'=': 'none',
			},
		}],

		// disallow padding within blocks
		'padded-blocks': ['error', {
			blocks: 'never',
			classes: 'never',
			switches: 'never',
		}, {
			allowSingleLineBlocks: true,
		}],

		// Require or disallow padding lines between statements
		// https://eslint.org/docs/latest/rules/padding-line-between-statements
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				next: '*',
				prev: 'directive',
			},
		],

		// suggest using arrow functions as callbacks
		'prefer-arrow-callback': ['error', {
			allowNamedFunctions: false,
			allowUnboundThis: true,
		}],

		// suggest using of const declaration for variables that are never modified after declared
		'prefer-const': ['error', {
			destructuring: 'any',
			ignoreReadBeforeAssign: true,
		}],

		// Prefer destructuring from arrays and objects
		// https://eslint.org/docs/latest/rules/prefer-destructuring
		'prefer-destructuring': ['error', {
			AssignmentExpression: {
				array: true,
				object: false,
			},
			VariableDeclarator: {
				array: false,
				object: true,
			},
		}, {
			enforceForRenamedProperties: false,
		}],

		// https://eslint.org/docs/latest/rules/prefer-exponentiation-operator
		'prefer-exponentiation-operator': 'error',

		// Suggest using named capture group in regular expression
		// https://eslint.org/docs/latest/rules/prefer-named-capture-group
		'prefer-named-capture-group': 'off',

		// disallow parseInt() in favor of binary, octal, and hexadecimal literals
		// https://eslint.org/docs/latest/rules/prefer-numeric-literals
		'prefer-numeric-literals': 'error',

		// Prefer use of an object spread over Object.assign
		// https://eslint.org/docs/latest/rules/prefer-object-spread
		'prefer-object-spread': 'error',

		// require using Error objects as Promise rejection reasons
		// https://eslint.org/docs/latest/rules/prefer-promise-reject-errors
		'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],

		// suggest using Reflect methods where applicable
		// https://eslint.org/docs/latest/rules/prefer-reflect
		'prefer-reflect': 'off',

		// https://eslint.org/docs/latest/rules/prefer-regex-literals
		'prefer-regex-literals': ['error', {
			disallowRedundantWrapping: true,
		}],

		// https://eslint.org/docs/latest/rules/prefer-rest-params
		'prefer-rest-params': 'off',

		// suggest using the spread operator instead of .apply()
		// https://eslint.org/docs/latest/rules/prefer-spread
		'prefer-spread': 'error',

		// suggest using template literals instead of string concatenation
		// https://eslint.org/docs/latest/rules/prefer-template
		'prefer-template': 'error',

		// require quotes around object literal property names
		// https://eslint.org/docs/latest/rules/quote-props.html
		'quote-props': ['error', 'as-needed', { keywords: false, numbers: false, unnecessary: true }],

		// specify whether double or single quotes should be used
		quotes: ['error', 'single', { avoidEscape: true }],

		// require use of the second argument for parseInt()
		radix: 'error',

		// Disallow assignments that can lead to race conditions due to usage of await or yield
		// https://eslint.org/docs/latest/rules/require-atomic-updates
		// note: not enabled because it is very buggy
		'require-atomic-updates': 'off',

		// require `await` in `async function` (note: this is a horrible rule that should never be used)
		// https://eslint.org/docs/latest/rules/require-await
		'require-await': 'off',

		// Enforce the use of u flag on RegExp
		// https://eslint.org/docs/latest/rules/require-unicode-regexp
		'require-unicode-regexp': 'off',

		// disallow generator functions that do not have yield
		// https://eslint.org/docs/latest/rules/require-yield
		'require-yield': 'error',

		// enforce spacing between object rest-spread
		// https://eslint.org/docs/latest/rules/rest-spread-spacing
		'rest-spread-spacing': ['error', 'never'],

		// require or disallow use of semicolons instead of ASI
		semi: ['error', 'always'],

		// enforce spacing before and after semicolons
		'semi-spacing': ['error', { after: true, before: false }],

		// Enforce location of semicolons
		// https://eslint.org/docs/latest/rules/semi-style
		'semi-style': ['error', 'last'],

		// import sorting
		// https://eslint.org/docs/latest/rules/sort-imports
		'sort-imports': ['off', {
			ignoreCase: false,
			ignoreDeclarationSort: false,
			ignoreMemberSort: false,
			memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
		}],

		// requires object keys to be sorted
		'sort-keys': ['off', 'asc', { caseSensitive: false, natural: true }],

		// sort variables within the same declaration block
		'sort-vars': 'off',

		// require or disallow space before blocks
		'space-before-blocks': 'error',

		// require or disallow space before function opening parenthesis
		// https://eslint.org/docs/latest/rules/space-before-function-paren
		'space-before-function-paren': ['error', {
			anonymous: 'always',
			asyncArrow: 'always',
			named: 'never',
		}],

		// require or disallow spaces inside parentheses
		'space-in-parens': ['error', 'never'],

		// require spaces around operators
		'space-infix-ops': 'error',

		// Require or disallow spaces before/after unary operators
		// https://eslint.org/docs/latest/rules/space-unary-ops
		'space-unary-ops': ['error', {
			nonwords: false,
			overrides: {},
			words: true,
		}],

		// require or disallow a space immediately following the // or /* in a comment
		// https://eslint.org/docs/latest/rules/spaced-comment
		'spaced-comment': ['error', 'always', {
			block: {
				// space here to support sprockets directives and flow comment types
				balanced: true,
				exceptions: ['-', '+'],
				markers: ['=', '!', ':', '::'],
			},
			line: {
				exceptions: ['-', '+'],
				markers: ['=', '!', '/'], // space here to support sprockets directives, slash for TS /// comments
			},
		}],

		// Enforce spacing around colons of switch statements
		// https://eslint.org/docs/latest/rules/switch-colon-spacing
		'switch-colon-spacing': ['error', { after: true, before: false }],

		// require a Symbol description
		// https://eslint.org/docs/latest/rules/symbol-description
		'symbol-description': 'error',

		// enforce usage of spacing in template strings
		// https://eslint.org/docs/latest/rules/template-curly-spacing
		'template-curly-spacing': 'error',

		// Require or disallow spacing between template tags and their literals
		// https://eslint.org/docs/latest/rules/template-tag-spacing
		'template-tag-spacing': ['error', 'never'],

		// require or disallow the Unicode Byte Order Mark
		// https://eslint.org/docs/latest/rules/unicode-bom
		'unicode-bom': ['error', 'never'],

		// disallow comparisons with the value NaN
		'use-isnan': 'error',

		// ensure that the results of typeof are compared against a valid string
		// https://eslint.org/docs/latest/rules/valid-typeof
		'valid-typeof': ['error', { requireStringLiterals: true }],

		// requires to declare all vars on top of their containing scope
		'vars-on-top': 'error',

		// require immediate function invocation to be wrapped in parentheses
		// https://eslint.org/docs/latest/rules/wrap-iife.html
		'wrap-iife': ['error', 'inside', { functionPrototypeMethods: false }],

		// enforce spacing around the * in yield* expressions
		// https://eslint.org/docs/latest/rules/yield-star-spacing
		'yield-star-spacing': ['error', 'after'],

		// require or disallow Yoda conditions
		yoda: 'error',
	},
});
