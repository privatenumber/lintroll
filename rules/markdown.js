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
				'import/no-unresolved': 'off',
				'no-console': 'off',
				semi: ['error', 'never'],
				'comma-dangle': ['error', 'never'],
			},
		},
	],
};
