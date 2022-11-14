import { createConfig } from './utils/create-config.js';

export = createConfig({
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},

	ignorePatterns: [
		// Nested node_modules
		'**/node_modules/**',

		'{tmp,temp}/**',
		'**/*.min.js',
		'**/vendor/**',
		'**/dist/**',
	],

	extends: [
		'./rules/best-practices',
		'./rules/errors',
		'./rules/style',
		'./rules/variables',
		'./rules/es6',
		'./rules/node',
		'./rules/regexp',
		'./rules/imports',
		'./rules/promise',
		'./rules/unicorn',
		'./rules/no-use-extend-native',
		'./rules/eslint-comments',
		'./rules/json',
		'./rules/typescript',
		'./rules/vue',
		'./rules/react',
		'./rules/markdown',
		'./rules/service-workers',
		'./rules/jest',
	],
});
