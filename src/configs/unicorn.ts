import unicornPlugin from 'eslint-plugin-unicorn';
import { defineConfig } from '../utils/define-config';
import { jsAndTs } from '../utils/globs.js';

export type Options = {
	allowAbbreviations?: {
		exactWords?: string[];
		substrings?: string[];
	};
};

export const unicorn = (
	option?: Options,
) => {
	// exact-match, case sensitive
	const allowList: Record<string, boolean> = {
		// for-loop index
		i: true,
		j: true,
	};

	// case insensitive and matches substrings
	const replacements: Record<string, boolean> = {
		args: false,
		dev: false,
		dist: false,
		env: false,
		pkg: false,

		// Vue.js
		prop: false,
		props: false,

		// Common abbreviation (e.g. URLSearchParams)
		params: false,
		ref: false,
		src: false,
		utils: false,
	};

	if (option?.allowAbbreviations) {
		const { allowAbbreviations } = option;
		if (allowAbbreviations.exactWords) {
			for (const word of allowAbbreviations.exactWords) {
				allowList[word] = true;
			}
		}

		if (allowAbbreviations.substrings) {
			for (const word of allowAbbreviations.substrings) {
				replacements[word] = false;
			}
		}
	}

	return [
		defineConfig({
			files: jsAndTs,
			plugins: {
				unicorn: unicornPlugin,
			},
			rules: {
				...unicornPlugin.configs['flat/recommended'].rules,

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
					allowList,
					replacements,
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

				'unicorn/no-array-reverse': 'warn',
				'unicorn/no-array-sort': 'warn',
			},
		}),
		defineConfig({
			files: ['**/*.d.ts'],
			rules: {
				'unicorn/prevent-abbreviations': 'off',
			},
		}),
	];
};
