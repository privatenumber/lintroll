import type { FlatESLintConfig } from 'eslint-define-config';
import noUseExtendNativePlugin from 'eslint-plugin-no-use-extend-native';

export const noUseExtendNative = {
	plugins: {
		'no-use-extend-native': noUseExtendNativePlugin,
	},
	rules: noUseExtendNativePlugin.configs.recommended.rules,
} satisfies FlatESLintConfig;
