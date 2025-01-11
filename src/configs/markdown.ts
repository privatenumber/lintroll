import markdownPlugin from '@eslint/markdown';
import { defineConfig } from '../utils/define-config.js';

export const markdown = () => [
	...markdownPlugin.configs.processor,

	defineConfig({
		files: ['**/*.md'],
		language: 'markdown/gfm',
		rules: {
			// https://github.com/eslint/markdown/issues/294
			'markdown/no-missing-label-refs': 'off',

			'markdown/heading-increment': 'off',
		},
	}),

	defineConfig({
		files: ['**/*.md/*.{js,jsx,ts,tsx,vue}'],
		rules: {
			'import-x/extensions': 'off',
			'import-x/no-extraneous-dependencies': 'off',
			'import-x/no-unresolved': 'off',
			'no-console': 'off',
			'no-new': 'off',
			'no-empty-function': 'off',
			'no-useless-constructor': 'off',

			// Can be snippets that don't fully work
			'no-undef': 'off',

			'n/hashbang': 'off',
			'n/global-require': 'off',

			// Allow unused expressions like: argv.command // => "install" (string)
			'no-unused-expressions': 'off',
			'unicorn/filename-case': 'off',

			// Loose on example code
			'unicorn/no-array-reduce': 'off',
			'unicorn/prefer-object-from-entries': 'off',
			'unicorn/no-anonymous-default-export': 'off',
			'unicorn/no-array-callback-reference': 'off',

			// Style
			'@stylistic/indent': ['error', 4],
			'@stylistic/semi': ['error', 'never'],
			'@stylistic/comma-dangle': ['error', 'never'],
		},
	}),

	defineConfig({
		files: ['**/*.md/*.{js,jsx,vue}'],
		rules: {
			'no-unused-vars': 'warn',
		},
	}),

	defineConfig({
		files: ['**/*.md/*.{jsx,tsx}'],
		rules: {
			'react/jsx-indent-props': ['error', 4],
			'react/jsx-no-undef': 'off',
			'react/react-in-jsx-scope': 'off',
		},
	}),

	defineConfig({
		files: ['**/*.md/*.vue'],
		rules: {
			'vue/html-indent': ['error', 4],
			'vue/no-undef-components': 'warn',
			'vue/require-v-for-key': 'off',
		},
	}),

	defineConfig({
		files: ['**/*.md/*.{ts,tsx}'],
		rules: {
			'@stylistic/member-delimiter-style': [
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
			'@typescript-eslint/no-unused-expressions': 'warn',
		},
	}),

	defineConfig({
		files: ['**/*.md/*.{json,json5}'],
		rules: {
			'jsonc/indent': ['error', 4],
			// 'unicorn/filename-case': 'off',
		},
	}),
];
