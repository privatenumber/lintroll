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

				'@typescript-eslint/member-delimiter-style': [
					'error',
					{
						multiline: {
							delimiter: 'none',
							requireLast: false,
						},
						singleline: {
							delimiter: 'semi',
							requireLast: false,
						},
						multilineDetection: 'brackets',
					},
				],

				'@typescript-eslint/no-unused-vars': 'off',
			},
		},
	],
};
