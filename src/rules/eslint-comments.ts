import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import { defineConfig } from '../utils/define-config.js';

export const eslintComments = defineConfig({
	plugins: {
		'eslint-comments': eslintCommentsPlugin,
	},
	rules: {
		...eslintCommentsPlugin.configs.recommended.rules,

		// Disabled in favor of `unicorn/no-abusive-eslint-disable`
		// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/c137daa/index.js#L33
		'eslint-comments/no-unlimited-disable': 'off',

		// Disallow disable directives that don't affect any rules
		'eslint-comments/no-unused-disable': 'error',
	},
});
