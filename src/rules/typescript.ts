/**
 * References:
 * - https://github.com/import-js/eslint-plugin-import/blob/master/config/typescript.js
 * - https://github.com/xojs/eslint-config-xo-typescript/blob/master/index.js
 */
import { createConfig } from '../utils/create-config.js';
import { isInstalled } from '../utils/is-installed.js';
import baseImports from './imports.js';
import baseVariables from './variables.js';

const noExtraneousDependenciesConfig = baseImports.rules['import/no-extraneous-dependencies'][1];

export = createConfig(
	isInstalled('typescript')
		? {
			overrides: [
				// Setting as an override allows .ts files to be
				// linted without specifying it on the user-end
				{
					files: '*.{ts,tsx,mts,cts,vue}',

					extends: [
						'plugin:@typescript-eslint/recommended',

						// https://github.com/import-js/eslint-plugin-import/blob/6c8981d/config/typescript.js
						'plugin:import/typescript',
					],

					settings: {
						'import/resolver': {
							typescript: {},
						},
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
						'@typescript-eslint/no-unused-vars': [
							'error',
							{
								...baseVariables.rules['no-unused-vars'][1],

								/**
								 * TypeScript ignores any variables that are prefixed with _
								 * https://github.com/microsoft/TypeScript/pull/9464
								 */
								varsIgnorePattern: '^_',
								argsIgnorePattern: '^_',
								caughtErrorsIgnorePattern: '^_',
							},
						],

						// Always require await when returning promise
						// https://github.com/goldbergyoni/nodebestpractices/blob/5ba537d/sections/errorhandling/returningpromises.md
						// '@typescript-eslint/return-await': ['error', 'always'],

						'import/no-extraneous-dependencies': ['error', {
							...noExtraneousDependenciesConfig,
							devDependencies: [
								...noExtraneousDependenciesConfig.devDependencies.map(
									pattern => pattern.replace('.js', '.{js,ts}'),
								),
							],
						}],

						// TS disallows .ts extension
						// https://github.com/Microsoft/TypeScript/issues/27481
						'import/extensions': ['error', 'ignorePackages', {
							ts: 'never',
							tsx: 'never',
						}],

						'@typescript-eslint/member-delimiter-style': 'error',

						'@typescript-eslint/consistent-type-assertions': 'error',

						// Allow functions to be passed in only in TS because it's easy to see their types
						'unicorn/no-array-callback-reference': 'off',

						// Not always possible to destructue at top-level when the variable is ambigious
						'unicorn/consistent-destructuring': 'off',

						// Could be used to pass in an explicit `undefined` to a required parameter
						'unicorn/no-useless-undefined': 'off',

						// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
						'no-shadow': 'off',
						'@typescript-eslint/no-shadow': baseVariables.rules['no-shadow'],

						// Function expression can be used to type a function
						'func-style': 'off',

						'prefer-rest-params': 'off',
					},
				},
			],
		}
		: {},
);
