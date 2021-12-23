const path = require('path');

const packageJson = require(path.resolve('package.json'));
const isCli = 'bin' in packageJson;

module.exports = {
	plugins: [
		'unicorn',
	],

	extends: 'plugin:unicorn/recommended',

	rules: {
		// Good rule and would like warning but no autofix
		// Some low level libraries that compile using babel would prefer to use
		// Array.from
		'unicorn/prefer-spread': 'off',

		// Had some test files where I was creating inline functions within a test
		// Might make sense to enable this and turn this off for test/
		'unicorn/consistent-function-scoping': 'off',

		// Too many cases where 3rd party library expects null
		'unicorn/no-null': 'off',

		'unicorn/import-index': ['error', {
			// Don't check import statements
			ignoreImports: true,
		}],

		// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/898fcb4/docs/rules/prevent-abbreviations.md
		'unicorn/prevent-abbreviations': ['error', {
			// case insensitive and matches substrings
			replacements: {
				dev: false,
				prop: false,
				props: false,
			},

			// exact-match
			allowList: {
				// for-loop index
				i: true,
				j: true,
			},
		}],

		'unicorn/prefer-node-protocol': 'off',

		'unicorn/prefer-module': 'off',

		// Disable in favor of eslint-plugin-regexp
		'unicorn/better-regex': 'off',

		'unicorn/prefer-ternary': 'off',

		'unicorn/prefer-export-from': ['error', {
			ignoreUsedVariables: true,
		}],

		/**
		 * For-of + iterators currently requires transpilation:
		 * https://www.typescriptlang.org/tsconfig#downlevelIteration
		 *
		 * Given this cost, it doesn't make sense to use instead of for-loops yet
		 */
		'unicorn/no-for-loop': 'off',
	},
	overrides: [
		...(
			isCli
				? [{
					files: 'cli.{js,ts}',
					rules: {
						'unicorn/no-process-exit': 'off',
					},
				}]
				: []
		),
	],
};
