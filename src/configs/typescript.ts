/**
 * References:
 * - https://github.com/import-js/eslint-plugin-import/blob/master/config/typescript.js
 * - https://github.com/xojs/eslint-config-xo-typescript/blob/master/index.js
 */
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import-x';
import { defineConfig } from '../utils/define-config';
import { importsConfig } from './imports.js';
import { eslint } from './eslint.js';

const [, noExtraneousDependenciesConfig] = importsConfig.rules['import-x/no-extraneous-dependencies'];

export const tsFiles = '**/*.{ts,tsx,mts,cts}';

export const parseTypescript = defineConfig({
	files: [tsFiles],
	languageOptions: {
		parser: tsParser,
		parserOptions: {
			ecmaVersion: 'latest',
		},
	},
	settings: importPlugin.configs.typescript.settings,
});

export const typescript = defineConfig({
	files: [tsFiles],

	plugins: {
		'@typescript-eslint': tsPlugin,
	},

	settings: {
		...importPlugin.configs.typescript.settings,

		'import-x/resolver': {
			...importPlugin.configs.typescript.settings['import-x/resolver'],

			// this loads <rootdir>/tsconfig.json to eslint
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
		...tsPlugin.configs['eslint-recommended'].overrides[0].rules,
		...tsPlugin.configs.recommended.rules,
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

		'@stylistic/member-delimiter-style': 'error',

		'@typescript-eslint/no-shadow': eslint.rules['no-shadow'],

		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				...eslint.rules['no-unused-vars'][1],

				argsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',

				/**
				 * TypeScript ignores any variables that are prefixed with _
				 * https://github.com/microsoft/TypeScript/pull/9464
				 */
				varsIgnorePattern: '^_',
			},
		],

		'@typescript-eslint/no-explicit-any': ['error', {
			fixToUnknown: false,

			// No other way to type a function that takes any number of arguments
			// This should be used in generics where we're narrowing the type with any
			ignoreRestArgs: true,
		}],

		// Function expression can be used to type a function
		'func-style': 'off',

		// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
		'no-shadow': 'off',

		'prefer-rest-params': 'off',

		// Always require a file extension except from packages
		// https://github.com/Microsoft/TypeScript/issues/27481
		'import-x/extensions': ['error', 'ignorePackages', {
			ts: 'never',
			tsx: 'never',
			cts: 'never',
			mts: 'never',
		}],

		// Always require await when returning promise
		// https://github.com/goldbergyoni/nodebestpractices/blob/5ba537d/sections/errorhandling/returningpromises.md
		// '@typescript-eslint/return-await': ['error', 'always'],

		'import-x/no-extraneous-dependencies': ['error', {
			...noExtraneousDependenciesConfig,
			devDependencies: noExtraneousDependenciesConfig.devDependencies.map(
				pattern => pattern.replace('.js', '.{js,ts}'),
			),
		}],

		// Not always possible to destructue at top-level when the variable is ambigious
		'unicorn/consistent-destructuring': 'off',

		// Allow functions to be passed in only in TS because it's easy to see their types
		'unicorn/no-array-callback-reference': 'off',

		// Could be used to pass in an explicit `undefined` to a required parameter
		'unicorn/no-useless-undefined': 'off',
	},
});
