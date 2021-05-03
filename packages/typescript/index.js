/**
 * References:
 * - https://github.com/benmosher/eslint-plugin-import/blob/master/config/typescript.js
 * - https://github.com/xojs/eslint-config-xo-typescript/blob/master/index.js
 */

/** @typedef { import('eslint').Linter.Config } ESLintConfig */

/** @type { ESLintConfig } */
const config = {
	extends: [
		'@pvtnbr/eslint-config-base',
	],
	overrides: [
		// Setting as an override allows .ts files to be
		// linted without specifying it on the user-end
		{
			files: '*.{ts,tsx}',
			extends: [
				'plugin:@typescript-eslint/recommended',

				// https://github.com/benmosher/eslint-plugin-import/blob/6c8981d/config/typescript.js
				'plugin:import/typescript',
			],

			parserOptions: {
				// Gets closest tsconfig.json
				project: '**/tsconfig.json',
			},

			rules: {
				// Always require await when returning promise
				// https://github.com/goldbergyoni/nodebestpractices/blob/5ba537d/sections/errorhandling/returningpromises.md
				'@typescript-eslint/return-await': ['error', 'always'],

				// TS disallows .ts extension
				// https://github.com/Microsoft/TypeScript/issues/27481
				'import/extensions': ['error', 'ignorePackages', {
					ts: 'never',
					tsx: 'never',
				}],

				'node/file-extension-in-import': ['error', 'always', {
					'.ts': 'never',
					'.tsx': 'never',
				}],

				'@typescript-eslint/member-delimiter-style': 'error',

				'@typescript-eslint/consistent-type-assertions': 'error',

				// Allow functions to be passed in only in TS because it's easy to see their types
				'unicorn/no-array-callback-reference': 'off',

				// Not always possible to destructue at top-level when the variable is ambigious
				'unicorn/consistent-destructuring': 'off',

				// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
				'no-shadow': 'off',
				'@typescript-eslint/no-shadow': 'error',
			},
		},
		{
			files: '*.d.ts',
			rules: {
				'import/prefer-default-export': 'off',
			},
		},
	],
};

module.exports = config;
