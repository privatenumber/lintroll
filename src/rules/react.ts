import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { getTsconfig } from 'get-tsconfig';
import { defineConfig } from '../utils/define-config';

const tsconfig = getTsconfig();
const jsx = tsconfig?.config.compilerOptions?.jsx;
const autoJsx = jsx === 'react-jsx' || jsx === 'react-jsxdev';

export const react = defineConfig({
	files: ['**/*.{jsx,tsx}'],

	languageOptions: {
		parserOptions: reactPlugin.configs.recommended.parserOptions,
	},

	plugins: {
		react: reactPlugin,
		'react-hooks': reactHooksPlugin,
	},

	settings: {
		react: {
			version: 'detect',
		},
	},

	rules: {
		// https://github.com/yannickcr/eslint-plugin-react/blob/c8917b0/index.js
		...reactPlugin.configs.recommended.rules,

		// React automatically imported in JSX files
		...(autoJsx ? reactPlugin.configs['jsx-runtime'].rules : {}),

		...reactHooksPlugin.configs.recommended.rules,

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

});
