import noUseExtendNativePlugin from 'eslint-plugin-no-use-extend-native';
import { defineConfig } from '../utils/define-config.ts';

export const noUseExtendNative = [
	defineConfig({
		plugins: {
			'no-use-extend-native': noUseExtendNativePlugin,
		},
		rules: noUseExtendNativePlugin.configs.recommended.rules,
	}),
];
