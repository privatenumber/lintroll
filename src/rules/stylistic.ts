import type { ESLint } from 'eslint';
import type { FlatESLintConfig } from 'eslint-define-config';
import stylisticPlugin from '@stylistic/eslint-plugin';

export const stylistic: FlatESLintConfig[] = [
	{
		plugins: {
			'@stylistic': stylisticPlugin as unknown as ESLint.Plugin,
		},
		rules: {
			// https://eslint.org/docs/latest/rules/array-bracket-newline
			'@stylistic/array-bracket-newline': ['error', 'consistent'],

			// https://eslint.org/docs/latest/rules/array-bracket-spacing
			'@stylistic/array-bracket-spacing': ['error', 'never'],

			// https://eslint.org/docs/latest/rules/array-element-newline
			'@stylistic/array-element-newline': ['error', 'consistent'],

			// require parens in arrow function arguments
			// https://eslint.org/docs/latest/rules/arrow-parens
			'@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],

			// require space before/after arrow function's arrow
			// https://eslint.org/docs/latest/rules/arrow-spacing
			'@stylistic/arrow-spacing': ['error', { after: true, before: true }],

			// https://eslint.org/docs/latest/rules/block-spacing
			'@stylistic/block-spacing': ['error', 'always'],

			// enforce one true brace style
			'@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],

			// require trailing commas in multiline object literals
			'@stylistic/comma-dangle': ['error', {
				arrays: 'always-multiline',
				exports: 'always-multiline',
				functions: 'always-multiline',
				imports: 'always-multiline',
				objects: 'always-multiline',
			}],

			// enforce spacing before and after comma
			'@stylistic/comma-spacing': ['error', { after: true, before: false }],

			// enforce one true comma style
			'@stylistic/comma-style': ['error', 'last', {
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

			// disallow padding inside computed properties
			'@stylistic/computed-property-spacing': ['error', 'never'],

			// https://eslint.org/docs/latest/rules/dot-location
			'@stylistic/dot-location': ['error', 'property'],

			// enforce newline at the end of file, with no multiple empty lines
			'@stylistic/eol-last': ['error', 'always'],

			// enforce spacing between functions and their invocations
			// https://eslint.org/docs/latest/rules/func-call-spacing
			'@stylistic/func-call-spacing': ['error', 'never'],

			// https://eslint.org/docs/latest/rules/function-call-argument-newline
			'@stylistic/function-call-argument-newline': ['error', 'consistent'],

			// enforce consistent line breaks inside function parentheses
			// https://eslint.org/docs/latest/rules/function-paren-newline
			'@stylistic/function-paren-newline': ['error', 'consistent'],

			// enforce the spacing around the * in generator functions
			// https://eslint.org/docs/latest/rules/generator-star-spacing
			'@stylistic/generator-star-spacing': ['error', { after: true, before: false }],

			// Enforce the location of arrow function bodies with implicit returns
			// https://eslint.org/docs/latest/rules/implicit-arrow-linebreak
			'@stylistic/implicit-arrow-linebreak': ['error', 'beside'],

			// this option sets a specific tab width for your code
			// https://eslint.org/docs/latest/rules/indent
			'@stylistic/indent': ['error', 'tab', {
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

			// enforces spacing between keys and values in object literal properties
			'@stylistic/key-spacing': ['error', { afterColon: true, beforeColon: false }],

			// require a space before & after certain keywords
			'@stylistic/keyword-spacing': ['error', {
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
			'@stylistic/linebreak-style': ['error', 'unix'],

			// enforces empty lines around comments
			'@stylistic/lines-around-comment': 'off',

			// require or disallow an empty line between class members
			// https://eslint.org/docs/latest/rules/lines-between-class-members
			'@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: false }],

			// specify the maximum length of a line in your program
			// https://eslint.org/docs/latest/rules/max-len
			'@stylistic/max-len': ['error', 100, 2, {
				ignoreComments: false,
				ignoreRegExpLiterals: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreUrls: true,
			}],

			// https://eslint.org/docs/latest/rules/max-statements-per-line
			'@stylistic/max-statements-per-line': ['warn', { max: 1 }],

			// https://eslint.org/docs/latest/rules/multiline-ternary
			'@stylistic/multiline-ternary': ['error', 'always-multiline'],

			// disallow the omission of parentheses when invoking a constructor with no arguments
			// https://eslint.org/docs/latest/rules/new-parens
			'@stylistic/new-parens': 'error',

			// enforces new line after each method call in the chain to make it
			// more readable and easy to maintain
			// https://eslint.org/docs/latest/rules/newline-per-chained-call
			'@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],

			// disallow arrow functions where they could be confused with comparisons
			// https://eslint.org/docs/latest/rules/no-confusing-arrow
			'@stylistic/no-confusing-arrow': ['error', {
				allowParens: true,
			}],

			// disallow unnecessary parentheses
			// https://eslint.org/docs/latest/rules/no-extra-parens
			'@stylistic/no-extra-parens': ['off', 'all', {
				conditionalAssign: true,
				// delegate to eslint-plugin-react
				enforceForArrowConditionals: false,
				ignoreJSX: 'all',
				nestedBinaryExpressions: false,
				returnAssign: false,
			}],

			// disallow unnecessary semicolons
			'@stylistic/no-extra-semi': 'error',

			// disallow the use of leading or trailing decimal points in numeric literals
			'@stylistic/no-floating-decimal': 'error',

			// disallow un-paren'd mixes of different operators
			// https://eslint.org/docs/latest/rules/no-mixed-operators
			'@stylistic/no-mixed-operators': ['error', {
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
			'@stylistic/no-mixed-spaces-and-tabs': 'error',

			// disallow use of multiple spaces
			'@stylistic/no-multi-spaces': ['error', {
				ignoreEOLComments: false,
			}],

			// disallow multiple empty lines, only one newline at the end, and no new lines at the beginning
			// https://eslint.org/docs/latest/rules/no-multiple-empty-lines
			'@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],

			// disallow trailing whitespace at the end of lines
			'@stylistic/no-trailing-spaces': ['error', {
				ignoreComments: false,
				skipBlankLines: false,
			}],

			// disallow whitespace before properties
			// https://eslint.org/docs/latest/rules/no-whitespace-before-property
			'@stylistic/no-whitespace-before-property': 'error',

			// enforce the location of single-line statements
			// https://eslint.org/docs/latest/rules/nonblock-statement-body-position
			'@stylistic/nonblock-statement-body-position': ['error', 'beside', {
				overrides: {},
			}],

			// enforce line breaks between braces
			// https://eslint.org/docs/latest/rules/object-curly-newline
			'@stylistic/object-curly-newline': ['error', {
				ExportDeclaration: { consistent: true, minProperties: 4, multiline: true },
				ImportDeclaration: { consistent: true, minProperties: 4, multiline: true },
				ObjectExpression: { consistent: true, minProperties: 4, multiline: true },
				ObjectPattern: { consistent: true, minProperties: 4, multiline: true },
			}],

			// require padding inside curly braces
			'@stylistic/object-curly-spacing': ['error', 'always'],

			// enforce "same line" or "multiple line" on object properties.
			// https://eslint.org/docs/latest/rules/object-property-newline
			'@stylistic/object-property-newline': ['error', {
				allowAllPropertiesOnSameLine: true,
			}],

			// require a newline around variable declaration
			// https://eslint.org/docs/latest/rules/one-var-declaration-per-line
			'@stylistic/one-var-declaration-per-line': ['error', 'always'],

			// Requires operator at the beginning of the line in multiline statements
			// https://eslint.org/docs/latest/rules/operator-linebreak
			'@stylistic/operator-linebreak': ['error', 'before', {
				overrides: {
					'=': 'none',
				},
			}],

			// disallow padding within blocks
			'@stylistic/padded-blocks': ['error', {
				blocks: 'never',
				classes: 'never',
				switches: 'never',
			}, {
				allowSingleLineBlocks: true,
			}],

			// Require or disallow padding lines between statements
			// https://eslint.org/docs/latest/rules/padding-line-between-statements
			'@stylistic/padding-line-between-statements': [
				'error',
				{
					blankLine: 'always',
					next: '*',
					prev: 'directive',
				},
			],

			// require quotes around object literal property names
			// https://eslint.org/docs/latest/rules/quote-props.html
			'@stylistic/quote-props': ['error', 'as-needed', { keywords: false, numbers: false, unnecessary: true }],

			// specify whether double or single quotes should be used
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],

			// enforce spacing between object rest-spread
			// https://eslint.org/docs/latest/rules/rest-spread-spacing
			'@stylistic/rest-spread-spacing': ['error', 'never'],

			// require or disallow use of semicolons instead of ASI
			'@stylistic/semi': ['error', 'always'],

			// enforce spacing before and after semicolons
			'@stylistic/semi-spacing': ['error', { after: true, before: false }],

			// Enforce location of semicolons
			// https://eslint.org/docs/latest/rules/semi-style
			'@stylistic/semi-style': ['error', 'last'],

			// require or disallow space before blocks
			'@stylistic/space-before-blocks': 'error',

			// require or disallow space before function opening parenthesis
			// https://eslint.org/docs/latest/rules/space-before-function-paren
			'@stylistic/space-before-function-paren': ['error', {
				anonymous: 'always',
				asyncArrow: 'always',
				named: 'never',
			}],

			// require or disallow spaces inside parentheses
			'@stylistic/space-in-parens': ['error', 'never'],

			// require spaces around operators
			'@stylistic/space-infix-ops': 'error',

			// Require or disallow spaces before/after unary operators
			// https://eslint.org/docs/latest/rules/space-unary-ops
			'@stylistic/space-unary-ops': ['error', {
				nonwords: false,
				overrides: {},
				words: true,
			}],

			// require or disallow a space immediately following the // or /* in a comment
			// https://eslint.org/docs/latest/rules/spaced-comment
			'@stylistic/spaced-comment': ['error', 'always', {
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
			'@stylistic/switch-colon-spacing': ['error', { after: true, before: false }],

			// enforce usage of spacing in template strings
			// https://eslint.org/docs/latest/rules/template-curly-spacing
			'@stylistic/template-curly-spacing': 'error',

			// Require or disallow spacing between template tags and their literals
			// https://eslint.org/docs/latest/rules/template-tag-spacing
			'@stylistic/template-tag-spacing': ['error', 'never'],

			// require immediate function invocation to be wrapped in parentheses
			// https://eslint.org/docs/latest/rules/wrap-iife.html
			'@stylistic/wrap-iife': ['error', 'inside', { functionPrototypeMethods: false }],

			// enforce spacing around the * in yield* expressions
			// https://eslint.org/docs/latest/rules/yield-star-spacing
			'@stylistic/yield-star-spacing': ['error', 'after'],
		},

	},
];
