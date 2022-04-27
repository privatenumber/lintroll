module.exports = {
	overrides: [
		{
			files: '*.md',
			plugins: ['markdown'],
			processor: 'markdown/markdown',
		},
		{
			files: '**/*.md/*.{js,jsx,ts,tsx}',
			rules: {
				'unicorn/filename-case': 'off',
				'no-console': 'off',

				// Can be snippets that don't fully work
				'no-undef': 'off',
				'import/no-unresolved': 'off',
				'import/extensions': 'off',

				// Allow unused expressions like: argv.command // => "install" (string)
				'no-unused-expressions': 'off',

				// Loose on example code
				'unicorn/no-array-reduce': 'off',
				'unicorn/prefer-object-from-entries': 'off',
			},
		},
		{
			files: '**/*.md/*.{jsx,tsx}',
			rules: {
				'react/jsx-indent-props': ['error', 4],
			},
		},
		{
			files: '**/*.md/*.js',
			rules: {
				// Style
				indent: ['error', 4],
				semi: ['error', 'never'],
				'comma-dangle': ['error', 'never'],
			},
		},
		{
			files: '**/*.md/*.ts',
			rules: {
				// Style
				indent: 'off',
				'@typescript-eslint/indent': ['error', 4],
				semi: 'off',
				'@typescript-eslint/semi': ['error', 'never'],
				'comma-dangle': 'off',
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
		{
			files: '**/*.md/*.{json,json5}',
			rules: {
				'unicorn/filename-case': 'off',
				'jsonc/indent': ['error', 4],
			},
		},
	],
};
