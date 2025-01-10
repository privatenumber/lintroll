import eslintCommentsPlugin from '@eslint-community/eslint-plugin-eslint-comments';
import { defineConfig } from '../utils/define-config.js';
import { jsAndTs } from '../utils/globs.js';

export const eslintComments = defineConfig({
	files: jsAndTs,
	plugins: {
		'@eslint-community/eslint-comments': eslintCommentsPlugin,
	},
	rules: {
		...eslintCommentsPlugin.configs.recommended.rules,

		// Deprecated in favor of official reportUnusedDisableDirectives
		// https://github.com/eslint-community/eslint-plugin-eslint-comments/issues/133
		'@eslint-community/eslint-comments/no-unused-enable': 'off',
	},
});
