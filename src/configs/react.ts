import reactPlugin from 'eslint-plugin-react';
// import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { getTsconfig } from 'get-tsconfig';
import { defineConfig } from '../utils/define-config.js';

const tsconfig = getTsconfig();
const jsx = tsconfig?.config.compilerOptions?.jsx;
const autoJsx = jsx === 'react-jsx' || jsx === 'react-jsxdev';

export const react = [
	// https://github.com/yannickcr/eslint-plugin-react/blob/c8917b0/index.js
	defineConfig({
		plugins: {
			react: reactPlugin,
		},
		languageOptions: {
			parserOptions: reactPlugin.configs.recommended.parserOptions,
		},
		rules: reactPlugin.configs.recommended.rules,
		settings: {
			react: {
				version: 'detect',
			},
		},
	}),

	// React automatically imported in JSX files
	...(
		autoJsx
			? [defineConfig({
				languageOptions: {
					parserOptions: reactPlugin.configs['jsx-runtime'].parserOptions,
				},
				rules: reactPlugin.configs['jsx-runtime'].rules,
			})]
			: []
	),

	// Temporarily disable -- was confusing Vue use functions for hooks
	// defineConfig({
	// 	plugins: {
	// 		'react-hooks': reactHooksPlugin,
	// 	},
	// 	rules: reactHooksPlugin.configs.recommended.rules,
	// }),

	defineConfig({
		files: ['**/*.{jsx,tsx}'],

		rules: {
			// https://eslint.org/docs/latest/rules/jsx-quotes
			'@stylistic/jsx-quotes': ['error', 'prefer-double'],

			'react/jsx-indent-props': ['error', 'tab'],

			'react/jsx-max-props-per-line': ['error', {
				maximum: 1,
			}],

			'unicorn/filename-case': ['error', {
				case: 'pascalCase',
				ignore: [
					'\\.spec\\.tsx$',
				],
			}],
		},

	}),
];
