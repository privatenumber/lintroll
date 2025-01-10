import promisePlugin from 'eslint-plugin-promise';
import { defineConfig } from '../utils/define-config.js';
import { jsAndTs } from '../utils/globs.js';

export const promise = defineConfig({
	files: jsAndTs,
	plugins: {
		promise: promisePlugin,
	},
	rules: {
		...promisePlugin.configs.recommended.rules,
		'promise/always-return': 'off',
		'promise/catch-or-return': ['error', {
			allowThen: true,
		}],
	},
});
