// import reactPlugin from 'eslint-plugin-react';
// import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { getTsconfig } from 'get-tsconfig';
import { defineConfig } from '../utils/define-config';
import { resolveConfig } from '../utils/resolve-config.js';

// import { resolvePluginConfig } from '../utils/resolve-plugin-config';

// console.log(resolvePluginConfig(reactPlugin, 'recommended'));
// console.log(resolvePluginConfig(reactHooksPlugin, 'recommended'));
// console.log(resolvePluginConfig(reactPlugin, 'jsx-runtime'));

const tsconfig = getTsconfig();
const jsx = tsconfig?.config.compilerOptions?.jsx;
const autoJsx = jsx === 'react-jsx' || jsx === 'react-jsxdev';

export const react = [
	// https://github.com/yannickcr/eslint-plugin-react/blob/c8917b0/index.js
	...resolveConfig('plugin:react/recommended'),

	// React automatically imported in JSX files
	...(autoJsx ? resolveConfig('plugin:react/jsx-runtime') : []),

	...resolveConfig('plugin:react-hooks/recommended'),

	defineConfig({
		files: ['**/*.{jsx,tsx}'],

		// settings: {
		// 	react: {
		// 		version: 'detect',
		// 	},
		// },

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
