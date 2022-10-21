import path from 'path';
import { createConfig } from '../utils/create-config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const currentPackageJson = require(path.resolve('package.json'));
const isCli = 'bin' in currentPackageJson;

export = createConfig({
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

		// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/898fcb4/docs/rules/prevent-abbreviations.md
		'unicorn/prevent-abbreviations': ['error', {
			// case insensitive and matches substrings
			replacements: {
				dev: false,
				prop: false,
				props: false,
				ref: false,
				args: false,
				src: false,
				dist: false,
				env: false,
				pkg: false,
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

		// ts-node can't load TypeScript's compliation of export-from
		// https://github.com/privatenumber/esbuild-loader/issues/232#issuecomment-998487005
		// Disable even warnings because of autofix
		'unicorn/prefer-export-from': ['off', {
			ignoreUsedVariables: true,
		}],

		/**
		 * For-of + iterators currently requires transpilation:
		 * https://www.typescriptlang.org/tsconfig#downlevelIteration
		 *
		 * Given this cost, it doesn't make sense to use instead of for-loops yet
		 */
		'unicorn/no-for-loop': 'off',

		/**
		 * Too many false positives.
		 *
		 * It changed the formatting of inline snapshots in tests
		 */
		'unicorn/template-indent': 'off',

		'unicorn/no-array-for-each': 'off',

		// https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1273#issuecomment-1069506684
		'unicorn/prefer-json-parse-buffer': 'off',

		'unicorn/prefer-top-level-await': 'off',
	},

	overrides: (
		isCli
			? [{
				files: [
					'cli.{js,ts}',
					'**/cli/**/*.{js,ts}',
				],
				rules: {
					'unicorn/no-process-exit': 'off',
				},
			}]
			: []
	),
});
