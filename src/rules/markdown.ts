import { createConfig } from '../utils/create-config.js';

export = createConfig({
	overrides: [
		{
			files: '**/*.md',
			plugins: ['markdown'],
			processor: 'markdown/markdown',
		},
		{
			files: '**/*.md/*.{js,jsx,ts,tsx,vue}',
			rules: {
				'import/extensions': 'off',
				'import/no-unresolved': 'off',
				'no-console': 'off',

				'no-new': 'off',
				// Can be snippets that don't fully work
				'no-undef': 'off',
				// 'n/no-missing-import': 'off',

				// Allow unused expressions like: argv.command // => "install" (string)
				'no-unused-expressions': 'off',
				'no-unused-vars': 'warn',
				'unicorn/filename-case': 'off',

				// Loose on example code
				'unicorn/no-array-reduce': 'off',
				'unicorn/prefer-object-from-entries': 'off',
			},
		},
		{
			files: '**/*.md/*.{jsx,tsx}',
			rules: {
				'react/jsx-indent-props': ['error', 4],
				'react/jsx-no-undef': 'off',
				'react/react-in-jsx-scope': 'off',
			},
		},
		{
			files: '**/*.md/*.{js,jsx,vue}',
			rules: {
				// Style
				'@stylistic/indent': ['error', 4],
				'@stylistic/semi': ['error', 'never'],
				'@stylistic/comma-dangle': ['error', 'never'],
			},
		},
		{
			files: '**/*.md/*.vue',
			rules: {
				'vue/html-indent': ['error', 4],
				'vue/no-undef-components': 'warn',
				'vue/require-v-for-key': 'off',
			},
		},
		{
			files: '**/*.md/*.{ts,tsx}',
			rules: {
				'@typescript-eslint/comma-dangle': ['error', 'never'],
				'@typescript-eslint/indent': ['error', 4],
				'@typescript-eslint/member-delimiter-style': [
					'error',
					{
						multiline: {
							delimiter: 'none',
							requireLast: false,
						},
						multilineDetection: 'brackets',
						singleline: {
							delimiter: 'semi',
							requireLast: false,
						},
					},
				],
				'@typescript-eslint/no-unused-vars': 'warn',
				'@typescript-eslint/semi': ['error', 'never'],

				// Style
				'@stylistic/indent': 'off',
				'@stylistic/semi': 'off',
				'@stylistic/comma-dangle': 'off',
			},
		},
		{
			files: '**/*.md/*.{json,json5}',
			rules: {
				'jsonc/indent': ['error', 4],
				'unicorn/filename-case': 'off',
			},
		},
	],
});
