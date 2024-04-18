import promisePlugin from 'eslint-plugin-promise';
import { defineConfig } from '../utils/define-config.js';

export const promise = [
	defineConfig({
		plugins: {
			promise: promisePlugin,
		},
		rules: {
			...promisePlugin.configs.recommended.rules,

			'promise/always-return': 'off',
			'promise/catch-or-return': ['error', {
				allowThen: true,
			}],

			// Until this plugin is compatible with ESLint v9
			'promise/no-return-wrap': 'off',
			'promise/no-promise-in-callback': 'off',
			'promise/no-nesting': 'off',
			'promise/no-callback-in-promise': 'off',
		},
	}),
];
