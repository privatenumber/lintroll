module.exports = {
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
	].map(rulePath => require.resolve(rulePath)),
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	ignorePatterns: [
		'**/node_modules/**',
		'**/bower_components/**',
		'flow-typed/**',
		'coverage/**',
		'{tmp,temp}/**',
		'**/*.min.js',
		'vendor/**',
		'dist/**',
		'tap-snapshots/*.{cjs,js}',
	],
	overrides: [
		{
			files: ['**/test/*'],
			env: {
				jest: true,
			},
		},
	],
};
