import markdownPlugin from 'eslint-plugin-markdown';
import { defineConfig } from '../utils/define-config.js';
import type { Options } from '../types.js';

const [, baseMdSubfiles] = markdownPlugin.configs.recommended.overrides!;

export const markdown = (
	options?: Options,
) => [
	defineConfig({
		files: ['**/*.md'],
		plugins: {
			markdown: markdownPlugin,
		},
		processor: {
			name: 'markdown/markdown',
			...markdownPlugin.processors.markdown,
		},
	}),

	defineConfig({
		files: ['**/*.md/**'],
		languageOptions: {
			parserOptions: baseMdSubfiles.parserOptions,
		},
		rules: baseMdSubfiles.rules,
	}),

	defineConfig({
		files: ['**/*.md/*.{js,jsx,ts,tsx,vue}'],
		rules: {
			'import/extensions': 'off',
			'import/no-extraneous-dependencies': 'off',
			'import/no-unresolved': 'off',
			'no-console': 'off',
			'no-new': 'off',
			'no-empty-function': 'off',
			'no-useless-constructor': 'off',

			// Can be snippets that don't fully work
			'no-undef': 'off',

			'n/shebang': 'off',

			// Allow unused expressions like: argv.command // => "install" (string)
			'no-unused-expressions': 'off',
			'unicorn/filename-case': 'off',

			// Loose on example code
			'unicorn/no-array-reduce': 'off',
			'unicorn/prefer-object-from-entries': 'off',

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

	...(
		options?.vue
			? [defineConfig({
				files: ['**/*.md/*.vue'],
				rules: {
					'vue/html-indent': ['error', 4],
					'vue/no-undef-components': 'warn',
					'vue/require-v-for-key': 'off',
				},
			})]
			: []
	),

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
		},
	}),

	defineConfig({
		files: ['**/*.md/*.{json,json5}'],
		rules: {
			'jsonc/indent': ['error', 4],
			'unicorn/filename-case': 'off',
		},
	}),
];
