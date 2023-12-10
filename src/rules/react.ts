import { getTsconfig } from 'get-tsconfig';
import { defineConfig } from '../utils/define-config';
import { resolveConfig } from '../utils/resolve-config.js';

const tsconfig = getTsconfig();
const jsx = tsconfig?.config.compilerOptions?.jsx;
const autoJsx = jsx === 'react-jsx' || jsx === 'react-jsxdev';

export const react = [
	// https://github.com/yannickcr/eslint-plugin-react/blob/c8917b0/index.js
	...resolveConfig({
		extends: 'plugin:react/recommended',
		settings: {
			react: {
				version: 'detect',
			},
		},
	}),

	// React automatically imported in JSX files
	...(
		autoJsx
			? resolveConfig('plugin:react/jsx-runtime')
			: []
	),

	...resolveConfig('plugin:react-hooks/recommended'),

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
