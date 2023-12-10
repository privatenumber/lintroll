import { defineConfig } from '../utils/define-config.js';
import { resolveConfig } from '../utils/resolve-config.js';

export const promise = [
	...resolveConfig('plugin:promise/recommended'),
	defineConfig({
		rules: {
			'promise/always-return': 'off',
			'promise/catch-or-return': ['error', {
				allowThen: true,
			}],
		},
	}),
];
