import type { ESLint } from 'eslint';
import type { FlatESLintConfig } from 'eslint-define-config';
import promisePlugin from 'eslint-plugin-promise';

export const promise: FlatESLintConfig[] = [{
	plugins: {
		promise: promisePlugin as unknown as ESLint.Plugin,
	},
	rules: {
		...promisePlugin.configs.recommended.rules,
		'promise/always-return': 'off',
		'promise/catch-or-return': ['error', {
			allowThen: true,
		}],
	},
}];
