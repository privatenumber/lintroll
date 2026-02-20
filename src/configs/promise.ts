import promisePlugin from 'eslint-plugin-promise';
import { defineConfig } from '../utils/define-config.ts';
import { jsAndTs } from '../utils/globs.ts';

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
