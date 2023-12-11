import { defineConfig } from '../utils/define-config.js';
import { resolveConfig } from '../utils/resolve-config.js';

export const eslintComments = [
	...resolveConfig('plugin:@eslint-community/eslint-comments/recommended'),

	defineConfig({
		rules: {
			// Deprecated in favor of official reportUnusedDisableDirectives
			// https://github.com/eslint-community/eslint-plugin-eslint-comments/issues/133
			'@eslint-community/eslint-comments/no-unused-enable': 'off',
		},
	}),
];
