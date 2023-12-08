/**
 * References:
 * - https://github.com/import-js/eslint-plugin-import/blob/master/config/typescript.js
 * - https://github.com/xojs/eslint-config-xo-typescript/blob/master/index.js
 */
import recommendedModule from 'eslint-plugin-n/lib/configs/recommended-module.js';
import recommendedScript from 'eslint-plugin-n/lib/configs/recommended-script.js';
import type { FlatESLintConfig } from 'eslint-define-config';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import * as importPlugin from 'eslint-plugin-import';
import * as typescriptParser from '@typescript-eslint/parser';
import { isInstalled } from '../utils/is-installed.js';
import { imports as baseImports } from './imports.js';
import { base } from './base.js';

const noExtraneousDependenciesConfig = baseImports.rules['import/no-extraneous-dependencies'][1];

// console.log(typescriptPlugin.configs);
// console.log(importPlugin.configs.typescript);

export const typescript = (
	isInstalled('typescript')
		? [
			{
				files: ['**/*.{ts,tsx,mts,cts}'], // TODO: add vue
				languageOptions: {
					parser: typescriptParser,
					parserOptions: {
						sourceType: 'module', // Necessary?
					},
				},

				plugins: {
					'@typescript-eslint': typescriptPlugin,
				},

				settings: {
					...importPlugin.configs.typescript.settings,
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
					// Turn off ESLint recommended rules that are handled by TypeScript
					...typescriptPlugin.configs['eslint-recommended'].overrides![0].rules,

					...typescriptPlugin.configs.recommended.rules,
					...importPlugin.configs.typescript.rules,

					/**
					 * Suddenly requires parserServices to be generated
					 *   Error while loading rule '@typescript-eslint/consistent-type-assertions':
					 *     You have used a rule which requires parserServices to be generated.
					 *     You must therefore provide a value for the "parserOptions.project"
					 *     property for @typescript-eslint/parser.
					 * https://github.com/typescript-eslint/typescript-eslint/pull/6885#issuecomment-1701892123
					 */
					// '@typescript-eslint/consistent-type-assertions': 'error',

					'@typescript-eslint/member-delimiter-style': 'error',

					'@typescript-eslint/no-shadow': base.rules['no-shadow'],

					'@typescript-eslint/no-unused-vars': [
						'error',
						{
							...base.rules['no-unused-vars'][1],

							argsIgnorePattern: '^_',
							caughtErrorsIgnorePattern: '^_',
							/**
							 * TypeScript ignores any variables that are prefixed with _
							 * https://github.com/microsoft/TypeScript/pull/9464
							 */
							varsIgnorePattern: '^_',
						},
					],

					// Function expression can be used to type a function
					'func-style': 'off',

					// TS disallows .ts extension
					// https://github.com/Microsoft/TypeScript/issues/27481
					'import/extensions': ['error', 'ignorePackages', {
						ts: 'never',
						tsx: 'never',
						cts: 'never',
						mts: 'never',
					}],

					// Always require await when returning promise
					// https://github.com/goldbergyoni/nodebestpractices/blob/5ba537d/sections/errorhandling/returningpromises.md
					// '@typescript-eslint/return-await': ['error', 'always'],

					'import/no-extraneous-dependencies': ['error', {
						...noExtraneousDependenciesConfig,
						devDependencies: noExtraneousDependenciesConfig.devDependencies.map(
							pattern => pattern.replace('.js', '.{js,ts}'),
						),
					}],

					// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
					'no-shadow': 'off',

					'prefer-rest-params': 'off',
					// // Not always possible to destructue at top-level when the variable is ambigious
					// 'unicorn/consistent-destructuring': 'off',

					// // Allow functions to be passed in only in TS because it's easy to see their types
					// 'unicorn/no-array-callback-reference': 'off',

					// // Could be used to pass in an explicit `undefined` to a required parameter
					// 'unicorn/no-useless-undefined': 'off',
				},
			} satisfies FlatESLintConfig,
			{
				files: ['*.cts'],
				languageOptions: {
					globals: recommendedScript.eslintrc.globals,
					parserOptions: recommendedScript.eslintrc.parserOptions,
				},
			} satisfies FlatESLintConfig,
			{
				files: ['*.mts'],
				languageOptions: {
					globals: recommendedModule.eslintrc.globals,
					parserOptions: recommendedModule.eslintrc.parserOptions,
				},
			} satisfies FlatESLintConfig,
		]
		: []
);
