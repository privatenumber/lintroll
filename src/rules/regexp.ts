import type { ESLint } from 'eslint';
import type { FlatESLintConfig } from 'eslint-define-config';
import * as regexpPlugin from 'eslint-plugin-regexp';

export const regexp: FlatESLintConfig[] = [{
	plugins: {
		regexp: regexpPlugin as unknown as ESLint.Plugin,
	},
	rules: regexpPlugin.configs.recommended.rules,
}];
