module.exports = {
	overrides: [
		{
			files: '*.md',
			plugins: ['markdown'],
			processor: 'markdown/markdown',
		},
		{
			files: ['**/*.md/*.{js,ts}'],
			rules: {
				'unicorn/filename-case': 'off',
				'no-console': 'off',

				// Can be snippets that don't fully work
				'no-undef': 'off',
				'import/no-unresolved': 'off',

				// Style
				indent: ['error', 4],
				'@typescript-eslint/indent': ['error', 4],

				semi: ['error', 'never'],
				'@typescript-eslint/semi': ['error', 'never'],

				'comma-dangle': ['error', 'never'],
				'@typescript-eslint/comma-dangle': ['error', 'never'],
			},
		},
	],
};
