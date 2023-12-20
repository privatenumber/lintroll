import unicornPlugin from 'eslint-plugin-unicorn';
import { defineConfig } from '../utils/define-config';

export const unicorn = [
	defineConfig({
		plugins: {
			unicorn: unicornPlugin,
		},
		ignores: ['**/*.{json,json5,jsonc,yml,yaml}'],
		rules: {
			...unicornPlugin.configs.recommended.rules,

			// Disable in favor of eslint-plugin-regexp
			'unicorn/better-regex': 'off',

			// Had some test files where I was creating inline functions within a test
			// Might make sense to enable this and turn this off for test/
			'unicorn/consistent-function-scoping': 'off',

			'unicorn/no-array-for-each': 'off',

			/**
			 * For-of + iterators currently requires transpilation:
			 * https://www.typescriptlang.org/tsconfig#downlevelIteration
			 *
			 * Given this cost, it doesn't make sense to use instead of for-loops yet
			 */
			'unicorn/no-for-loop': 'off',

			// Conflicts with eslint-plugin-n/no-deprecated-api
			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-deprecated-api.md
			'unicorn/no-new-buffer': 'off',

			// Too many cases where 3rd party library expects null
			'unicorn/no-null': 'off',

			// Conflicts with eslint-plugin-n/no-process-exit
			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-process-exit.md
			'unicorn/no-process-exit': 'off',

			// ts-node can't load TypeScript's compliation of export-from
			// https://github.com/privatenumber/esbuild-loader/issues/232#issuecomment-998487005
			// Disable even warnings because of autofix
			'unicorn/prefer-export-from': ['off', {
				ignoreUsedVariables: true,
			}],

			// https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1273#issuecomment-1069506684
			'unicorn/prefer-json-parse-buffer': 'off',

			'unicorn/prefer-module': 'off',

			'unicorn/prefer-node-protocol': 'off',

			// Good rule and would like warning but no autofix
			// Some low level libraries that compile using babel would prefer to use
			// Array.from
			'unicorn/prefer-spread': 'off',

			'unicorn/prefer-ternary': 'off',

			'unicorn/prefer-top-level-await': 'off',

			// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/898fcb4/docs/rules/prevent-abbreviations.md
			'unicorn/prevent-abbreviations': ['error', {
				// exact-match
				allowList: {
					// for-loop index
					i: true,
					j: true,
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
					src: false,
				},
			}],

			/**
			 * Too many false positives.
			 *
			 * It changed the formatting of inline snapshots in tests
			 */
			'unicorn/template-indent': 'off',

			// Disabled in favor of
			// https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/no-unlimited-disable.html
			'unicorn/no-abusive-eslint-disable': 'off',
		},
	}),
];
