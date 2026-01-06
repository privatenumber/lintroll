import type { Linter } from 'eslint';
import js from '@eslint/js';
import globals from 'globals';
import confusingBrowserGlobals from 'confusing-browser-globals';
import { isInstalled } from '../utils/require.js';
import { defineConfig } from '../utils/define-config.js';

// https://github.com/eslint/eslint/blob/v8.55.0/packages/js/src/configs/eslint-recommended.js
const recommendedRules = js.configs.recommended.rules;

const customRules = {
	'accessor-pairs': 'error',

	// https://eslint.org/docs/latest/rules/array-callback-return
	'array-callback-return': ['error', { allowImplicit: true }],

	// https://eslint.org/docs/latest/rules/arrow-body-style
	'arrow-body-style': ['error', 'as-needed'],

	// treat var statements as if they were block scoped
	'block-scoped-var': 'error',

	// require camel case names
	camelcase: ['error', {
		ignoreDestructuring: false,
		properties: 'never',
	}],

	// https://eslint.org/docs/latest/rules/complexity
	complexity: ['warn', 10],

	'consistent-return': 'off',

	curly: 'error',

	// require default case in switch statements
	'default-case': ['error', { commentPattern: '^no default$' }],

	// https://eslint.org/docs/latest/rules/default-case-last
	'default-case-last': 'error',

	// https://eslint.org/docs/latest/rules/default-param-last
	'default-param-last': 'error',

	'dot-notation': ['error', { allowKeywords: true }],

	// https://eslint.org/docs/latest/rules/eqeqeq
	eqeqeq: ['error', 'always', { null: 'ignore' }],

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

	// enforce or disallow variable initializations at definition
	'init-declarations': 'off',

	// specify the maximum depth that blocks can be nested
	'max-depth': ['off', 4],

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
	'max-nested-callbacks': ['warn', 6],

	// https://eslint.org/docs/latest/rules/max-params
	'max-params': ['warn', 5],

	// https://eslint.org/docs/latest/rules/max-statements
	// Consider test "describe()" containing many tests
	// 'max-statements': ['warn', 10],

	// require a capital letter for constructors
	// Disabled: packages may have lowercase constructors that we can't control
	'new-cap': 'off',

	// allow/disallow an empty newline after var statement
	'newline-after-var': 'off',

	// https://eslint.org/docs/latest/rules/newline-before-return
	'newline-before-return': 'off',

	// disallow the use of alert, confirm, and prompt
	'no-alert': 'warn',

	// disallow use of the Array constructor
	'no-array-constructor': 'error',

	// disallow use of bitwise operators
	// https://eslint.org/docs/latest/rules/no-bitwise
	'no-bitwise': 'error',

	// disallow use of arguments.caller or arguments.callee
	'no-caller': 'error',

	// disallow the catch clause parameter name being the same as a variable in the outer scope
	'no-catch-shadow': 'off',

	// disallow assignment in conditional expressions
	'no-cond-assign': ['error', 'always'],

	// disallow use of console
	'no-console': 'warn',

	// disallow use of constant expressions in conditions
	'no-constant-condition': 'warn',

	// https://eslint.org/docs/latest/rules/no-constructor-return
	'no-constructor-return': 'error',

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

	// disallow empty functions, except for standalone funcs/arrows
	// https://eslint.org/docs/latest/rules/no-empty-function
	'no-empty-function': ['error', {
		allow: [
			'arrowFunctions',
			'functions',
			'methods',
		],
	}],

	'no-eq-null': 'error',

	'no-eval': 'error',

	'no-extend-native': 'error',

	// disallow unnecessary function binding
	'no-extra-bind': 'error',

	// https://eslint.org/docs/latest/rules/no-extra-label
	'no-extra-label': 'error',

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

	// disallow comments inline after code
	'no-inline-comments': 'off',

	// https://eslint.org/docs/latest/rules/no-inner-declarations
	// Function declarations were only allowed at the root pre-ES6. Now, it's fine.
	'no-inner-declarations': 'off',

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

	// https://eslint.org/docs/latest/rules/no-magic-numbers
	'no-magic-numbers': ['off', {
		detectObjects: false,
		enforceConst: true,
		ignore: [],
		ignoreArrayIndexes: true,
	}],

	// disallow use of chained assignment expressions
	// https://eslint.org/docs/latest/rules/no-multi-assign
	'no-multi-assign': ['error'],

	// disallow use of multiline strings
	'no-multi-str': 'error',

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
	'no-object-constructor': 'error',

	// disallows creating new instances of String, Number, and Boolean
	'no-new-wrappers': 'error',

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

	// disallow declaration of variables already declared in the outer scope
	'no-shadow': ['error', {
		allow: [
			...(isInstalled('manten')
				? ['test', 'describe', 'runTestSuite', 'onFinish', 'fixture']
				: []
			),
			...(isInstalled('tasuku')
				? ['task', 'setTitle', 'setError', 'setWarning', 'setStatus', 'setOutput']
				: []
			),
		],
	}],

	/**
	 * https://eslint.org/docs/latest/rules/no-template-curly-in-string
	 *
	 * Needed for TypeScript ${configDir} in tsconfig.json
	 * But also, IDE have syntax highlighting that make it obvious when template string
	 * interpolation is working. And tests should also catch this.
	 */
	// 'no-template-curly-in-string': 'error',

	// restrict what can be thrown as an exception
	'no-throw-literal': 'error',

	// disallow use of undefined when initializing variables
	'no-undef-init': 'error',

	// disallow unmodified conditions of loops
	// https://eslint.org/docs/latest/rules/no-unmodified-loop-condition
	'no-unmodified-loop-condition': 'off',

	// disallow the use of Boolean literals in conditional expressions
	// also, prefer `a || b` over `a ? a : b`
	// https://eslint.org/docs/latest/rules/no-unneeded-ternary
	'no-unneeded-ternary': ['error', {
		defaultAssignment: false,
	}],

	// https://eslint.org/docs/latest/rules/no-unreachable-loop
	'no-unreachable-loop': 'error',

	// disallow usage of expressions in statement position
	'no-unused-expressions': ['error', {
		allowShortCircuit: false,
		allowTaggedTemplates: false,
		allowTernary: false,
	}],

	// disallow declaration of variables that are not used in the code
	'no-unused-vars': ['error', {
		args: 'after-used',
		ignoreRestSiblings: true,
		vars: 'all',
	}],

	// not always possible for inter-dependent functions
	'no-use-before-define': 'off',

	// disallow unnecessary .call() and .apply()
	'no-useless-call': 'off',

	// disallow useless computed property keys
	// https://eslint.org/docs/latest/rules/no-useless-computed-key
	'no-useless-computed-key': 'error',

	// disallow useless string concatenation
	// https://eslint.org/docs/latest/rules/no-useless-concat
	'no-useless-concat': 'error',

	// disallow unnecessary constructor
	// https://eslint.org/docs/latest/rules/no-useless-constructor
	'no-useless-constructor': 'error',

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
	'no-warning-comments': ['off', {
		location: 'start',
		terms: ['todo', 'fixme', 'xxx'],
	}],

	// require method and property shorthand syntax for object literals
	// https://eslint.org/docs/latest/rules/object-shorthand
	'object-shorthand': ['error', 'always', {
		ignoreConstructors: false,
	}],

	// allow just one var statement per function
	'one-var': ['error', 'never'],

	// require assignment operator shorthand where possible or prohibit it entirely
	// https://eslint.org/docs/latest/rules/operator-assignment
	'operator-assignment': ['error', 'always'],

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
	'prefer-destructuring': [
		'error',
		{
			VariableDeclarator: {
				/**
				 * Prefer to enable this for first or second elements
				 * but gets too complex for larger indices: [,,,, element] = var;
				 *
				 * TODO: Make a new rule that combines this and
				 * eslint-plugin-unicorn/no-unreadable-array-destructuring
				 */
				array: false,
				object: true,
			},
			AssignmentExpression: {
				array: false,
				object: false,
			},
		},
		{
			/**
			 * TODO: Ideally this can be enabled for code like:
			 * const destructure = objectMulti.a;
			 *
			 * But it currently also errors on:
			 * const [element] = obj.prop;
			 *
			 * Would like to fine tune to ignore arrays
			 * or if some destructuring already exists.
			 */
			enforceForRenamedProperties: false,
		},
	],

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

	// import sorting
	// https://eslint.org/docs/latest/rules/sort-imports
	'sort-imports': ['off', {
		ignoreCase: false,
		ignoreDeclarationSort: false,
		ignoreMemberSort: false,
		memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
	}],

	// requires object keys to be sorted
	'sort-keys': ['off', 'asc', {
		caseSensitive: false,
		natural: true,
	}],

	// sort variables within the same declaration block
	'sort-vars': 'off',

	// require a Symbol description
	// https://eslint.org/docs/latest/rules/symbol-description
	'symbol-description': 'error',

	// require or disallow the Unicode Byte Order Mark
	// https://eslint.org/docs/latest/rules/unicode-bom
	'unicode-bom': ['error', 'never'],

	// ensure that the results of typeof are compared against a valid string
	// https://eslint.org/docs/latest/rules/valid-typeof
	'valid-typeof': ['error', { requireStringLiterals: true }],

	// requires to declare all vars on top of their containing scope
	'vars-on-top': 'error',

	// require or disallow Yoda conditions
	yoda: 'error',
} satisfies Linter.Config['rules'];

const duplicateRules = Object.entries(customRules).filter(
	([key]) => (
		recommendedRules[key]
		&& recommendedRules[key] === customRules[key as keyof typeof customRules]
	),
);

if (duplicateRules.length > 0) {
	throw new Error(
		`Duplicate rules with ESLint recommendations found: ${
			duplicateRules.map(([key]) => key).join(', ')
		}`,
	);
}

export const eslint = defineConfig({
	languageOptions: {
		globals: globals['shared-node-browser'],
	},

	rules: {
		...recommendedRules,
		...customRules,
	},
});
