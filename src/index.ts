import confusingBrowserGlobals from 'confusing-browser-globals';
import { createConfig } from './utils/create-config';
import { isInstalled } from './utils/is-installed';

export = createConfig({
	extends: [
		'./rules/best-practices',
		'./rules/errors',
		'./rules/node',
		'./rules/style',
		'./rules/variables',
		'./rules/es6',
		'./rules/imports',
		'./rules/promise',
		'./rules/unicorn',
		'./rules/no-use-extend-native',
		'./rules/eslint-comments',
		'./rules/json',
		'./rules/regexp',
		'./rules/typescript',
		'./rules/vue',
		'./rules/react',
		'./rules/markdown',
	].map(rulePath => require.resolve(rulePath)),

	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},

	ignorePatterns: [
		'**/node_modules/**',
		'{tmp,temp}/**',
		'**/*.min.js',
		'**/vendor/**',
		'**/dist/**',
	],

	overrides: [
		...(
			isInstalled('jest')
				? [{
					files: '**/{test,tests}/*',
					env: {
						jest: true,
					},
				}]
				: []
		),

		// Service Workers
		{
			files: '*.sw.js',
			env: {
				serviceworker: true,
			},
			rules: {
				'no-restricted-globals': [
					'error',
					...confusingBrowserGlobals.filter(variable => variable !== 'self'),
				],
			},
		},
	],
});
