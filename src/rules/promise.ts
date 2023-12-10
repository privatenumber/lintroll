import { defineConfig } from '../utils/define-config.js';
import { flatCompat } from '../utils/flat-compat.js';

export const promise = [
	...flatCompat.extends('plugin:promise/recommended'),
	defineConfig({
		rules: {
			'promise/always-return': 'off',
			'promise/catch-or-return': ['error', {
				allowThen: true,
			}],
		},
	}),
];
