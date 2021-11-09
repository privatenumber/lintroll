/** @typedef { import('eslint').Linter.Config } ESLintConfig */

const confusingBrowserGlobals = require('confusing-browser-globals');

/** @type { ESLintConfig } */
const config = {
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
	].map(rulePath => require.resolve(rulePath)),
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	ignorePatterns: [
		'**/node_modules/**',
		'coverage/**',
		'{tmp,temp}/**',
		'**/*.min.js',
		'**/vendor/**',
		'**/dist/**',
	],
	overrides: [
		{
			files: '**/{test,tests}/*',
			env: {
				jest: true,
			},
		},
		{
			files: '*.sw.js',
			env: {
				serviceworker: true,
			},
			rules: {
				'no-restricted-globals': [
					'error',
					...confusingBrowserGlobals.filter(g => g !== 'self'),
				],
			},
		},
	],
};

module.exports = config;
