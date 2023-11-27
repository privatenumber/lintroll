import { getTsconfig } from 'get-tsconfig';
import { createConfig } from '../utils/create-config.js';

const tsconfig = getTsconfig();
const jsx = tsconfig?.config.compilerOptions?.jsx;
const autoJsx = jsx === 'react-jsx' || jsx === 'react-jsxdev';

export = createConfig({
	overrides: [
		{
			files: '*.{jsx,tsx}',

			extends: [
				// https://github.com/yannickcr/eslint-plugin-react/blob/c8917b0/index.js
				'plugin:react/recommended',

				// React automatically imported in JSX files
				...(autoJsx ? ['plugin:react/jsx-runtime'] : []),

				'plugin:react-hooks/recommended',
			],

			settings: {
				react: {
					version: 'detect',
				},
			},

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
		},
	],
});
