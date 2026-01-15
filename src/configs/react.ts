import type { TsConfigResult } from 'get-tsconfig';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { defineConfig } from '../utils/define-config.js';

export const react = (_tsconfig: TsConfigResult | null) => defineConfig({
	files: ['**/*.{jsx,tsx}'],

	plugins: {
		react: reactPlugin,
		'react-hooks': reactHooksPlugin,
	},

	languageOptions: {
		parserOptions: reactPlugin.configs['jsx-runtime'].parserOptions,
	},

	settings: {
		react: {
			version: 'detect',
		},
	},

	rules: {
		...reactPlugin.configs.recommended.rules,
		...reactHooksPlugin.configs.recommended.rules,

		// React 17+ with new JSX transform doesn't require importing React
		// https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
		'react/react-in-jsx-scope': 'off',

		// https://eslint.org/docs/latest/rules/jsx-quotes
		'@stylistic/jsx-quotes': ['error', 'prefer-double'],

		'@stylistic/jsx-indent-props': ['error', 'tab'],

		'@stylistic/jsx-max-props-per-line': ['error', {
			maximum: 1,
		}],

		'unicorn/filename-case': ['error', {
			case: 'pascalCase',
			ignore: [
				String.raw`\.spec\.tsx$`,
			],
		}],
	},
});
