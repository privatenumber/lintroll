import type { ESLint } from 'eslint';
import type { FlatESLintConfig } from 'eslint-define-config'
import noUseExtendNativePlugin from 'eslint-plugin-no-use-extend-native';

export const noUseExtendNative: FlatESLintConfig[] = [{
	plugins: {
		'no-use-extend-native': noUseExtendNativePlugin as unknown as ESLint.Plugin,
	},
	rules: noUseExtendNativePlugin.configs.recommended.rules,
}];
