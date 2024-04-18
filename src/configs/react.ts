import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { getTsconfig } from 'get-tsconfig';
import { defineConfig } from '../utils/define-config.js';

const tsconfig = getTsconfig();
const jsx = tsconfig?.config.compilerOptions?.jsx;

// React automatically imported in JSX files
const autoJsx = jsx === 'react-jsx' || jsx === 'react-jsxdev';

export const react = defineConfig({
	files: ['**/*.{jsx,tsx}'],

	plugins: {
		react: reactPlugin,
		'react-hooks': reactHooksPlugin,
	},

	languageOptions: {
		parserOptions: (
			autoJsx
				? reactPlugin.configs['jsx-runtime'].parserOptions
				: reactPlugin.configs.recommended.parserOptions
		),
	},

	settings: {
		react: {
			version: 'detect',
		},
	},

	rules: {
		...reactPlugin.configs.recommended.rules,
		...(
			autoJsx
				? reactPlugin.configs['jsx-runtime'].rules
				: {}
		),

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

		// Until this plugin is compatible with ESLint v9
		'react/jsx-uses-vars': 'off',
	},
});
