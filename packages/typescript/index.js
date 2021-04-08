/**
 * References:
 * - https://github.com/benmosher/eslint-plugin-import/blob/master/config/typescript.js
 * - https://github.com/xojs/eslint-config-xo-typescript/blob/master/index.js
 */

module.exports = {
	extends: [
		'@pvtnbr/eslint-config-base',
	],
	overrides: [
		// Setting as an override allows .ts files to be
		// linted without specifying it on the user-end
		{
			files: '*.ts',
			extends: [
				'plugin:@typescript-eslint/recommended',
			],

			parserOptions: {
				// Gets closest tsconfig.json
				project: '**/tsconfig.json',
			},

			settings: {
				// Doesn't seem to help
				// 'import/extensions': extensions,

				'import/external-module-folders': ['node_modules', 'node_modules/@types'],

				'import/parsers': {
					'@typescript-eslint/parser': ['.ts', '.d.ts'],
				},

				'import/resolver': {
					node: {
						extensions: [
							'.js',
							'.ts',
							'.d.ts',
						],
					},
				},
			},

			rules: {
				// Always require await when returning promise
				// https://github.com/goldbergyoni/nodebestpractices/blob/5ba537d/sections/errorhandling/returningpromises.md
				'@typescript-eslint/return-await': ['error', 'always'],

				// TypeScript compilation already ensures that named imports exist in the referenced module
				'import/named': 'off',

				// TS disallows .ts extension
				// https://github.com/Microsoft/TypeScript/issues/27481
				'import/extensions': ['error', 'ignorePackages', {
					ts: 'never',
				}],

				'@typescript-eslint/member-delimiter-style': 'error',

				'@typescript-eslint/consistent-type-assertions': 'error',

				// Allow functions to be passed in only in TS because it's easy to see their types
				'unicorn/no-array-callback-reference': 'off',

				// Not always possible to destructue at top-level when the variable is ambigious
				'unicorn/consistent-destructuring': 'off',
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
