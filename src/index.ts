import { createConfig } from './utils/create-config.js';

export = createConfig({
	extends: [
		'./rules/base',
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

	ignorePatterns: [
		// Nested node_modules
		'**/node_modules/**',

		'{tmp,temp}/**',
		'**/*.min.js',
		'**/vendor/**',
		'**/dist/**',
	],
});